from datetime import datetime
from numpy import random
import django
from faker import Faker
from hike.models import Hike, HikeDay
from factory import django

from user.tests.model_factory import UserFactory


class HikeFactory(django.DjangoModelFactory):
    class Meta:
        model = Hike

    name = Faker().name()
    participant_count = random.uniform(1, 5)
    description = ''
    user = UserFactory.create()


class HikeDayFactory(django.DjangoModelFactory):
    class Meta:
        model = HikeDay

    name = Faker().name()
    date = datetime.today()
    description = ''
    hike = None
