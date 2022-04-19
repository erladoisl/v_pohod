import logging
import traceback
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User


class CustomAuthToken(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        res = {'error': True,
               'message': 'Не найден пользователь с текущим именем и паролем'}
        print(request.data)
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)

            res = {'error': False,
                   'data': {
                       'token': token.key,
                       'user_id': user.pk,
                       'email': user.email,
                       'name': user.username,
                       'first_name': user.first_name,
                       'last_name': user.last_name,
                       'is_superuser': user.is_superuser
                   }}
        except:
            logging.info(f'Неудачная авторизация для "{request.data}"')
        finally:
            return Response(res)


class CustomRegistrationToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        res = {'error': True, 'message': 'Ошибка ввода данных'}
        print(request.data)

        if request.data['password1'] != request.data['password2']:
            return Response({'error': True, 'message': 'Пароли не совпадают'})

        try:
            user = User.objects.create_user(username=request.data['username'],
                                            email=request.data['email'],
                                            first_name=request.data['first_name'],
                                            last_name=request.data['last_name'],
                                            password=request.data['password1'])
            token, created = Token.objects.get_or_create(user=user)

            res = {'error': False,
                   'data': {
                       'token': token.key,
                       'user_id': user.pk,
                       'email': user.email,
                       'name': user.username,
                       'first_name': user.first_name,
                       'last_name': user.last_name,
                       'is_superuser': user.is_superuser
                   }}
        except:
            res = {'error': True, 'message': 'Ошибка ввода данных'}
            logging.info(
                f'Неудачная авторизация для "{request.data}"\n{traceback.format_exc()}')
        finally:
            return Response(res)