from django.http import request
from django.shortcuts import redirect, render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
import logging, traceback
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
            'title': 'Помошник',
        }

        return render(request, 'main.html', context)


class HikesView(APIView):
    # permission_classes = [IsAuthenticated, ]

    def post(self, request):
        context = {
            'error': '',
            'info': '',
            'title': 'Помошник',
        }

        return render(request, 'hikes.html', context)
    
    
    def get(self, request):
        hikes = Hike.objects.all()
        paginator = Paginator(hikes, 10)
        page_number = request.GET.get('page', 1)
        
        context = {
            'column_names': ['№', 'Название', 'Количество участников', 'О походе'],
            'error': '',
            'info': '',
            'title': 'Все ПОХОДЫ',
            'hikes': paginator.get_page(page_number)
        }

        return render(request, 'hikes.html', context)


class HikeView(APIView):
    # permission_classes = [IsAuthenticated, ]

    def post(self, request):
        try:
            id = request.POST.get('hike_id', 0)
            print(id)
            hike = Hike(id) if id != 0 else Hike()
            hike.participant_count = request.POST.get('participant_count', 0)
            hike.hike_name = request.POST.get('hike_name', '')
            hike.hike_description = request.POST.get('hike_description', '')
            hike.save()
            print(request.POST.get('participant_count', 0))
            print(request.POST.get('hike_name', ''))
            print(request.POST.get('hike_description', ''))

            return redirect('main')
        except:
            context = {
                'error': 'Ошибка при сохранении информации',
                'hike': hike,
                'is_new': False,
                'info': '',
            }
            return render(request, 'hike.html', context)
    
    
    def get(self, request):
        id = request.POST.get('hike_id', 0)
        hike = Hike(id) if id != 0 else Hike()
        
        context = {
            'error': '',
            'info': '',
            'is_new': True,
            'hike': hike,
        }

        return render(request, 'hike.html', context)