import json
from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from rest_framework import status
from user.tests.model_factory import UserFactory
from menu.menu_tests.model_factory import FormulaFactory
from menu.models import Formula


class FoodTestCase(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.authorized_user = UserFactory.create()
        cls.formula = [FormulaFactory(name='1 шт. на 4 порции', value='ceil(1 / 4 * PARTICIPANT_COUNT)'),
                       FormulaFactory(name='1 шт. на поход', value='1 / TOTAL_COUNT'),
                       FormulaFactory(name='1 шт. на прием пищи', value='1')]
        cls.client = APIClient()
        cls.url_formula = reverse('formula')

    def test_getting_all_formula_success(self):
        self.client.force_authenticate(user=self.authorized_user)

        response = self.client.get(self.url_formula)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        formula = json.loads(response.data['data'])
        self.assertEqual(len(formula), 3)

        for response_formula, formula in zip(formula, self.formula):
            self.assertEqual(response_formula['fields']['name'], formula.name)
            self.assertEqual(
                response_formula['fields']['value'], formula.value)

    def test_getting_all_formula_unauthorised(self):
        response = self.client.get(self.url_formula)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_edit_formula_error_not_uniq_name(self):
        self.client.force_authenticate(user=self.authorized_user)
        formula_fields = {
            'id': self.formula[0].pk,
            'name': self.formula[1].name,
            'value': 'new value',
        }

        response = self.client.post(
            self.url_formula, formula_fields)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data, {'error': True, 'message': 'Название не уникальное'})

        formula = Formula.objects.get(pk=formula_fields['id'])

        self.assertNotEqual(formula.name, formula_fields['name'])

    def test_edit_formula_success(self):
        self.client.force_authenticate(user=self.authorized_user)
        formula_fields = {
            'id': self.formula[0].pk,
            'name': 'new name',
            'value': 'new value',
        }
        response = self.client.post(
            self.url_formula, formula_fields)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data, {'error': False, 'message': 'Изменения сохранены'})

        formula = Formula.objects.get(pk=formula_fields['id'])

        self.assertEqual(formula.name, formula_fields['name'])

    def test_edit_formula_error_unauthorised(self):
        response = self.client.post(self.url_formula)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_formula_success(self):
        self.client.force_authenticate(user=self.authorized_user)
        formula_fields = {
            'name': self.formula[0].name,
        }

        self.assertEqual(len(Formula.objects.filter(
            name=formula_fields['name'])), 1)

        self.assertEqual(
            len(Formula.objects.filter(name=formula_fields['name'])), 1)
        response = self.client.delete(self.url_formula, formula_fields)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data, {'error': False, 'message': 'Успешно удалено'})
        self.assertEqual(
            len(Formula.objects.filter(name=formula_fields['name'])), 0)

    def test_delete_formula_error_unauthorised(self):
        self.assertEqual(len(Formula.objects.filter()), 3)
        response = self.client.delete(self.url_formula, {
                                      'id': self.formula[0].pk})

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(len(Formula.objects.filter()), 3)

    def test_add_formula_error_not_uniq_name(self):
        self.client.force_authenticate(user=self.authorized_user)
        formula_fields = {
            'name': self.formula[0].name,
            'value': 'new value',
        }

        self.assertEqual(len(Formula.objects.filter()), 3)

        response = self.client.post(
            self.url_formula, formula_fields)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data, {'error': True, 'message': 'Название не уникальное'})

        self.assertEqual(len(Formula.objects.filter()), 3)

    def test_add_formula_success(self):
        self.client.force_authenticate(user=self.authorized_user)
        formula_fields = {
            'name': 'new name',
            'value': 'new value',
        }
        self.assertEqual(len(Formula.objects.filter()), 3)

        response = self.client.post(
            self.url_formula, formula_fields)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data, {'error': False, 'message': 'Успешно добавлена формула'})

        formula = Formula.objects.get(name=formula_fields['name'])

        self.assertEqual(len(Formula.objects.filter()), 4)
        self.assertEqual(formula.name, formula_fields['name'])
        self.assertEqual(formula.value, formula_fields['value'])

    def test_add_formula_error_unauthorised(self):
        formula_fields = {
            'name': 'new name',
            'value': 'new value',
        }
        response = self.client.post(
            self.url_formula, formula_fields)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
