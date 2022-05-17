import logging
import traceback
from .models import EatingCategory, Food, Formula


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


def get_food(food_id: int) -> Food:
    '''
        Возвращает тип ингредиента
    '''
    if food_id > 0:
        try:
            return Food.objects.get(pk=food_id)
        except:
            logging.error(
                f'Food[{food_id}] not found\n{traceback.format_exc()}')

    foods = Food.objects.filter()

    if len(foods) > 0:
        return foods[len(foods) - 1]

    return None


def get_formula(formula_id: int) -> Formula:
    '''
        Возвращает формулу
    '''
    if formula_id > 0:
        try:
            return Formula.objects.get(pk=formula_id)
        except:
            logging.error(
                f'Formula[{formula_id}] not found\n{traceback.format_exc()}')

    formulas = Formula.objects.filter()

    if len(formulas) > 0:
        return formulas[len(formulas) - 1]

    return None
