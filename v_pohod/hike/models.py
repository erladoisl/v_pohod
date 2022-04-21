from django.db import models
from django.contrib.auth.models import User


class Hike(models.Model):
    name = models.CharField('name', max_length=250)
    participant_count = models.IntegerField('participant_count')
    description = models.TextField('description')
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    
    class Meta:
        verbose_name = 'Поход'
        verbose_name_plural = 'Список походов'


class HikeDay(models.Model):
    hike = models.ForeignKey(Hike, on_delete=models.CASCADE)
    date = models.DateField('date')
    name = models.CharField('name', max_length=250)
    description = models.TextField('description')
    
    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'День похода'
        verbose_name_plural = 'Дни похода'