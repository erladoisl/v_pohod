from django.urls import path
from menu.views import EatingCategoryView
from menu.views import FoodView
from menu.views import FormulaView
from menu.views import EatingView
from menu.views import IngredientView

urlpatterns = [
    path('api/eating-category/', EatingCategoryView.as_view()),
    path('api/food/', FoodView.as_view()),
    path('api/formula/', FormulaView.as_view()),
    path('api/hike/day/eatings/', EatingView.as_view()), # получение списка приемов пищи за день, добавление, изменение, удаление
    path('api/hike/day/eating/ingredient/', IngredientView.as_view()), # получение списка игредиентов за прием пищи, добавление, изменение, удаление
]