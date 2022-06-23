# https://www.rootstrap.com/blog/testing-in-django-django-rest-basics-useful-tools-good-practices/

from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from faker import Faker
from .model_factory import UserFactory


class UserLoginTestCase(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.user_object = UserFactory.build()
        cls.user_saved = UserFactory.create()
        cls.client = APIClient()
        cls.sign_up_url = reverse('login')
        cls.registration = reverse('registration')
        cls.edit_user = reverse('edit_user')
        cls.edit_pass = reverse('edit_pass')
        cls.faker_obj = Faker()

    def test_login_correct_pass_and_login(self):
        cur_user = self.user_saved

        signup_dict = {
            'username': cur_user.username,
            'password': 'pass',
        }

        response = self.client.post(self.sign_up_url, data=signup_dict)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['error'], False)
        self.assertEqual(
            response.data['data']['email'],
            cur_user.email,
        )
        self.assertEqual(
            response.data['data']['first_name'],
            cur_user.first_name,
        )
        self.assertEqual(
            response.data['data']['name'],
            cur_user.username,
        )
        self.assertEqual(
            response.data['data']['last_name'],
            cur_user.last_name,
        )
        self.assertEqual(
            response.data['data']['is_superuser'],
            False,
        )

    
    def test_login_password_incorrect(self):
        cur_user = self.user_saved

        signup_dict = {
            'username': cur_user.username,
            'password': 'incorrect pass',
        }

        response = self.client.post(self.sign_up_url, data=signup_dict)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['error'], True)
        self.assertEqual(response.data['message'], 'Не найден пользователь с текущим именем и паролем')

    
    def test_registration_entered_fields_is_correct(self):
        registration_dict = {
            'username': self.user_object.username,
            'password1': 'test_Pass',
            'password2': 'test_Pass',
            'email': self.user_object.email,
            'first_name': self.user_object.first_name,
            'last_name': self.user_object.last_name,
        }

        response = self.client.post(self.registration, registration_dict)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(User.objects.count(), 2)

        new_user = User.objects.get(username=self.user_object.username)
        self.assertEqual(
            new_user.email,
            self.user_object.email,
        )
        self.assertEqual(
            new_user.first_name,
            self.user_object.first_name,
        )
        self.assertEqual(
            new_user.last_name,
            self.user_object.last_name,
        )
        self.assertEqual(
            new_user.is_superuser,
            False,
        )


    def test_registration_username_already_exists(self):
        signup_dict = {
            'username': self.user_saved.username,
            'password1': 'test_Pass',
            'password2': 'test_Pass',
            'email': self.user_object.email,
            'first_name': self.user_object.first_name,
            'last_name': self.user_object.last_name,
        }

        response = self.client.post(self.registration, signup_dict)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data['message'],
            'login должен быть уникальным',
        )


    def test_registration_incorrect_pass(self):
        signup_dict = {
            'username': self.user_saved.username,
            'password1': 'test_Pass',
            'password2': 'test_Pass1',
            'email': self.user_object.email,
            'first_name': self.user_object.first_name,
            'last_name': self.user_object.last_name,
        }

        response = self.client.post(self.registration, signup_dict)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data['message'],
            'Пароли не совпадают',
        )
        

    def test_edit_user_success(self):
        new_user_info_dict = {
            'name': self.user_saved.username,
            'email': 'new email',
            'first_name': 'new first_name',
            'last_name': 'new last_name',
        }

        response = self.client.post(self.edit_user, new_user_info_dict)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Данные успешно обновлены')

        new_user = User.objects.get(username=self.user_saved.username)

        self.assertEqual(new_user.email, 'new email')
        self.assertEqual(new_user.first_name, 'new first_name')
        self.assertEqual(new_user.last_name, 'new last_name')
        

    def test_edit_user_pass_error(self):
        new_user_info_dict = {
            'name': self.user_saved.username,
            'oldPassword': 'pass',
            'password1': 'password1',
            'password2': 'password2',
        }

        response = self.client.post(self.edit_pass, new_user_info_dict)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Пароли не совпадают')
        

    def test_edit_user_pass_success(self):
        new_user_info_dict = {
            'name': self.user_saved.username,
            'oldPassword': 'pass',
            'password1': 'password1',
            'password2': 'password1',
        }

        response = self.client.post(self.edit_pass, new_user_info_dict)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Данные изменены')
        

    def test_edit_user_pass_incorrect_curpassword(self):
        new_user_info_dict = {
            'name': self.user_saved.username,
            'oldPassword': 'incorrect pass',
            'password1': 'password1',
            'password2': 'password1',
        }

        response = self.client.post(self.edit_pass, new_user_info_dict)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Текущий пароль не верный')