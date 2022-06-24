from datetime import datetime
from urllib import response
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from user.tests.model_factory import UserFactory
from user.tests.model_factory import AdminFactory
from hike.models import Hike
from hike.models import HikeDay
from .model_factory import HikeFactory, HikeDayFactory


class HikeTestCase(APITestCase):
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
        cls.user_hike = HikeFactory(user=cls.user)
        cls.user_hike_day = HikeDayFactory(hike=cls.user_hike)
        cls.client = APIClient()
        cls.hike_days = reverse('hike_days')
        cls.hike_day_update = reverse('hike_day_update')
        cls.delete_hike_day = reverse('delete_hike_day')

    def test_getting_all_hike_days(self):
        self.client.force_authenticate(user=self.authorized_user)

        response = self.client.get(
            self.hike_days, {'hike_id': self.auth_user_hike.pk})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['days']), 3)

        for savedDay, curDay in zip(response.data['days'], self.auth_user_hike_days):
            self.assertEqual(savedDay['date'], datetime.date(curDay.date))
            self.assertEqual(savedDay['name'], curDay.name)

    def test_getting_all_hike_days_unauthorised(self):
        response = self.client.get(self.hike_days)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_edit_hike_day_by_owner(self):
        self.client.force_authenticate(user=self.authorized_user)
        hike_day_fields = {
            'id': self.auth_user_hike_days[0].pk,
            'hike_id':  self.auth_user_hike_days[0].hike.pk,
            'name': 'new name',
            'description': 'new description',
            'date': '1994-06-17T21:00:00.000Z'
        }
        response = self.client.post(self.hike_day_update, hike_day_fields)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        hikeDay = HikeDay.objects.get(pk=hike_day_fields['id'])

        self.assertEqual(hikeDay.name, hike_day_fields['name'])
        self.assertEqual(hikeDay.hike.pk, hike_day_fields['hike_id'])
        self.assertEqual(hikeDay.description, hike_day_fields['description'])
        self.assertEqual(hikeDay.date, datetime.date(datetime.strptime(
            '1994-06-18T21:00:00.000Z', '%Y-%m-%dT%H:%M:%S.%fZ')))

    def test_edit_hike_day_by_admin(self):
        self.client.force_authenticate(user=self.admin)
        hike_day_fields = {
            'id': self.auth_user_hike_days[0].pk,
            'hike_id':  self.auth_user_hike_days[0].hike.pk,
            'name': 'new name',
            'description': 'new description',
            'date': '1994-06-17T21:00:00.000Z'
        }
        response = self.client.post(self.hike_day_update, hike_day_fields)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        hikeDay = HikeDay.objects.get(pk=hike_day_fields['id'])

        self.assertEqual(hikeDay.name, hike_day_fields['name'])
        self.assertEqual(hikeDay.hike.pk, hike_day_fields['hike_id'])
        self.assertEqual(hikeDay.description, hike_day_fields['description'])
        self.assertEqual(hikeDay.date, datetime.date(datetime.strptime(
            '1994-06-18T21:00:00.000Z', '%Y-%m-%dT%H:%M:%S.%fZ')))

    def test_edit_hike_day_by_not_owner(self):
        self.client.force_authenticate(user=self.user)
        hike_day_fields = {
            'id': self.auth_user_hike_days[0].pk,
            'hike_id':  self.auth_user_hike_days[0].hike.pk,
            'name': 'new name',
            'description': 'new description',
            'date': '1994-06-17T21:00:00.000Z'
        }
        response = self.client.post(self.hike_day_update, hike_day_fields)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'],
                         'Нельзя редактировать чужие походы')

        hikeDay = HikeDay.objects.get(pk=self.auth_user_hike_days[0].pk)

        self.assertNotEqual(hikeDay.name, hike_day_fields['name'])
        self.assertEqual(hikeDay.hike.pk, hike_day_fields['hike_id'])
        self.assertNotEqual(hikeDay.description,
                            hike_day_fields['description'])
        self.assertNotEqual(hikeDay.date, datetime.date(
            datetime.strptime('1994-06-18T21:00:00.000Z', '%Y-%m-%dT%H:%M:%S.%fZ')))

    def test_edit_hike_day_unauthorized(self):
        response = self.client.post(self.hike_day_update)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_hike_day_by_owner(self):
        self.client.force_authenticate(user=self.authorized_user)
        deleted_hike_id = self.auth_user_hike_days[0].pk

        response = self.client.post(self.delete_hike_day, {
                                    'id': deleted_hike_id})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Успешно')
        self.assertEqual(len(HikeDay.objects.filter(pk=deleted_hike_id)), 0)

    def test_delete_hike_day_by_admin(self):
        self.client.force_authenticate(user=self.admin)
        deleted_hike_id = self.auth_user_hike_days[0].pk

        response = self.client.post(self.delete_hike_day, {
                                    'id': deleted_hike_id})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Успешно')
        self.assertEqual(len(HikeDay.objects.filter(pk=deleted_hike_id)), 0)

    def test_delete_hike_day_by_not_owner(self):
        self.client.force_authenticate(user=self.user)
        deleted_hike_id = self.auth_user_hike_days[0].pk

        response = self.client.post(self.delete_hike_day, {
                                    'id': deleted_hike_id})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data['message'], 'Удалять дни похода может только создатель похода')
        self.assertEqual(len(HikeDay.objects.filter(pk=deleted_hike_id)), 1)

    def test_delete_hike_day_unauthorized(self):
        deleted_hike_id = self.auth_user_hike_days[0].pk

        response = self.client.post(self.delete_hike_day, {
                                    'id': deleted_hike_id})

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(len(HikeDay.objects.filter(pk=deleted_hike_id)), 1)

    def test_add_hike_day_by_owner(self):
        self.client.force_authenticate(user=self.authorized_user)
        hike_day_fields = {
            'hike_id':  self.auth_user_hike.pk,
            'name': 'new hike day name',
            'description': 'new description',
            'date': '1994-06-17T21:00:00.000Z'
        }
        response = self.client.post(self.hike_day_update, hike_day_fields)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data, {'error': False, 'message': 'Успешно сохранено', 'id': 5})

        hikeDay = HikeDay.objects.get(pk=response.data['id'])

        self.assertEqual(hikeDay.name, hike_day_fields['name'])
        self.assertEqual(hikeDay.hike.pk, hike_day_fields['hike_id'])
        self.assertEqual(hikeDay.description, hike_day_fields['description'])
        self.assertEqual(hikeDay.date, datetime.date(datetime.strptime(
            '1994-06-18T21:00:00.000Z', '%Y-%m-%dT%H:%M:%S.%fZ')))

    def test_add_hike_hike_day_by_admin(self):
        self.client.force_authenticate(user=self.admin)
        hike_day_fields = {
            'hike_id':  self.auth_user_hike.pk,
            'name': 'new hike day name',
            'description': 'new description',
            'date': '1994-06-17T21:00:00.000Z'
        }
        response = self.client.post(self.hike_day_update, hike_day_fields)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data, {'error': False, 'message': 'Успешно сохранено', 'id': 5})

        hikeDay = HikeDay.objects.get(pk=response.data['id'])

        self.assertEqual(hikeDay.name, hike_day_fields['name'])
        self.assertEqual(hikeDay.hike.pk, hike_day_fields['hike_id'])
        self.assertEqual(hikeDay.description, hike_day_fields['description'])
        self.assertEqual(hikeDay.date, datetime.date(datetime.strptime(
            '1994-06-18T21:00:00.000Z', '%Y-%m-%dT%H:%M:%S.%fZ')))

    def test_add_hike_hike_day_by_not_owner(self):
        self.client.force_authenticate(user=self.user)
        hike_day_fields = {
            'hike_id':  self.auth_user_hike.pk,
            'name': 'new hike day name',
            'description': 'new description',
            'date': '1994-06-17T21:00:00.000Z'
        }
        response = self.client.post(self.hike_day_update, hike_day_fields)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data,  {
                         'error': True, 'message': 'Нельзя редактировать чужие походы'})

        hikeDays = HikeDay.objects.filter(name=hike_day_fields['name'])

        self.assertEqual(len(hikeDays), 0)

    def test_add_hike_hike_day_unauthorized(self):
        hike_day_fields = {
            'hike_id':  self.auth_user_hike.pk,
            'name': 'new hike day name',
            'description': 'new description',
            'date': '1994-06-17T21:00:00.000Z'
        }
        response = self.client.post(self.hike_day_update, hike_day_fields)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        hikeDays = HikeDay.objects.filter(name=hike_day_fields['name'])

        self.assertEqual(len(hikeDays), 0)
