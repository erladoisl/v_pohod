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

class DeleteHikeView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
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
    
    
class UpdateHikeView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request, *args, **kwargs):
        res = {'error': False, 'message': 'Успешно сохранено'}
        try:
            user = Token.objects.get(key=getToken(request.META)).user
            hike_id = request.data.get('id', -1)
            name = request.data.get('name')
            description = request.data.get('description')
            participant_count = request.data.get('participant_count')

            if hike_id > 0:
                hike = Hike.objects.get(pk=hike_id)
                if hike.user == user or user.is_superuser:
                    hike.name = name
                    hike.description = description
                    hike.participant_count = participant_count
                    hike.save()
                else:
                    res = {
                        'error': True, 'message': 'Нельзя редактировать чужие походы'}
            else:
                hike = Hike(name=name, description=description,
                            participant_count=participant_count, user=user)
                hike.save()
        except:
            res = {
                'error': True, 'message': 'Ошибка при добавлении похода'}
            logging.error(
                f'Error while adding Hike\n{traceback.format_exc()}')
        finally:
            return Response(res)


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