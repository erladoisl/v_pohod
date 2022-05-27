from hike.models import Hike
from hike.models import HikeDay
from menu.models import Eating
from menu.models import Ingredient
from menu.util import get_amount_ingredient


def get_dates(days) -> str:
    if len(days) == 0:
        res = 'не определено'
    if len(days) == 1:
        res = f'{days[0].date}'
    else:
        res = f'c {days[0].date} по {days[len(days) - 1].date}'

    return res


def get_text_format(workbook, bold=False, vertical=False, text_wrap=True, align='left', border=False, border_top=False, border_left=False):
    format = workbook.add_format()

    if bold:
        format.set_bold()
    if vertical:
        format.set_rotation(90)
    if text_wrap:
        format.set_text_wrap()
    if border:
        format.set_border()
    if border_top:
        format.set_top()
    if border_left:
        format.set_left()

    format.set_align(align)

    return format


def add_description(workbook, hike, days) -> None:
    worksheet = workbook.add_worksheet(name='описание')
    set_width(worksheet, [0, 1], [25, 50])

    dataclass = (
        ['Название похода:', hike.name],
        ['Описание:', hike.description],
        ['Количество участников:', hike.participant_count],
        ['Даты:', get_dates(days)],
    )

    for i, row in enumerate(dataclass):
        for j, item in enumerate(row):
            worksheet.write(i, j, item, get_text_format(
                workbook, bold=(j == 0)))


def set_width(worksheet, cols, widths):
    '''
        Для указания ширины столбцов в таблице

        Arguments:
            worksheet - страница
            cols - список номеров слобцов для установки ширины
            widths - список широт столбцов относительно cols
    '''
    for col, width in zip(cols, widths):
        worksheet.set_column(col, col, width)


def add_total_amount(workbook, statistic) -> None:
    '''
        Создается страница таблицы с полным списком продуктов и их количеством для статистики
    '''
    worksheet = workbook.add_worksheet(name='закупка')
    set_width(worksheet, [0, 1, 2, 3], [20, 11, 4, 15])

    worksheet.write(0, 0, 'Название продукта',
                    get_text_format(workbook, bold=True))
    worksheet.write(0, 1, 'Общее количество',
                    get_text_format(workbook, bold=True))
    worksheet.write(0, 2, '', get_text_format(workbook, bold=True))
    worksheet.write(0, 3, 'Количество приемов пищи',
                    get_text_format(workbook, bold=True))

    for i, food in enumerate(statistic.keys()):
        worksheet.write(i + 1, 0, food)
        worksheet.write(i + 1, 1, statistic[food][0])
        worksheet.write(i + 1, 2, statistic[food][1])
        worksheet.write(i + 1, 3, statistic[food][2])


def add_border(workcheet, workbook, cols_count, rows_count):
    '''
        Добавляет рамку вокруг раскладки
    '''
    workcheet.merge_range(rows_count, 0, rows_count, cols_count - 1,
                          '', get_text_format(workbook, border_top=True))
    workcheet.merge_range(0, cols_count, rows_count - 1, cols_count,
                          '', get_text_format(workbook, border_left=True))


def add_ingredient(worksheet, workbook, ingredient, statistic, row, start_col, border_top):
    amount = get_amount_ingredient(ingredient)
    old_stat = statistic.get(ingredient.food.name, (0, '', 0))
    worksheet.write(row, start_col, ingredient.food.name,
                    get_text_format(workbook, border_top=border_top))
    worksheet.write(row, start_col + 1, amount,
                    get_text_format(workbook, border_top=border_top))
    worksheet.write(row, start_col + 2, ingredient.food.unit,
                    get_text_format(workbook, border_top=border_top))
    statistic[ingredient.food.name] = (
        old_stat[0] + amount, ingredient.food.unit, old_stat[2] + 1)


def add_menu(workbook, days) -> None:
    worksheet = workbook.add_worksheet(name='раскладка')
    statistic = {}
    max_row = 0

    for i, day in enumerate(days):
        worksheet.merge_range(0, i * 5, 0, i * 5 + 4, f'{i + 1} день ({day.date})', get_text_format(
            workbook, bold=True, align='center', border=True))
        row = 1

        for eating in Eating.objects.filter(hikeDay=day).order_by('eating_category_id'):
            ingredients = Ingredient.objects.filter(eating=eating)
            worksheet.merge_range(row, i * 5, row + max([10, len(ingredients)]) - 1, i * 5,
                                  eating.eating_category.name, get_text_format(workbook, bold=True, border=True, vertical=True))
            worksheet.merge_range(row, i * 5 + 1, row + max([10, len(ingredients)]) - 1, i * 5 + 1,
                                  eating.name, get_text_format(workbook, bold=True, border=True, vertical=True))
            set_width(
                worksheet, [i * 5 + j for j in range(5)], [3, 3, 18, 7, 3])

            for j, ingredient in enumerate(ingredients):
                add_ingredient(worksheet, workbook, ingredient,
                               statistic, row + j, i * 5 + 2, j == 0)

            row += max([10, len(ingredients)])

        max_row = max([max_row, row])

    add_total_amount(workbook, statistic)
    add_border(worksheet, workbook, len(days) * 5, max_row)


def get_hike_in_xlsx(workbook, hike_id):
    '''
        В таблицу добавляется информация о походе
    '''
    hike = Hike.objects.get(pk=hike_id)
    days = HikeDay.objects.filter(hike=hike).order_by('date')

    add_description(workbook, hike, days)
    add_menu(workbook, days)

    workbook.close()

    return f'{hike.name}.xlsx'
    
