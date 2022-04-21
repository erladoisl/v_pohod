from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.paginator import Paginator
import logging
import traceback
from menu.models import Hike
from rest_framework.permissions import IsAuthenticated
from menu.models import EatingCategory, Food
from django.core import serializers
from menu.models import Formula


class HikesView(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request):
        try:
            hikes = Hike.objects.all()
            paginator = Paginator(hikes, 12)
            page_number = request.GET.get('page', 1)

            context = {
                'error': False,
                'hikes': paginator.get_page(page_number)
            }
        except:
            context = {
                'error': True,
                'message': 'Ошибка при получении списка походов'
            }
            logging.error(
                f'ERROR while getting Hike\n{traceback.format_exc()}')
        finally:
            return Response(data=context)


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
            name = request.data.get('name')
            newEC = EatingCategory(name=name)
            newEC.save()
        except:
            res = {
                'error': True, 'message': 'Ошибка при добавлении объекта категория приема пищи'}
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
            logging.error(f'Error while deleting eating category\n{traceback.format_exc()}')
            res = {
                'error': True,
                'message': 'Ошибка'
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
                'data': serializers.serialize('json', food)
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
            name = request.data.get('name')
            amount_per_person = request.data.get('amount_per_person')
            newFood = Food(name=name, amount_per_person=amount_per_person)
            newFood.save()
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
            logging.error(f'Error while deleting food\n{traceback.format_exc()}')
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
            name = request.data.get('name')
            value = request.data.get('value')
            newFormula = Formula(name=name, value=value)
            newFormula.save()
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
            print(name)
            formula = Formula.objects.get(name=name)
            formula.delete()
        except Formula.DoesNotExist:
            res = {
                'error': True,
                'message': f'Не найден элемент {name}'
            }
        except:
            logging.error(f'Error while deleting formula\n{traceback.format_exc()}')
            res = {
                'error': True,
                'message': 'Ошибка'
            }
        finally:
            return Response(res)