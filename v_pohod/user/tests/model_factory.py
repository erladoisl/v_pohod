import django
from django.contrib.auth.models import User
from factory import django, Faker, PostGenerationMethodCall

class AdminFactory(django.DjangoModelFactory):
    class Meta:
        model = User

    email = 'admin@admin.com'
    username = 'admin'
    password = PostGenerationMethodCall('set_password', 'admin')

    is_superuser = True
    is_staff = True
    is_active = True


class UserFactory(django.DjangoModelFactory):

    class Meta:
        model = User
    
    username = Faker('user_name')
    email = Faker('email')
    first_name = Faker('first_name')
    last_name = Faker('last_name')
    password = PostGenerationMethodCall('set_password', 'pass')