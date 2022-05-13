from django.urls import path
from .views import DeleteHikeDayView, DeleteHikeView, HikeDayView, UpdateHikeDayView
from .views import GetHikeView
from .views import UpdateHikeView
from .views import UserHikesView
from .views import HikesView

urlpatterns = [
    path('api/hikes/', HikesView.as_view()), # получение списка всех походов
    path('api/hike/new/', UpdateHikeView.as_view()), # создание нового похода
    path('api/hike/update/', UpdateHikeView.as_view()), # обновление существующего похода
    path('api/hike/delete/', DeleteHikeView.as_view()), # удаление похода
    path('api/user-hikes/', UserHikesView.as_view()), # получение списка походов юзера
    path('api/get-hike/', GetHikeView.as_view()), # получение инфы о походе по id
    path('api/hike/days/', HikeDayView.as_view()), # получение дней похода
    path('api/hike/day/new/', UpdateHikeDayView.as_view()), # создание нового дня похода
    path('api/hike/day/update/', UpdateHikeDayView.as_view()), # создание нового дня похода
    path('api/hike/day/delete/', DeleteHikeDayView.as_view()), # удаление дня похода
]