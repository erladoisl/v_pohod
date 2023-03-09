import * as XLSX from 'xlsx/xlsx.mjs';
import { get_object, get_objects_by_field, updateIngredientAmount } from './FirebaseService';

function getDateTimeFromTimestamp(unixTimeStamp) {
    let date = unixTimeStamp.toDate()
    return ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear();
}

let add_description = (hike, hike_days, workbook) => {
    let data = [
        ['Название похода:', hike.name],
        ['Описание:', hike.description],
        ['Количество участников:', hike.participant_count],
        ['Даты похода:', `c ${getDateTimeFromTimestamp(hike_days[0].date)} по ${getDateTimeFromTimestamp(hike_days[hike_days.length - 1].date)}`]
    ];
    let worksheet = XLSX.utils.aoa_to_sheet(data);

    workbook.SheetNames.push('ОПИСАНИЕ');
    workbook.Sheets['ОПИСАНИЕ'] = worksheet;
}


const add_ingredient = async(data, ingredient, statistic, row, start_col, border_top) => {
    const food = await get_object('food', ingredient.food_id);
    updateIngredientAmount(ingredient);

    data[row][start_col] = food.name;
    data[row][start_col + 1] = ingredient.amount;
    data[row][start_col + 2] = food.unit;

    if (statistic.has(food.name)) {
        statistic.set(food.name, [statistic.get(food.name)[0] + ingredient.amount, food.unit, statistic.get(food.name)[2] + 1]);
    } else {
        statistic.set(food.name, [ingredient.amount, food.unit, 1]);
    };
};

const add_statistic = (workbook, statistic) => {
    workbook.SheetNames.push('Для закупки');
    let data = [
        ['Название', 'Кол-во', 'Ед.изм.', 'Кол-во приемов пищи']
    ];
    for (const food of statistic.keys()) {
        data.push([food].concat(statistic.get(food)))
    }

    let worksheet = XLSX.utils.aoa_to_sheet(data);
    workbook.Sheets['Для закупки'] = worksheet;
}

const add_menu = async(days, workbook) => {
    workbook.SheetNames.push('Раскладка');
    let merge = [];
    let row = 0
    let i = 0;
    let statistic = new Map();
    let data = Array.from({ length: 100 }, () => Array.from({ length: 100 }, () => ''));

    for await (const day of days) {
        data[0][i * 4] = `${i + 1} день (${getDateTimeFromTimestamp(day.date)})`;
        merge.push({ s: { r: 0, c: i * 4 }, e: { r: 0, c: i * 4 + 3 } });
        row = 1;
        const eatings = await get_objects_by_field('hike_day_id', day.id, 'eatings', 'eating_category_id', true);

        for await (const eating of eatings.objects) {
            const eating_category = await get_object('eating_category', eating.eating_category_id);
            const ingredients = await get_objects_by_field('eating_id', eating.id, 'ingredients');
            merge.push({ s: { r: row, c: i * 4 }, e: { r: row + Math.max(10, ingredients.objects.length) - 1, c: i * 4 } });
            data[row][i * 4] = eating_category.name;

            let j = 0;

            for await (const ingredient of ingredients.objects) {
                await add_ingredient(data, ingredient,
                    statistic, row + j, i * 4 + 1, j === 0);
                j++;
            }
            row += Math.max(10, ingredients.objects.length);
        }
        i++;
    };

    let worksheet = XLSX.utils.aoa_to_sheet(data);
    worksheet["!merges"] = merge
    workbook.Sheets['Раскладка'] = worksheet;

    add_statistic(workbook, statistic)
}

let createExcel = async(hike_id, hike_name) => {
    const hike = await get_object('hikes', hike_id);
    const hike_days = await get_objects_by_field('hike_id', hike_id, 'hike_days', 'date', true)
    let workbook = XLSX.utils.book_new();

    add_description(hike, hike_days.objects, workbook);
    await add_menu(hike_days.objects, workbook);

    const xlsblob = new Blob(
        [new Uint8Array(XLSX.write(workbook, { bookType: "xlsx", type: "array" }))], { type: "application/octet-stream" }
    );

    return xlsblob;
};

export {
    createExcel,
}