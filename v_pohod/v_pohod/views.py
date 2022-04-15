import logging
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView


class CustomAuthToken(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        res = {'error': True,
               'message': 'Не найден пользователь с текущим именем и паролем'}
        print(request.data)
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        try:
            serializer.is_valid(raise_exception=True)
            print(request.data)
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)

            res = {'error': False,
                   'data': {
                       'token': token.key,
                       'user_id': user.pk,
                       'email': user.email,
                       'name': user.username,
                       'is_superuser': user.is_superuser
                   }}
        except:
            logging.info(f'Неудачная авторизация для "{request.data}"')
        finally:
            return Response(res)


class GetAuthorizedUser(APIView):
    def get(self, request):
        authorization = request.headers['Authorization']

        if len(authorization.split()) == 2 and authorization.split()[0] == 'Bearer':
            try:
                user = Token.objects.get(key=authorization.split()[1]).user

                return Response({
                    "success": True,
                    "username": user.username,
                    "email": user.email,
                    "is_superuser": user.is_superuser
                })
            except Token.DoesNotExist:
                return Response({
                    "success": False,
                    "message": 'Действующий токен не найден'
                })
        else:
            return Response({
                "success": False,
                "message": 'Неверный формат token'
            })
