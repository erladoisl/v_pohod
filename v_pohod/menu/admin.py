from django.contrib import admin

# Register your models here.
from .models import Eating, Formula, Ingredient, EatingCategory, Food


admin.site.register(Eating)
admin.site.register(Food)
admin.site.register(Ingredient)
admin.site.register(EatingCategory)
admin.site.register(Formula)
