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
# ------------------------------------------------------------------------------
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from clothing_app.models import Product  # Import Product model from the appropriate app


class OrderHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='order_history')  # Each user has multiple orders
    order_date = models.DateTimeField(default=timezone.now)  # Timestamp when the order was placed
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # Total order price
    status = models.CharField(max_length=100, default='Pending')  # Order status (e.g., Pending, Completed)

    def __str__(self):
        return f"Order {self.id} by {self.user.username} on {self.order_date}"

    def update_total_price(self):
        """Recalculates the total price of the order by summing the associated items' prices."""
        total = sum(item.total_price() for item in self.order_items.all())  # sum the total_price for all OrderHistoryItems
        self.total_price = total
        self.save()


class OrderHistoryItem(models.Model):
    order = models.ForeignKey(OrderHistory, on_delete=models.CASCADE, related_name='order_items')  # Each item is related to an order
    product = models.ForeignKey(Product, on_delete=models.CASCADE)  # Link to the Product model
    quantity = models.PositiveIntegerField(default=1)  # The quantity of the product in the order
    price = models.DecimalField(max_digits=10, decimal_places=2)  # The price of the product at the time of purchase

    def __str__(self):
        return f"{self.product.name} (x{self.quantity}) for Order {self.order.id}"

    def total_price(self):
        """Calculate total price for this item (quantity * price)."""
        return self.price * self.quantity
