from django.urls import path
from . import views

urlpatterns = [
    path('get-hikes', views.HikesView.as_view(), name='get-hikes'),
]