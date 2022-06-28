from django.urls import path
from menu.views import EatingCategoryView
from menu.views import FoodView
from menu.views import FormulaView
from menu.views import EatingView
from menu.views import IngredientView
from menu.views import XlsxView

urlpatterns = [
    path('api/eating-category/', EatingCategoryView.as_view(), name='eating_categories'),
    path('api/food/', FoodView.as_view(), name='food'),
    path('api/formula/', FormulaView.as_view(), name='formula'),
    path('api/hike/day/eatings/', EatingView.as_view(), name='eating'), # получение списка приемов пищи за день, добавление, изменение, удаление
    path('api/hike/day/eating/ingredient/', IngredientView.as_view(), name='ingredient'), # получение списка игредиентов за прием пищи, добавление, изменение, удаление
    path('api/hike/menu/xlsx/', XlsxView.as_view())
]