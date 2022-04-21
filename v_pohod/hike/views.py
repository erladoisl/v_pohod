from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.paginator import Paginator
import logging
import traceback
from .models import Hike
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from menu.models import EatingCategory, Food
from django.core import serializers
from menu.models import Formula


def getToken(headers: str) -> str:
    return headers["HTTP_AUTHORIZATION"].split()[-1]


class UserHikesView(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request):
        try:
            user = Token.objects.get(key=getToken(request.META)).user
            hikes = Hike.objects.filter(user_id=user.pk).values()
            context = {
                'error': False,
                'hikes': hikes
            }
        except:
            context = {
                'error': True,
                'message': 'Ошибка при получении списка походов пользователя'
            }
            logging.error(
                f'ERROR while getting UserHikesView\n{traceback.format_exc()}')
        finally:
            return Response(data=context)

    def delete(self, request):
        try:
            user = Token.objects.get(key=getToken(request.META)).user
            hike_id = request.data.get('id')

            if not (user.is_superuser or user == hike_id.user):
                return Response(data={'error': True, 'message': 'Удалять поход может только создатель'})

            hike = Hike.objects.get(pk=hike_id)
            hike.delete()

            context = {
                'error': False,
                'message': "Успешно"
            }
        except Hike.DoesNotExist:
            context = {
                'error': True,
                'message': 'Не найден поход'
            }
        except:
            context = {
                'error': True,
                'message': 'Ошибка'
            }
            logging.error(
                f'ERROR while getting UserHikesView\n{traceback.format_exc()}')
        finally:
            return Response(data=context)


class HikesView(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request):
        try:
            hikes = Hike.objects.filter().values()

            context = {
                'error': False,
                'hikes': hikes
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

    def post(self, request, *args, **kwargs):
        res = {'error': False, 'message': 'Успешно'}
        try:
            user = Token.objects.get(key=getToken(request.META)).user
            print(user.pk)
            name = request.data.get('name')
            description = request.data.get('description')
            participant_count = request.data.get('participant_count')

            print(name, description, participant_count)
            newEC = Hike(name=name, description=description,
                         participant_count=participant_count, user_id=user)
            newEC.save()
        except:
            res = {
                'error': True, 'message': 'Ошибка при добавлении похода'}
            logging.error(
                f'Error while adding Hike\n{traceback.format_exc()}')
        finally:
            return Response(res)