import logging
import traceback
from django.db.utils import IntegrityError
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated


class CustomAuthToken(ObtainAuthToken):
    # permission_classes = [IsAuthenticated, ]

    def post(self, request, *args, **kwargs):
        res = {'error': True,
               'message': 'Не найден пользователь с текущим именем и паролем'}
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
        except IntegrityError: 
            res = {'error': True, 'message': 'login должен быть уникальным'}
        except:
            res = {'error': True, 'message': 'Ошибка ввода данных'}
            logging.info(
                f'Неудачная авторизация для "{request.data}"\n{traceback.format_exc()}')
        finally:
            return Response(res)


class EditUserPass(APIView):
    # permission_classes = [IsAuthenticated, ]

    def post(self, request, *args, **kwargs):
        name = request.data['name']
        curPassword = request.data['oldPassword']
        password1 = request.data['password1']
        password2 = request.data['password2']

        if password1 != password2:
            logging.info(f'Пользователь {name} ввел не совпадающие новые пароли {password1} & {password2}')
            return Response({'error': True, 'message': 'Пароли не совпадают'})
        try:
            user = User.objects.get(username=name)

            if not user.check_password(curPassword):
                logging.info(f'Пользователь {name} ввел неверный старый пароль: {curPassword}')
                return Response({'error': True, 'message': 'Текущий пароль не верный'})

            user.set_password(password1)
            user.save()

            logging.info(f'Пароль для {name} обновлен успешно')
            return Response(data={'error': False, 'message': 'Данные изменены'})
        except User.DoesNotExist:
            logging.info(f'Пользователь {name} не найден')
            return Response(data={'error': True, 'message': 'Пользователь не найден'})
        except:
            logging.error(f'Error while editing user\n{traceback.format_exc}')
            return Response(data={'error': True, 'message': 'Ошибка ввода данных'})


class EditUser(APIView):
    # permission_classes = [IsAuthenticated, ]
    
    def post(self, request, *args, **kwargs):
        name = request.data['name']
        email = request.data['email']
        first_name = request.data['first_name']
        last_name = request.data['last_name']

        try:
            user = User.objects.get(username=name)
            user.email = email
            user.first_name = first_name
            user.last_name = last_name
            user.save()

            logging.info(f'Данные обновлены: {request.data}')
            return Response(data={'error': False, 'message': 'Данные успешно обновлены'})
        except User.DoesNotExist:
            logging.info(f'Пользователь {name} не найден')
            return Response(data={'error': True, 'message': 'Пользователь не найден'})
        except:
            logging.error(f'Error while editing user\n{traceback.format_exc}')
            return Response(data={'error': True, 'message': 'Ошибка ввода данных'})
        

class getAuthUser(APIView):
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request):
        res = {'error': True, 'message': 'Ошибка при получении данных авторизованного пользователя'}
        
        try:
            
            res = {'error': False,
                   'data': {
                       'user_id': request.user.pk,
                       'email': request.user.email,
                       'name': request.user.username,
                       'first_name': request.user.first_name,
                       'last_name': request.user.last_name,
                       'is_superuser': request.user.is_superuser
                   }}
        except:
            logging.info(f'Ошибка при получении данных авторизованного пользователя "{request.data}"')
        finally:
            return Response(res)