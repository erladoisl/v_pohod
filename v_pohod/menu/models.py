from django.db import models
from django.contrib.auth.models import User
from hike.models import HikeDay

# для создания таблиц в БД
# Create your models here.
#  & python manage.py makemigrations
#  & python manage.py migrate
#  & python manage.py createsuperuser
#  python manage.py migrate --run-syncdb
        

class EatingCategory(models.Model):
    name = models.CharField('name', max_length=250)
    
    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Тип приема пищи'
        verbose_name_plural = 'Типы приема пищи'


class Eating(models.Model):
    hikeDay = models.ForeignKey(HikeDay, on_delete=models.CASCADE)
    eating_category = models.ForeignKey(EatingCategory, on_delete=models.CASCADE)
    number = models.IntegerField('number')
    name = models.CharField('name', max_length=250)
    description = models.TextField('description')
    
    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Прием пищи'
        verbose_name_plural = 'Приемы пищи'

class Food(models.Model):
    name = models.CharField('food_name', max_length=250)
    amount_per_person = models.FloatField('participant_count')
    unit = models.CharField('unit', max_length=50, default='гр.') # единица изменения
    
    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Продукт'
        verbose_name_plural = 'Продукты'


class Formula(models.Model):
    name = models.CharField('name', max_length=250)
    value = models.TextField('value')
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Формула'
        verbose_name_plural = 'Формулы'


class Ingredient(models.Model):
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    eating = models.ForeignKey(Eating, on_delete=models.CASCADE)
    formula = models.ForeignKey(Formula, on_delete=models.CASCADE)
    comment = models.TextField('ingrediant_comment')
    
    
    class Meta:
        verbose_name = 'Ингредиент'
        verbose_name_plural = 'Ингредиенты'