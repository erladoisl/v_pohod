import json
from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from rest_framework import status
from user.tests.model_factory import UserFactory
from menu.menu_tests.model_factory import FoodFactory
from menu.models import Food


class FoodTestCase(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.authorized_user = UserFactory.create()
        cls.food = [FoodFactory(name='Греча', unit='гр.'),
                    FoodFactory(name='Тушенка', unit='шт.'),
                    FoodFactory(name='Хлеб', unit='гр.')]
        cls.client = APIClient()
        cls.url_food = reverse('food')

    def test_getting_all_food_success(self):
        self.client.force_authenticate(user=self.authorized_user)

        response = self.client.get(
            self.url_food)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        foods = json.loads(response.data['data'])
        self.assertEqual(len(foods), 3)

        for response_food, food in zip(foods, self.food):
            self.assertEqual(
                response_food['name'], food.name)

    def test_getting_all_food_error_unauthorised(self):
        response = self.client.get(self.url_food)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_edit_food_error_not_uniq_name(self):
        self.client.force_authenticate(user=self.authorized_user)
        food_fields = {
            'id': self.food[0].pk,
            'name': self.food[1].name,
            'amount_per_person': 42,
            'unit': 'new unit',
        }

        response = self.client.post(
            self.url_food, food_fields)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data, {'error': True, 'message': 'Название не уникальное'})

        food = Food.objects.get(pk=food_fields['id'])

        self.assertNotEqual(food.name, food_fields['name'])

    def test_edit_food_success(self):
        self.client.force_authenticate(user=self.authorized_user)
        food_fields = {
            'id': self.food[0].pk,
            'name': 'new name',
            'amount_per_person': 42,
            'unit': 'new unit',
        }
        response = self.client.post(
            self.url_food, food_fields)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data, {'error': False, 'message': 'Изменения сохранены'})

        food = Food.objects.get(pk=food_fields['id'])

        self.assertEqual(food.name, food_fields['name'])

    def test_edit_food_error_unauthorised(self):
        response = self.client.post(self.url_food)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_food_success(self):
        self.client.force_authenticate(user=self.authorized_user)
        food_fields = {
            'name': self.food[0].name,
        }

        self.assertEqual(len(Food.objects.filter(
            name=food_fields['name'])), 1)

        response = self.client.delete(self.url_food, food_fields)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data, {'error': False, 'message': 'Успешно удалено'})
        self.assertEqual(len(Food.objects.filter(name=food_fields['name'])), 0)

    def test_delete_food_error_unauthorised(self):
        self.assertEqual(len(Food.objects.filter()), 3)
        response = self.client.delete(self.url_food, {
                                      'id': self.food[0].pk})

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(len(Food.objects.filter()), 3)

    def test_add_food_error_not_uniq_name(self):
        self.client.force_authenticate(user=self.authorized_user)
        food_fields = {
            'name': self.food[0].name,
            'amount_per_person': 42,
            'unit': 'new unit',
        }

        self.assertEqual(len(Food.objects.filter()), 3)

        response = self.client.post(
            self.url_food, food_fields)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data, {'error': True, 'message': 'Название не уникальное'})

        self.assertEqual(len(Food.objects.filter()), 3)

    def test_add_food_success(self):
        self.client.force_authenticate(user=self.authorized_user)
        food_fields = {
            'name': 'new name',
            'amount_per_person': 42,
            'unit': 'new unit',
        }
        self.assertEqual(len(Food.objects.filter()), 3)

        response = self.client.post(
            self.url_food, food_fields)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data, {'error': False, 'message': 'Успешно добавлен продукт'})

        food = Food.objects.get(name=food_fields['name'])

        self.assertEqual(len(Food.objects.filter()), 4)
        self.assertEqual(food.name, food_fields['name'])
        self.assertEqual(food.amount_per_person,
                         food_fields['amount_per_person'])
        self.assertEqual(food.unit, food_fields['unit'])

    def test_add_food_error_unauthorised(self):
        food_fields = {
            'name': 'new name',
            'amount_per_person': 42,
            'unit': 'new unit',
        }
        response = self.client.post(
            self.url_food, food_fields)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
