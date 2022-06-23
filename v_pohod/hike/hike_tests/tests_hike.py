from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from rest_framework import status
from user.tests.model_factory import UserFactory
from user.tests.model_factory import AdminFactory
from hike.models import Hike
from .model_factory import HikeFactory


class HikeTestCase(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.authorized_user = UserFactory.create()
        cls.user1 = UserFactory.create()
        cls.admin = AdminFactory.create()
        cls.authorized_user_hike = HikeFactory(user=cls.authorized_user)
        cls.hike1 = HikeFactory(user=cls.user1)
        cls.client = APIClient()
        cls.get_hikes_url = reverse('hikes')
        cls.get_user_hikes_url = reverse('user_hikes')
        cls.delete_hike = reverse('delete_hike')
        cls.hike_update = reverse('hike_update')

    def test_getting_all_hikes(self):
        self.client.force_authenticate(user=self.authorized_user)

        response = self.client.get(self.get_hikes_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['error'], False)
        self.assertEqual(len(response.data['hikes']), 2)
        self.assertEqual(response.data['hikes'][0]
                         ['name'], self.authorized_user_hike.name)
        self.assertEqual(response.data['hikes'][1]['name'], self.hike1.name)

    def test_getting_all_hikes_unauthorized(self):
        response = self.client.get(self.get_hikes_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_getting_user_hikes(self):
        self.client.force_authenticate(user=self.authorized_user)

        response = self.client.get(self.get_user_hikes_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['error'], False)
        self.assertEqual(len(response.data['hikes']), 1)
        self.assertEqual(response.data['hikes'][0]
                         ['name'], self.authorized_user_hike.name)

    def test_getting_user_hikes_unauthorized(self):
        response = self.client.get(self.get_user_hikes_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_hike_deleting_unauthorized(self):
        response = self.client.post(
            self.delete_hike, {'id': self.authorized_user_hike.pk})

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_hike_deleting_by_admin(self):
        self.client.force_authenticate(user=self.admin)

        response = self.client.post(
            self.delete_hike, {'id': self.authorized_user_hike.pk})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Успешно')

    def test_hike_deleting_by_owner(self):
        self.client.force_authenticate(user=self.authorized_user)

        response = self.client.post(
            self.delete_hike, {'id': self.authorized_user_hike.pk})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Успешно')

    def test_hike_deleting_by_not_owner(self):
        self.client.force_authenticate(user=self.user1)

        response = self.client.post(
            self.delete_hike, {'id': self.authorized_user_hike.pk})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'],
                         'Удалять поход может только создатель')

    def test_hike_edit_by_not_owner(self):
        self.client.force_authenticate(user=self.user1)
        new_hike_fields = {
            'id': self.authorized_user_hike.pk,
            'name': 'new name',
            'description': 'new description',
            'participant_count': 24
        }

        response = self.client.post(self.hike_update, new_hike_fields)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'],
                         'Нельзя редактировать чужие походы')

    def test_hike_edit_by_admin(self):
        self.client.force_authenticate(user=self.admin)
        new_hike_fields = {
            'id': self.authorized_user_hike.pk,
            'name': 'new name',
            'description': 'new description',
            'participant_count': 24
        }

        response = self.client.post(self.hike_update, new_hike_fields)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Успешно сохранено')

        new_hike = Hike.objects.get(pk=self.authorized_user_hike.pk)

        self.assertEqual(new_hike.name, new_hike_fields['name'])
        self.assertEqual(new_hike.description, new_hike_fields['description'])
        self.assertEqual(new_hike.participant_count,
                         new_hike_fields['participant_count'])

    def test_hike_edit_by_owner(self):
        self.client.force_authenticate(user=self.authorized_user)
        new_hike_fields = {
            'id': self.authorized_user_hike.pk,
            'name': 'new name',
            'description': 'new description',
            'participant_count': 24
        }

        response = self.client.post(self.hike_update, new_hike_fields)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Успешно сохранено')

        new_hike = Hike.objects.get(pk=self.authorized_user_hike.pk)

        self.assertEqual(new_hike.name, new_hike_fields['name'])
        self.assertEqual(new_hike.description, new_hike_fields['description'])
        self.assertEqual(new_hike.participant_count,
                         new_hike_fields['participant_count'])

    def test_hike_edit_unauthorized(self):
        new_hike_fields = {
            'id': self.authorized_user_hike.pk,
            'name': 'new name',
            'description': 'new description',
            'participant_count': 24
        }

        response = self.client.post(self.hike_update, new_hike_fields)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_hike_new_unauthorized(self):
        new_hike = {
            'name': 'new hike',
            'description': 'description',
            'participant_count': 12
        }

        response = self.client.post(self.hike_update, new_hike)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_hike_new_success(self):
        self.client.force_authenticate(user=self.authorized_user)
        new_hike_fields = {
            'name': 'new hike',
            'description': 'description',
            'participant_count': 12
        }

        response = self.client.post(self.hike_update, new_hike_fields)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Успешно сохранено')

        newHike = Hike.objects.get(pk=response.data['id'])

        self.assertEqual(newHike.user, self.authorized_user)
        self.assertEqual(newHike.name, new_hike_fields['name'])
        self.assertEqual(newHike.description, new_hike_fields['description'])
        self.assertEqual(newHike.participant_count,
                         new_hike_fields['participant_count'])
