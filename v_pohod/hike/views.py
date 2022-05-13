from rest_framework.response import Response
from rest_framework.views import APIView
import logging
import traceback
from hike.util import get_default_date
from .models import Hike, HikeDay
from rest_framework.permissions import IsAuthenticated


class DeleteHikeView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        try:
            hike_id = request.data.get('id')
            hike = Hike.objects.get(pk=hike_id)

            if not (request.user.is_superuser) and request.user.pk != hike.user.pk:
                context = {
                    'error': True,
                    'message': "Удалять поход может только создатель"
                }
            else:
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
            hike_id = request.data.get('id', -1)
            name = request.data.get('name')
            description = request.data.get('description')
            participant_count = request.data.get('participant_count')

            if hike_id > 0:
                hike = Hike.objects.get(pk=hike_id)
                if hike.user.pk == request.user.pk or request.user.is_superuser:
                    hike.name = name
                    hike.description = description
                    hike.participant_count = participant_count
                    hike.save()
                else:
                    res = {
                        'error': True, 'message': 'Нельзя редактировать чужие походы'}
            else:
                hike = Hike(name=name, description=description,
                            participant_count=participant_count, user=request.user)
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
            hikes = Hike.objects.filter(user_id=request.user.pk).values()
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


class GetHikeView(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request):
        try:
            hike = Hike.objects.get(pk=request.GET['id'])

            context = {
                'error': False,
                'data': {
                    'id': hike.pk,
                    'name': hike.name,
                    'description': hike.description,
                    'participant_count': hike.participant_count,
                    }
            }
        except:
            context = {
                'error': True,
                'message': f'Ошибка при получении похода c id={request.GET.get("id")}'
            }
            logging.error(
                f'ERROR while getting Hike\n{traceback.format_exc()}')
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


class HikeDayView(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request):
        try:
            hike_id = request.GET['hike_id']
            print(request.data)
            hike = Hike.objects.get(pk=hike_id)
            days = HikeDay.objects.filter(hike=hike).order_by('date').values()

            context = {
                'error': False,
                'days': days
            }
        
        except:
            context = {
                'error': True,
                'message': 'Ошибка при получении дней похода'
            }
            logging.error(
                f'ERROR while getting Hike Days\n{traceback.format_exc()}')
        finally:
            return Response(data=context)

    
class UpdateHikeDayView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request, *args, **kwargs):
        res = {'error': False, 'message': 'Успешно сохранено'}

        try:
            hike_day_id = request.data.get('id', -1)
            hike = Hike.objects.get(pk=request.data.get('hike_id'))
            date = request.data.get('date', get_default_date(hike))
            name = request.data.get('name', date.strftime("%Y-%m-%d"))
            description = request.data.get('description', '')

            if hike_day_id > 0:
                hike_day = HikeDay.objects.get(pk=hike_day_id)

                if hike.user.pk == request.user.pk or request.user.is_superuser:
                    hike_day.name = name
                    hike_day.description = description
                    hike_day.date = date
                    hike_day.hike = hike
                    hike_day.save()
                else:
                    res = {
                        'error': True, 'message': 'Нельзя редактировать чужие походы'}
            else:
                hike_day = HikeDay(name=name, description=description,
                            date=date, hike=hike)
                hike_day.save()
        except:
            res = {
                'error': True, 'message': 'Ошибка при добавлении похода'}
            logging.error(
                f'Error while adding Hike\n{traceback.format_exc()}')
        finally:
            return Response(res)


class DeleteHikeDayView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        try:
            hike_day_id = request.data.get('hike_id')
            hike_day = HikeDay.objects.get(pk=hike_day_id)

            if not (request.user.is_superuser) and request.user.pk != hike_day.hike.user.pk:
                context = {
                    'error': True,
                    'message': "Удалять дни похода может только создатель похода"
                }
            else:
                hike_day.delete()
                context = {
                    'error': False,
                    'message': "Успешно"
                }
        except Hike.DoesNotExist:
            context = {
                'error': True,
                'message': 'Не найден день похода'
            }
        except:
            context = {
                'error': True,
                'message': 'Ошибка'
            }
            logging.error(
                f'ERROR while getting DeleteHikeDayView\n{traceback.format_exc()}')
        finally:
            return Response(data=context)
    