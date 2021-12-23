from django.http import request
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator

from menu.models import Hike


class MainView(APIView):
    #permission_classes = [IsAuthenticated, ]


    def post(self, request):
        context = {
            'error': '',
            'info': '',
        }

        return render(request, 'main.html', context)
    
    
    def get(self, request):
        context = {
            'error': '',
            'info': '',
        }

        return render(request, 'main.html', context)


class HikesView(APIView):
    # permission_classes = [IsAuthenticated, ]

    def post(self, request):
        context = {
            'error': '',
            'info': '',
        }

        return render(request, 'main.html', context)
    
    
    def get(self, request):
        hikes = Hike.objects.all()
        paginator = Paginator(hikes, 10)
        page_number = request.GET.get('page', 1)
        
        context = {
            'error': '',
            'info': '',
            'hikes': paginator.get_page(page_number)
        }

        return render(request, 'main.html', context)