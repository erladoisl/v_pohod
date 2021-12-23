from django.urls import path
from . import views

urlpatterns = [
    path('', views.MainView.as_view(), name='main'),
    path('pohod', views.MainView.as_view(), name='pohod'),
    path('hikes', views.HikesView.as_view(), name='hikes'),
    path('raskladki', views.MainView.as_view(), name='raskladki'),
]