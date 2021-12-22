from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated


class MainView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        context = {
            'error': '',
            'info': '',
        }

        return render(request, 'templates/main.html', context)


    def get(self, request):
        context = {
            'error': '',
            'info': '',
        }

        return render(request, 'templates/main.html', context)