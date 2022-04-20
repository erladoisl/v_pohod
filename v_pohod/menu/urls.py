from django.urls import path
from menu.views import EatingCategoryView
from menu.views import HikesView

urlpatterns = [
    path('api/get-hikes/', HikesView.as_view()),
    path('api/eating-category/', EatingCategoryView.as_view()),
]