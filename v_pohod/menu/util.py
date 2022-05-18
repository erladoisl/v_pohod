import logging
import traceback
from typing import Dict
from math import ceil
from hike.models import Hike, HikeDay
from .models import Eating, EatingCategory, Food, Formula, Ingredient
from django.db.models.query import QuerySet


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


def calculate_amount_per_eating(formula: str, PARTICIPANT_COUNT: int, AMOUNT_PER_PERSON: float, TOTAL_COUNT: int, DAYS_COUNT: int) -> float:
    '''
        Arguments:
            PARTICIPANT_COUNT: int - Количество участников похода
            AMOUNT_PER_PERSON: float - Количество продукта на одного человека за один прием пищи
            TOTAL_COUNT: int - Количество приемов пищи с этим продуктом в данном походе
            DAYS_COUNT: int - Количество дней в походе
        Returns:
            Количество продуктов на один прием пищи для всех участников похода
    '''
    return round(eval(formula.value), 2)


def get_total_count(hike: Hike, food: Food, formula: Formula) -> int:
    '''
        Возвращает количество приемов пищи, в которых есть данный игредиент food, рассчитывающийся по формуле formula в походе hike
    '''
    count = 0

    for day in HikeDay.objects.filter(hike=hike):
        for eating in Eating.objects.filter(hikeDay=day):
            if len(Ingredient.objects.filter(eating=eating, food=food, formula=formula)):
                count += 1

    return count


def add_amount_ingredient(ingredients: QuerySet) -> Dict[str, str]:
    '''
        Возвращает список игредиентов в виде списка словарей:
        [{'id': 3, 'food_id': 31, 'eating_id': 43, 'formula_id': 10, 'comment': '', 'amount': 23}, ...]
    '''
    res = []

    if len(ingredients) > 0:
        PARTICIPANT_COUNT = ingredients[0].eating.hikeDay.hike.participant_count

        for ingredient in ingredients:
            AMOUNT_PER_PERSON = ingredient.food.amount_per_person
            TOTAL_COUNT = get_total_count(
                ingredient.eating.hikeDay.hike, ingredient.food, ingredient.formula)
            DAYS_COUNT = len(HikeDay.objects.filter(
                hike=ingredient.eating.hikeDay.hike))
            amount = calculate_amount_per_eating(
                ingredient.formula, PARTICIPANT_COUNT, AMOUNT_PER_PERSON, TOTAL_COUNT, DAYS_COUNT)
            res.append({'id': ingredient.pk,
                        'food_id': ingredient.food.pk,
                        'eating_id': ingredient.eating.pk,
                        'formula_id': ingredient.formula.pk,
                        'comment': ingredient.comment,
                        'amount': amount})

    return res
