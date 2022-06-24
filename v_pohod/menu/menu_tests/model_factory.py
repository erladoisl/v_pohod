import django
from faker import Faker
from factory import django
from menu.models import EatingCategory


class EatingCategoryFactory(django.DjangoModelFactory):
    class Meta:
        model = EatingCategory

    name = Faker().name()
