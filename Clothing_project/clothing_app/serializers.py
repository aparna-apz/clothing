from rest_framework import serializers
from .models import Product, Carts,ShoppingCart
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password


# ------------------- Product Serializer -------------------
class ProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

    class Meta:
        model = Product
        fields = ["id", "category", "name", "description", "size", "fabric", "price", "stock", "image"]


# ------------------- User Serializer -------------------
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])  # Hash password before saving
        return super().create(validated_data)


# ------------------- profile Serializer -------------------
from .models import Profile

from rest_framework import serializers
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.SerializerMethodField()  # Fetch email from User model

    class Meta:
        model = Profile
        fields = ['name', 'phone_number', 'address', 'email']  # Include email field

    def get_email(self, obj):
        """Get the email from the User model"""
        return obj.user.email if obj.user else None  # Avoid errors if user is missing

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.address = validated_data.get('address', instance.address)
        instance.save()
        return instance

# -----------------------------------------------------------------------------
# ------------------- Login Serializer -------------------
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


# ------------------- Cart Serializer -------------------
from rest_framework import serializers
from .models import Carts,ShoppingCart,ShoppingCartItem


# ------------------- ShoppingCartItem Serializer -------------------

from rest_framework import serializers
from .models import Product, ShoppingCart, ShoppingCartItem
from .models import User

# ------------------- ShoppingCartItem Serializer -------------------
class ShoppingCartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)  # Nest product details
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), write_only=True)
    total_price = serializers.SerializerMethodField()  # Calculate total price per product

    class Meta:
        model = ShoppingCartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'total_price']

    def get_total_price(self, obj):
        return obj.quantity * obj.product.price  # Calculate total price (price × quantity)

    def create(self, validated_data):
        user = self.context['request'].user
        product = validated_data['product_id']  # Extract product correctly
        cart, created = ShoppingCart.objects.get_or_create(user=user)  # Get or create the user's cart

        # Check if the product is already in the cart
        cart_item, created = ShoppingCartItem.objects.get_or_create(
            cart=cart, product=product,
            defaults={'quantity': validated_data['quantity']}
        )

        if not created:  # If the item already exists in the cart, update the quantity
            cart_item.quantity += validated_data['quantity']
            cart_item.save()

        return cart_item

# ------------------- ShoppingCart Serializer -------------------
class ShoppingCartSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)  # Display the username
    items = ShoppingCartItemSerializer(many=True, read_only=True)  # Nested serializer to show the cart items

    class Meta:
        model = ShoppingCart
        fields = ['user', 'created_at', 'items']  # Include the user and associated items in the cart

