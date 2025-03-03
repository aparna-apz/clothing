from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# user creation 
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15)
    address = models.TextField()

    def __str__(self):
        return f"{self.user.username}'s Profile"
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

# Signal to save profile when the user is saved
@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
# ----------------------------------------------------------------------

class Product(models.Model):
    category = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    size = models.TextField(blank=True)
    fabric = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    image = models.ImageField(upload_to="product_images/", blank=True, null=True)

    def __str__(self):
        return self.name

from django.contrib.auth.models import User
from django.utils import timezone

class Carts(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Cart for {self.user.username}"

class CartItem(models.Model):
    cart = models.ForeignKey(Carts, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='cart_items', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

    def total_price(self):
        return self.product.price * self.quantity

# models.py

from django.db import models
from django.contrib.auth.models import User  # Assuming you are using Django's built-in User model
from clothing_app.models import Product  # Replace with the correct import path for your Product model

# ShoppingCart model (formerly Cart)
class ShoppingCart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # Each user has one shopping cart
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp for cart creation

    def __str__(self):
        return f"ShoppingCart for {self.user.username}"

# ShoppingCartItem model (formerly CartItem)
class ShoppingCartItem(models.Model):
    cart = models.ForeignKey(ShoppingCart, related_name='items', on_delete=models.CASCADE)  # Each ShoppingCartItem is associated with a ShoppingCart
    product = models.ForeignKey(Product, on_delete=models.CASCADE)  # Link to the Product model
    quantity = models.PositiveIntegerField(default=1)  # The quantity of the product in the shopping cart
    added_at = models.DateTimeField(auto_now_add=True)  # Timestamp when the item was added to the cart

    def __str__(self):
        return f"{self.product.name} (x{self.quantity})"
