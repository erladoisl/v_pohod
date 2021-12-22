from django.contrib import admin

# Register your models here.
from . models import Eating, FoodCategory, Hike, HikeDay, Ingredient, EatingCategory, Food


admin.site.register(Eating)
admin.site.register(FoodCategory)
admin.site.register(Food)
admin.site.register(HikeDay)
admin.site.register(Hike)
admin.site.register(Ingredient)
admin.site.register(EatingCategory)
