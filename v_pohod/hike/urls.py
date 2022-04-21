from django.urls import path
from .views import UserHikesView
from .views import HikesView

urlpatterns = [
    path('api/hikes/', HikesView.as_view()),
    path('api/user-hikes/', UserHikesView.as_view()),
]