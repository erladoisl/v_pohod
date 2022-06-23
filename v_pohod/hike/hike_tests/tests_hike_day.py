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

    def test_getting_all_hike_days_unauthorised(self):
        response = self.client.get(self.hike_days)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_getting_all_hike_days(self):
        self.client.force_authenticate(user=self.authorized_user)

        response = self.client.get(self.hike_days, {'hike_id': self.auth_user_hike.pk})

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(len(response.data['days']), 3)

        for savedDay, curDay in zip(response.data['days'], self.auth_user_hike_days):
            self.assertEqual(savedDay['date'], datetime.date(curDay.date))
            self.assertEqual(savedDay['name'], curDay.name)
