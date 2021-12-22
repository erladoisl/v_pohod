from django.db import models
# для создания таблиц в БД
# Create your models here.
#  & python manage.py makemigrations
#  & python manage.py migrate
#  & python manage.py createsuperuser


class Hike(models.Model):
    hike_name = models.CharField('hike_name', max_length=250)
    participant_count = models.IntegerField('participant_count')
    hike_description = models.TextField('hike_description')

    def __str__(self):
        return self.hike_name

    
    class Meta:
        verbose_name = 'Поход'
        verbose_name_plural = 'Список походов'


class HikeDay(models.Model):
    hike_id = models.ForeignKey(Hike, on_delete=models.CASCADE)
    date = models.DateField('date')
    day_name = models.CharField('day_name', max_length=250)
    day_description = models.TextField('day_description')
    
    def __str__(self):
        return self.day_name

    class Meta:
        verbose_name = 'День похода'
        verbose_name_plural = 'Дни похода'
        

class EatingCategory(models.Model):
    eating_category_name = models.CharField('eating_category_name', max_length=50)
    serial_number = models.IntegerField('serial_number')
    
    def __str__(self):
        return self.eating_category_name

    class Meta:
        verbose_name = 'Тип приема пищи'
        verbose_name_plural = 'Типы приема пищи'


class Eating(models.Model):
    day_id = models.ForeignKey(HikeDay, on_delete=models.CASCADE)
    eating_category = models.ForeignKey(EatingCategory, on_delete=models.CASCADE)
    eating_name = models.CharField('eating_name', max_length=250)
    eating_description = models.TextField('eating_description')
    
    def __str__(self):
        return self.eating_name

    class Meta:
        verbose_name = 'Прием пищи'
        verbose_name_plural = 'Приемы пищи'


class FoodCategory(models.Model):
    food_category_name = models.CharField('food_category_name', max_length=250)
    unit = models.CharField('unit', max_length=50)
    weight = models.IntegerField('weight')
    
    def __str__(self):
        return self.food_category_name

    class Meta:
        verbose_name = 'Категория продукта'
        verbose_name_plural = 'Категории продуктов'


class Food(models.Model):
    food_name = models.CharField('food_name', max_length=250)
    food_category_id = models.ForeignKey(FoodCategory, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.food_name

    class Meta:
        verbose_name = 'Продукт'
        verbose_name_plural = 'Продукты'


class Ingredient(models.Model):
    food_id = models.ForeignKey(Food, on_delete=models.CASCADE)
    eating_id = models.ForeignKey(Eating, on_delete=models.CASCADE)
    amount_per_perticipant = models.IntegerField("amount_per_perticipant")
    ingrediant_comment = models.TextField('ingrediant_comment')
    
    class Meta:
        verbose_name = 'Ингредиент'
        verbose_name_plural = 'Ингредиенты'