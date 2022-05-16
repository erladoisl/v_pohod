import logging
import traceback
from .models import EatingCategory


def get_eating_category(eating_category_id: int) -> EatingCategory:
    '''
        Возвращает категорию приема пищи
    '''
    if eating_category_id > 0:
        try:
            return EatingCategory.objects.get(pk=eating_category_id)
        except:
            logging.error(
                f'Eating Category[{eating_category_id}] not found\n{traceback.format_exc()}')

    eating_categories = EatingCategory.objects.filter()

    if len(eating_categories) > 0:
        return eating_categories[len(eating_categories) - 1]

    return None
