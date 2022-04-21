from django.urls import path
from menu.views import EatingCategoryView
from menu.views import FoodView
from menu.views import FormulaView

urlpatterns = [
    path('api/eating-category/', EatingCategoryView.as_view()),
    path('api/food/', FoodView.as_view()),
    path('api/formula/', FormulaView.as_view()),
]