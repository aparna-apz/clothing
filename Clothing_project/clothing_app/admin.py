from django.contrib import admin

# Register your models here.
from .models import Product,Carts

admin.site.register(Product)
admin.site.register(Carts)

