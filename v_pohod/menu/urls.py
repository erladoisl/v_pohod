from django.urls import path
from . import views

urlpatterns = [
    path('', views.HikesView.as_view(), name='main'),
    path('pohod', views.MainView.as_view(), name='pohod'),
    path('hike', views.HikeView.as_view(), name='hike'),
    path('raskladki', views.MainView.as_view(), name='raskladki'),
]