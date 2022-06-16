from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.views import APIView
import logging
import traceback
from menu.models import EatingCategory, Food
from django.core import serializers
from menu.models import Formula
from hike.models import HikeDay
from menu.models import Eating
from menu.models import Ingredient
from menu.to_xlsx import get_hike_in_xlsx
from .util import add_amount_ingredient, get_eating_category, get_food_json, get_formula, get_food
import xlsxwriter


class EatingCategoryView(APIView):
    # permission_classes = [IsAuthenticated, ]

    def get(self, request, *args, **kwargs):
        try:
            eatingCategories = EatingCategory.objects.all()
            context = {
                'error': False,
                'data': serializers.serialize('json', eatingCategories)
            }
        except:
            context = {
                'error': True,
                'message': 'Ошибка при получении списка категорий приемов пищи'
            }
            logging.error(
                f'ERROR while getting EatingCategory\n{traceback.format_exc()}')
        finally:
            return Response(data=context)

    def post(self, request, *args, **kwargs):
        res = {'error': False, 'message': 'Успешно'}
        try:
            eating_category_id = request.data.get('id', -1)
            name = request.data.get('name')

            if len(EatingCategory.objects.filter(name=name)) > 0 and EatingCategory.objects.filter(name=name)[0].pk != eating_category_id:
                res = {'error': True, "message": "Название не уникальное"}
            else:
                if eating_category_id > 0:
                    eating_category = EatingCategory.objects.get(
                        pk=eating_category_id)
                    if eating_category.name == name:
                        res = {'error': False, 'message': ''}
                    else:
                        eating_category.name = name
                        eating_category.save()
                        res = {'error': False, 'message': 'Изменения сохранены'}
                else:
                    eating_category = EatingCategory(name=name)
                    eating_category.save()
                    res = {'error': False, 'message': 'Успешно добавлен тип'}
        except:
            res = {
                'error': True, 'message': 'Ошибка при изменении объекта категория приема пищи'}
            logging.error(
                f'Error while adding EatingCategory\n{traceback.format_exc()}')
        finally:
            return Response(res)

    def delete(self, request, *args, **kwargs):
        res = {
            'error': False,
            'message': 'Успешно удалено'
        }

        try:
            name = request.data.get('name', '')
            eatingCategory = EatingCategory.objects.get(name=name)
            eatingCategory.delete()
        except EatingCategory.DoesNotExist:
            res = {
                'error': True,
                'message': f'Не найден элемент {name}'
            }
        except:
            logging.error(
                f'Error while deleting eating category\n{traceback.format_exc()}')
            res = {
                'error': True,
                'message': 'Ошибка при удалении. Попробуйте чуть позже...'
            }
        finally:
            return Response(res)


class FoodView(APIView):
    # permission_classes = [IsAuthenticated, ]

    def get(self, request):
        try:
            food = Food.objects.all()
            context = {
                'error': False,
                'data': get_food_json(food)
            }
        except:
            context = {
                'error': True,
                'message': 'Ошибка при получении списка продуктов'
            }
            logging.error(
                f'ERROR while getting Food\n{traceback.format_exc()}')
        finally:
            return Response(data=context)

    def post(self, request, *args, **kwargs):
        res = {'error': False, 'message': 'Успешно'}
        try:
            food_id = request.data.get('id', -1)
            name = request.data.get('name', '')
            amount_per_person = request.data.get('amount_per_person', 0)
            unit = request.data.get('unit', 'гр.')
            print(unit)

            if len(Food.objects.filter(name=name)) > 0 and Food.objects.filter(name=name)[0].pk != food_id:
                res = {'error': True, "message": "Название не уникальное"}
            else:
                if food_id > 0:
                    food = Food.objects.get(pk=food_id)
                    if food.name == name and food.amount_per_person == amount_per_person and food.unit == unit:
                        res = {'error': False, 'message': ''}
                    else:
                        food.name = name
                        food.amount_per_person = amount_per_person
                        food.unit = unit
                        food.save()
                        res = {'error': False, 'message': 'Изменения сохранены'}
                else:
                    food = Food(
                        name=name, amount_per_person=amount_per_person, unit=unit)
                    food.save()
                    res = {'error': False, 'message': 'Успешно добавлен продукт'}
        except:
            res = {'error': True, 'message': 'Ошибка при добавлении объекта продукт'}
            logging.error(
                f'Error while adding EatingCategory\n{traceback.format_exc()}')
        finally:
            return Response(res)

    def delete(self, request, *args, **kwargs):
        res = {
            'error': False,
            'message': 'Успешно удалено'
        }

        try:
            name = request.data.get('name', '')
            food = Food.objects.get(name=name)
            food.delete()
        except Food.DoesNotExist:
            res = {
                'error': True,
                'message': f'Не найден элемент {name}'
            }
        except:
            logging.error(
                f'Error while deleting food\n{traceback.format_exc()}')
            res = {
                'error': True,
                'message': 'Ошибка'
            }
        finally:
            return Response(res)


class FormulaView(APIView):
    # permission_classes = [IsAuthenticated, ]

    def get(self, request):
        try:
            food = Formula.objects.all()
            context = {
                'error': False,
                'data': serializers.serialize('json', food)
            }
        except:
            context = {
                'error': True,
                'message': 'Ошибка при получении списка формул'
            }
            logging.error(
                f'ERROR while getting Formula\n{traceback.format_exc()}')
        finally:
            return Response(data=context)

    def post(self, request, *args, **kwargs):
        res = {'error': False, 'message': 'Успешно'}
        try:
            formula_id = request.data.get('id', -1)
            name = request.data.get('name', '')
            value = request.data.get('value', '')

            if len(Formula.objects.filter(name=name)) > 0 and Formula.objects.filter(name=name)[0].pk != formula_id:
                res = {'error': True, "message": "Название не уникальное"}
            else:
                if formula_id > 0:
                    formula = Formula.objects.get(pk=formula_id)
                    if formula.name == name and formula.value == value:
                        res = {'error': False, 'message': ''}
                    else:
                        formula.name = name
                        formula.value = value
                        formula.save()
                        res = {'error': False, 'message': 'Изменения сохранены'}
                else:
                    newFormula = Formula(name=name, value=value)
                    newFormula.save()
                    res = {'error': False, 'message': 'Успешно добавлена формула'}
        except:
            res = {'error': True, 'message': 'Ошибка при добавлении объекта формула'}
            logging.error(
                f'Error while adding Formula\n{traceback.format_exc()}')
        finally:
            return Response(res)

    def delete(self, request, *args, **kwargs):
        res = {
            'error': False,
            'message': 'Успешно удалено'
        }

        try:
            name = request.data.get('name', '')
            formula = Formula.objects.get(name=name)
            formula.delete()
        except Formula.DoesNotExist:
            res = {
                'error': True,
                'message': f'Не найден элемент {name}'
            }
        except:
            logging.error(
                f'Error while deleting formula\n{traceback.format_exc()}')
            res = {
                'error': True,
                'message': 'Ошибка'
            }
        finally:
            return Response(res)


class EatingView(APIView):
    # permission_classes = [IsAuthenticated, ]

    def get(self, request):
        try:
            day_id = request.GET['day_id']
            hike_day = HikeDay.objects.get(pk=day_id)
            eatings = Eating.objects.filter(
                hikeDay=hike_day).order_by('eating_category_id').values()
            context = {
                'error': False,
                'data': eatings
            }
        except:
            context = {
                'error': True,
                'message': 'Ошибка при получении списка приемов пищи'
            }
            logging.error(
                f'ERROR while getting Eating\n{traceback.format_exc()}')
        finally:
            return Response(data=context)

    def post(self, request, *args, **kwargs):
        res = {'error': False, 'message': 'Успешно'}
        try:
            eating_id = request.data.get('id', 0)
            name = request.data.get('name', '')
            description = request.data.get('description', '')
            eating_category_id = int(
                request.data.get('eating_category_id', -1))
            hike_day_id = request.data.get('hikeDay_id')
            number = request.data.get('number', 1)
            eating_category = get_eating_category(eating_category_id)
            hike_day = HikeDay.objects.get(pk=hike_day_id)

            if eating_id > 0:
                eating = Eating.objects.get(pk=eating_id)

                if eating.hikeDay.hike.user.pk == request.user.pk or request.user.is_superuser:
                    eating.name = name
                    eating.description = description
                    eating.number = number
                    eating.eating_category = eating_category
                    eating.save()
                else:
                    res = {
                        'error': True, 'message': 'Нельзя редактировать чужие походы'}
            else:
                eating = Eating(name=name, description=description, hikeDay=hike_day,
                                number=number, eating_category=eating_category)
                eating.save()
        except:
            res = {'error': True, 'message': 'Ошибка при добавлении приема пищи'}
            logging.error(
                f'Error while adding EatingCategory\n{traceback.format_exc()}')
        finally:
            return Response(res)

    def delete(self, request, *args, **kwargs):
        res = {
            'error': False,
            'message': 'Успешно удалено'
        }

        try:
            id = request.data.get('id', '')
            eating = Eating.objects.get(pk=id)
            eating.delete()
        except Eating.DoesNotExist:
            res = {
                'error': True,
                'message': f'Не найден элемент Eating [{id}]'
            }
        except:
            logging.error(
                f'Error while deleting eating\n{traceback.format_exc()}')
            res = {
                'error': True,
                'message': 'Ошибка'
            }
        finally:
            return Response(res)


class IngredientView(APIView):
    # permission_classes = [IsAuthenticated, ]

    def get(self, request):
        try:
            eating_id = request.GET['eating_id']
            eating = Eating.objects.get(pk=eating_id)
            ingredients = Ingredient.objects.filter(eating=eating)
            ingredients_with_amount = add_amount_ingredient(ingredients)
            context = {
                'error': False,
                'data': ingredients_with_amount
            }
        except:
            context = {
                'error': True,
                'message': 'Ошибка при получении списка ингредиентов'
            }
            logging.error(
                f'ERROR while getting Eating\n{traceback.format_exc()}')
        finally:
            return Response(data=context)

    def post(self, request, *args, **kwargs):
        res = {'error': False, 'message': 'Успешно'}

        try:
            ingredient_id = request.data.get('id', 0)
            eating_id = int(request.data.get('eating_id', 0))
            food_id = int(request.data.get('food_id', 0))
            formula_id = int(request.data.get('formula_id', 0))
            comment = request.data.get('comment', '')

            eating = Eating.objects.get(pk=eating_id)
            food = get_food(food_id)
            formula = get_formula(formula_id)

            if ingredient_id > 0:
                ingredient = Ingredient.objects.get(pk=ingredient_id)

                if ingredient.eating.hikeDay.hike.user.pk == request.user.pk or request.user.is_superuser:
                    ingredient.food = food
                    ingredient.formula = formula
                    ingredient.eating = eating
                    ingredient.comment = comment
                    ingredient.save()
                else:
                    res = {
                        'error': True, 'message': 'Нельзя редактировать чужие походы'}
            else:
                ingredient = Ingredient(comment=comment, eating=eating, food=food,
                                        formula=formula)
                ingredient.save()
        except:
            res = {'error': True, 'message': 'Ошибка при добавлении ингредиента'}
            logging.error(
                f'Error while adding Ingredient\n{traceback.format_exc()}')
        finally:
            return Response(res)

    def delete(self, request, *args, **kwargs):
        res = {
            'error': False,
            'message': 'Успешно удалено'
        }

        try:
            id = request.data.get('id', '')
            ingredient = Ingredient.objects.get(pk=id)
            ingredient.delete()
        except Ingredient.DoesNotExist:
            res = {
                'error': True,
                'message': f'Не найден ингредиент [{id}]'
            }
        except:
            logging.error(
                f'Error while deleting ingredient\n{traceback.format_exc()}')
            res = {
                'error': True,
                'message': 'Ошибка'
            }
        finally:
            return Response(res)


class XlsxView(APIView):
    def get(self, request):
        try:
            response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            workbook = xlsxwriter.Workbook(response, {'in_memory': True})
            hike_id = request.GET['hike_id']
            file_name = get_hike_in_xlsx(workbook, hike_id)
            response['Content-Disposition'] = f"attachment; filename={file_name}"
                        
            return response
        except:
            logging.error(
                f'ERROR while getting Xlsx\n{traceback.format_exc()}')

            return Response(data={
                'error': True,
                'message': f'Ошибка при получении xslx файла для похода {hike_id}'
            })
