import django
from faker import Faker
from factory import django
from menu.models import EatingCategory
from menu.models import Food
from numpy import random
from menu.models import Formula
from menu.models import Eating
from menu.models import Ingredient


class EatingCategoryFactory(django.DjangoModelFactory):
    class Meta:
        model = EatingCategory

    name = Faker().name()

class FoodFactory(django.DjangoModelFactory):
    class Meta:
        model = Food

    name = Faker().name()
    amount_per_person = random.uniform(1, 5)
    unit = Faker().name()


class FormulaFactory(django.DjangoModelFactory):
    class Meta:
        model = Formula

    name = Faker().name()
    value = Faker().name()


class EatingFactory(django.DjangoModelFactory):
    class Meta:
        model = Eating

    name = Faker().name()
    hikeDay = None
    eating_category = None
    number = random.uniform(1, 5)
    description = Faker().name()


class IngredientFactory(django.DjangoModelFactory):
    class Meta:
        model = Ingredient

    food = None
    eating = None
    formula = None
    comment = Faker().name()