from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from rest_framework import status
from user.tests.model_factory import UserFactory, AdminFactory
from menu.menu_tests.model_factory import FoodFactory, FormulaFactory, EatingCategoryFactory, EatingFactory, IngredientFactory
from hike.hike_tests.model_factory import HikeDayFactory, HikeFactory
from menu.models import Ingredient


class IngredientTestCase(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.authorized_user = UserFactory.create()
        cls.user = UserFactory.create()
        cls.admin = AdminFactory.create()
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
                       FormulaFactory(name='1 шт. на поход', value='1 / TOTAL_COUNT'),
                       FormulaFactory(name='1 шт. на прием пищи', value='1')]

        cls.eatings = [EatingFactory(hikeDay=cls.auth_user_hike_days[0], eating_category=cls.eating_categories[1]),
                       EatingFactory(hikeDay=cls.auth_user_hike_days[0], eating_category=cls.eating_categories[2]),
                       EatingFactory(hikeDay=cls.auth_user_hike_days[1], eating_category=cls.eating_categories[0])]

        cls.ingredients = [IngredientFactory(eating=cls.eatings[0], food=cls.food[1], formula=cls.formula[0]),
                           IngredientFactory(eating=cls.eatings[0], food=cls.food[2], formula=cls.formula[1]),
                           IngredientFactory(eating=cls.eatings[1], food=cls.food[0], formula=cls.formula[0])]
        cls.client = APIClient()
        cls.url_ingredient = reverse('ingredient')

    def test_getting_all_eating_ingredients_success(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get(
            self.url_ingredient, {'eating_id': self.eatings[0].pk})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        ingredients = response.data['data']
        self.assertEqual(len(ingredients), 2)

        for response_ingredient, ingredient in zip(ingredients, self.ingredients):
            self.assertEqual(response_ingredient['food_id'], ingredient.food.pk)
            self.assertEqual(response_ingredient['formula_id'], ingredient.formula.pk)
            self.assertEqual(response_ingredient['comment'], ingredient.comment)

    def test_getting_all_eating_ingredients_error_unauthorised(self):
        response = self.client.get(self.url_ingredient)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_edit_ingredient_error_not_owner_not_admin(self):
        self.client.force_authenticate(user=self.user)
        ingredient_fields = {
            'id': self.ingredients[0].pk,
            'eating_id': self.eatings[2].pk,
            'food_id': self.food[2].pk,
            'formula_id': self.formula[2].pk,
            'comment': 'new comment',
        }

        response = self.client.post(
            self.url_ingredient, ingredient_fields)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data, {'error': True, 'message': 'Нельзя редактировать чужие походы'})

        ingredient = Ingredient.objects.get(pk=ingredient_fields['id'])

        self.assertNotEqual(ingredient.eating.pk, ingredient_fields['eating_id'])
        self.assertNotEqual(ingredient.food.pk, ingredient_fields['food_id'])
        self.assertNotEqual(ingredient.formula.pk, ingredient_fields['formula_id'])
        self.assertNotEqual(ingredient.comment, ingredient_fields['comment'])

    def test_edit_eatin_ingredient_success_by_owner(self):
        self.client.force_authenticate(user=self.authorized_user)
        ingredient_fields = {
            'id': self.ingredients[0].pk,
            'eating_id': self.eatings[2].pk,
            'food_id': self.food[2].pk,
            'formula_id': self.formula[2].pk,
            'comment': 'new comment',
        }

        response = self.client.post(self.url_ingredient, ingredient_fields)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'error': False, 'message': 'Успешно'})

        ingredient = Ingredient.objects.get(pk=ingredient_fields['id'])

        self.assertEqual(ingredient.eating.pk, ingredient_fields['eating_id'])
        self.assertEqual(ingredient.food.pk, ingredient_fields['food_id'])
        self.assertEqual(ingredient.formula.pk, ingredient_fields['formula_id'])
        self.assertEqual(ingredient.comment, ingredient_fields['comment'])

    def test_edit_eating_ingredient_success_by_admin(self):
        self.client.force_authenticate(user=self.admin)
        ingredient_fields = {
            'id': self.ingredients[0].pk,
            'eating_id': self.eatings[2].pk,
            'food_id': self.food[2].pk,
            'formula_id': self.formula[2].pk,
            'comment': 'new comment',
        }

        response = self.client.post(self.url_ingredient, ingredient_fields)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'error': False, 'message': 'Успешно'})

        ingredient = Ingredient.objects.get(pk=ingredient_fields['id'])

        self.assertEqual(ingredient.eating.pk, ingredient_fields['eating_id'])
        self.assertEqual(ingredient.food.pk, ingredient_fields['food_id'])
        self.assertEqual(ingredient.formula.pk, ingredient_fields['formula_id'])
        self.assertEqual(ingredient.comment, ingredient_fields['comment'])

    def test_edit_eating_ingredient_error_unauthorised(self):
        response = self.client.post(self.url_ingredient)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_eating_ingredient_success_by_owner(self):
        self.client.force_authenticate(user=self.authorized_user)
        eating_id = self.eatings[0].pk,

        self.assertEqual(len(Ingredient.objects.filter(pk=self.eatings[0].pk)), 1)

        response = self.client.delete(self.url_ingredient, {'id': eating_id})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data, {'error': False, 'message': 'Успешно удалено'})
        self.assertEqual(len(Ingredient.objects.filter(pk=self.eatings[0].pk)), 0)

    def test_delete_eating_ingredient_error_unauthorised(self):
        self.assertEqual(len(Ingredient.objects.filter()), 3)
        response = self.client.delete(self.url_ingredient, {'id': self.formula[0].pk})

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(len(Ingredient.objects.filter()), 3)

    def test_delete_eating_ingredient_success_by_admin(self):
        self.client.force_authenticate(user=self.admin)
        eating_id = self.eatings[0].pk,

        self.assertEqual(len(Ingredient.objects.filter(pk=self.eatings[0].pk)), 1)

        response = self.client.delete(self.url_ingredient, {'id': eating_id})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data, {'error': False, 'message': 'Успешно удалено'})
        self.assertEqual(len(Ingredient.objects.filter(pk=self.eatings[0].pk)), 0)

    def test_delete_eating_ingredient_error_by_not_owner_and_no_admin(self):
        self.client.force_authenticate(user=self.user)
        self.assertEqual(len(Ingredient.objects.filter()), 3)
        response = self.client.delete(self.url_ingredient, {'id': self.formula[0].pk})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data, {'error': True, 'message': 'Нельзя редактировать чужие походы'})
        self.assertEqual(len(Ingredient.objects.filter(pk=self.eatings[0].pk)), 1)

    def test_add_eating_ingredient_error_by_not_owner_and_not_admin(self):
        self.client.force_authenticate(user=self.user)
        ingredient_fields = {
            'eating_id': self.eatings[2].pk,
            'food_id': self.food[2].pk,
            'formula_id': self.formula[2].pk,
            'comment': 'new comment',
        }

        self.assertEqual(len(Ingredient.objects.filter()), 3)

        response = self.client.post(
            self.url_ingredient, ingredient_fields)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data, {'error': True, 'message': 'Нельзя редактировать чужие походы'})

        self.assertEqual(len(Ingredient.objects.filter()), 3)

    def test_add_eating_ingredient_success_by_owner(self):
        self.client.force_authenticate(user=self.authorized_user)
        ingredient_fields = {
            'eating_id': self.eatings[2].pk,
            'food_id': self.food[2].pk,
            'formula_id': self.formula[2].pk,
            'comment': 'new comment',
        }

        response = self.client.post(
            self.url_ingredient, ingredient_fields)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data, {'error': False, 'message': 'Ингредиент создан успешно', 'id': 4})

        ingredient = Ingredient.objects.get(pk=response.data['id'])

        self.assertEqual(ingredient.eating.pk, ingredient_fields['eating_id'])
        self.assertEqual(ingredient.food.pk, ingredient_fields['food_id'])
        self.assertEqual(ingredient.formula.pk, ingredient_fields['formula_id'])
        self.assertEqual(ingredient.comment, ingredient_fields['comment'])

    def test_add_eating_ingredient_success_by_admin(self):
        self.client.force_authenticate(user=self.admin)
        ingredient_fields = {
            'eating_id': self.eatings[2].pk,
            'food_id': self.food[2].pk,
            'formula_id': self.formula[2].pk,
            'comment': 'new comment',
        }

        response = self.client.post(
            self.url_ingredient, ingredient_fields)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data, {'error': False, 'message': 'Ингредиент создан успешно', 'id': 4})

        ingredient = Ingredient.objects.get(pk=response.data['id'])

        self.assertEqual(ingredient.eating.pk, ingredient_fields['eating_id'])
        self.assertEqual(ingredient.food.pk, ingredient_fields['food_id'])
        self.assertEqual(ingredient.formula.pk, ingredient_fields['formula_id'])
        self.assertEqual(ingredient.comment, ingredient_fields['comment'])

    def test_add_eating_ingredient_error_unauthorised(self):
        ingredient_fields = {
            'eating_id': self.eatings[2].pk,
            'food_id': self.food[2].pk,
            'formula_id': self.formula[2].pk,
            'comment': 'new comment',
        }

        response = self.client.post(self.url_ingredient, ingredient_fields)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
