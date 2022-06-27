import json
from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from rest_framework import status
from user.tests.model_factory import UserFactory
from menu.menu_tests.model_factory import FoodFactory
from menu.menu_tests.model_factory import FormulaFactory
from hike.hike_tests.model_factory import HikeDayFactory, HikeFactory
from menu.menu_tests.model_factory import EatingCategoryFactory, EatingFactory
from menu.models import Eating


class FoodTestCase(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.authorized_user = UserFactory.create()
        cls.user = UserFactory.create()
        cls.auth_user_hike = HikeFactory(user=cls.authorized_user)

        cls.auth_user_hike_days = [HikeDayFactory(hike=cls.auth_user_hike),
                                   HikeDayFactory(hike=cls.auth_user_hike),
                                   HikeDayFactory(hike=cls.auth_user_hike)]

        cls.eating_categories = [EatingCategoryFactory(name='Завтрак'), 
                                 EatingCategoryFactory(name='Обед'), 
                                 EatingCategoryFactory(name='Ужин')]

        cls.food = [FoodFactory(name='Греча', unit='гр.'), 
                    FoodFactory(name='Тушенка', unit='шт.'), 
                    FoodFactory(name='Хлеб', unit='гр.')]

        cls.formula = [FormulaFactory(name='1 шт. на 4 порции', value='ceil(1 / 4 * PARTICIPANT_COUNT)'),
                       FormulaFactory(name='1 шт. на поход',value='1 / TOTAL_COUNT'),
                       FormulaFactory(name='1 шт. на прием пищи', value='1')]

        cls.eatings = [EatingFactory(hikeDay=cls.auth_user_hike_days[0], eating_category=cls.eating_categories[1]), 
                       EatingFactory(hikeDay=cls.auth_user_hike_days[0], eating_category=cls.eating_categories[2]), 
                       EatingFactory(hikeDay=cls.auth_user_hike_days[1], eating_category=cls.eating_categories[0])]
        cls.client = APIClient()
        cls.url_eating = reverse('eating')

    def test_getting_all_eating_by_hike_day_success(self):
        self.client.force_authenticate(user=self.authorized_user)

        response = self.client.get(
            self.url_eating, {'day_id': self.auth_user_hike_days[0].pk})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        eatings = response.data['data']
        self.assertEqual(len(eatings), 2)

        for response_eating, eating in zip(eatings, self.eatings):
            self.assertEqual(response_eating['name'], eating.name)
            self.assertEqual(response_eating['description'], eating.description)

    def test_getting_all_eating_by_hike_day_unauthorised(self):
        response = self.client.get(self.url_eating)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_edit_eating_error_not_owner_not_admin(self):
        self.client.force_authenticate(user=self.user)
        eating_fields = {
            'eating_id': self.eatings[0].pk,
            'name': 'new name',
            'description': 'new descr',
            'eating_category_id': self.eating_categories[2].pk,
            'hikeDay_id': self.eatings[0].hikeDay.pk,
            'number': 0,
        }

        response = self.client.post(
            self.url_eating, eating_fields)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data, {'error': True, 'message': 'Нельзя редактировать чужие походы'})

        eating = Eating.objects.get(pk=eating_fields['eating_id'])

        self.assertNotEqual(eating.name, eating_fields['name'])
        self.assertNotEqual(eating.description, eating_fields['description'])
        self.assertNotEqual(eating.number, eating_fields['number'])

    # def test_edit_formula_success(self):
    #     self.client.force_authenticate(user=self.authorized_user)
    #     formula_fields = {
    #         'id': self.formula[0].pk,
    #         'name': 'new name',
    #         'value': 'new value',
    #     }
    #     response = self.client.post(
    #         self.url_formula, formula_fields)

    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertEqual(
    #         response.data, {'error': False, 'message': 'Изменения сохранены'})

    #     formula = Formula.objects.get(pk=formula_fields['id'])

    #     self.assertEqual(formula.name, formula_fields['name'])

    # def test_edit_formula_error_unauthorised(self):
    #     response = self.client.post(self.url_formula)

    #     self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # def test_delete_formula_success(self):
    #     self.client.force_authenticate(user=self.authorized_user)
    #     formula_fields = {
    #         'name': self.formula[0].name,
    #     }

    #     self.assertEqual(len(Formula.objects.filter(
    #         name=formula_fields['name'])), 1)

    #     self.assertEqual(len(Formula.objects.filter(name=formula_fields['name'])), 1)
    #     response = self.client.delete(self.url_formula, formula_fields)

    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertEqual(
    #         response.data, {'error': False, 'message': 'Успешно удалено'})
    #     self.assertEqual(len(Formula.objects.filter(name=formula_fields['name'])), 0)

    # def test_delete_formula_error_unauthorised(self):
    #     self.assertEqual(len(Formula.objects.filter()), 3)
    #     response = self.client.delete(self.url_formula, {
    #                                   'id': self.formula[0].pk})

    #     self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    #     self.assertEqual(len(Formula.objects.filter()), 3)

    # def test_add_formula_error_not_uniq_name(self):
    #     self.client.force_authenticate(user=self.authorized_user)
    #     formula_fields = {
    #         'name': self.formula[0].name,
    #         'value': 'new value',
    #     }

    #     self.assertEqual(len(Formula.objects.filter()), 3)

    #     response = self.client.post(
    #         self.url_formula, formula_fields)

    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertEqual(
    #         response.data, {'error': True, 'message': 'Название не уникальное'})

    #     self.assertEqual(len(Formula.objects.filter()), 3)

    # def test_add_formula_success(self):
    #     self.client.force_authenticate(user=self.authorized_user)
    #     formula_fields = {
    #         'name': 'new name',
    #         'value': 'new value',
    #     }
    #     self.assertEqual(len(Formula.objects.filter()), 3)

    #     response = self.client.post(
    #         self.url_formula, formula_fields)

    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertEqual(
    #         response.data, {'error': False, 'message': 'Успешно добавлена формула'})
            
    #     formula = Formula.objects.get(name=formula_fields['name'])

    #     self.assertEqual(len(Formula.objects.filter()), 4)
    #     self.assertEqual(formula.name, formula_fields['name'])
    #     self.assertEqual(formula.value, formula_fields['value'])

    # def test_add_formula_error_unauthorised(self):
    #     formula_fields = {
    #         'name': 'new name',
    #         'value': 'new value',
    #     }
    #     response = self.client.post(
    #         self.url_formula, formula_fields)

    #     self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
