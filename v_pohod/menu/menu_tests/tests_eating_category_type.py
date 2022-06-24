from datetime import datetime
import json
from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from rest_framework import status
from user.tests.model_factory import UserFactory
from user.tests.model_factory import AdminFactory
from hike.hike_tests.model_factory import HikeFactory, HikeDayFactory
from menu.menu_tests.model_factory import EatingCategoryFactory
from menu.models import EatingCategory


class EatingCategoryTestCase(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.authorized_user = UserFactory.create()
        cls.user = UserFactory.create()
        cls.admin = AdminFactory.create()
        cls.auth_user_hike = HikeFactory(user=cls.authorized_user)
        cls.auth_user_hike_day = HikeDayFactory(hike=cls.auth_user_hike)
        cls.eating_categories = [EatingCategoryFactory(name='Завтрак'), EatingCategoryFactory(
            name='Обед'), EatingCategoryFactory(name='Ужин')]
        cls.user_hike = HikeFactory(user=cls.user)
        cls.user_hike_day = HikeDayFactory(hike=cls.user_hike)
        cls.client = APIClient()
        cls.url_eating_categories = reverse('get_eating_categories')

    def test_getting_all_eating_categories_success(self):
        self.client.force_authenticate(user=self.authorized_user)

        response = self.client.get(
            self.url_eating_categories)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        categories = json.loads(response.data['data'])
        self.assertEqual(len(categories), 3)

        for category_response, category in zip(categories, self.eating_categories):
            self.assertEqual(
                category_response['fields']['name'], category.name)

    def test_getting_all_eating_categories_error_unauthorised(self):
        response = self.client.get(self.url_eating_categories)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_edit_eating_category_error_not_uniq_name(self):
        self.client.force_authenticate(user=self.authorized_user)
        eating_category_fields = {
            'id': self.eating_categories[0].pk,
            'name': self.eating_categories[1].name
        }

        response = self.client.post(
            self.url_eating_categories, eating_category_fields)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data, {'error': True, 'message': 'Название не уникальное'})

        category = EatingCategory.objects.get(pk=self.eating_categories[0].pk)

        self.assertNotEqual(category.name, eating_category_fields['name'])

    def test_edit_eating_category_success(self):
        self.client.force_authenticate(user=self.authorized_user)
        eating_category_fields = {
            'id': self.eating_categories[0].pk,
            'name': 'new name'
        }

        response = self.client.post(
            self.url_eating_categories, eating_category_fields)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data, {'error': False, 'message': 'Изменения сохранены'})

        category = EatingCategory.objects.get(pk=self.eating_categories[0].pk)

        self.assertEqual(category.name, eating_category_fields['name'])

    def test_edit_eating_category_error_unauthorised(self):
        response = self.client.post(self.url_eating_categories)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_eating_category_success(self):
        self.client.force_authenticate(user=self.authorized_user)
        eating_category_fields = {
            'name': self.eating_categories[0].name,
        }

        self.assertEqual(len(EatingCategory.objects.filter(
            name=self.eating_categories[0].name)), 1)

        response = self.client.delete(
            self.url_eating_categories, eating_category_fields)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data, {'error': False, 'message': 'Успешно удалено'})
        self.assertEqual(len(EatingCategory.objects.filter(
            name=eating_category_fields['name'])), 0)

    def test_delete_eating_category_error_unauthorised(self):
        self.assertEqual(len(EatingCategory.objects.filter()), 3)
        response = self.client.delete(self.url_eating_categories, {
                                      'id': self.eating_categories[0].pk})

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(len(EatingCategory.objects.filter()), 3)

    def test_add_eating_category_error_not_uniq_name(self):
        self.client.force_authenticate(user=self.authorized_user)
        eating_category_fields = {
            'name': self.eating_categories[0].name
        }

        self.assertEqual(len(EatingCategory.objects.filter()), 3)

        response = self.client.post(
            self.url_eating_categories, eating_category_fields)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data, {'error': True, 'message': 'Название не уникальное'})

        self.assertEqual(len(EatingCategory.objects.filter()), 3)

    def test_add_eating_category_success(self):
        self.client.force_authenticate(user=self.authorized_user)
        eating_category_fields = {
            'name': 'Перекус'
        }

        response = self.client.post(
            self.url_eating_categories, eating_category_fields)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data, {'error': False, 'message': 'Успешно добавлен тип'})

        self.assertEqual(len(EatingCategory.objects.filter(
            name=eating_category_fields['name'])), 1)

    def test_add_eating_category_error_unauthorised(self):
        eating_category_fields = {
            'name': self.eating_categories[0].name
        }

        response = self.client.post(
            self.url_eating_categories, eating_category_fields)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
