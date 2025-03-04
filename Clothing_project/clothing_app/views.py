from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view

from .models import Product
from .serializers import ProductSerializer,UserSerializer,LoginSerializer


from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import serializers
from .models import Product, Carts
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            email = serializer.validated_data['email']
            
            if User.objects.filter(username=username).exists():
                return Response({"detail": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)

            user = User(username=username, email=email, password=make_password(password))
            user.save()

            return Response({"detail": "User registered successfully."}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            user = User.objects.filter(username=username).first()

            if user and user.check_password(password):
                refresh = RefreshToken.for_user(user)
                return Response({
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                })

            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#------------------------------------------------------------------------------------------------
# profile creation 

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Profile
from .serializers import ProfileSerializer

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Retrieve or create the logged-in user's profile"""
        profile, created = Profile.objects.get_or_create(user=request.user)  # Ensure profile exists
        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        """Update the logged-in user's profile"""
        profile, created = Profile.objects.get_or_create(user=request.user)  # Ensure profile exists
        serializer = ProfileSerializer(profile, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#------------------------------------------------------------------------------------------------
# products listing
@api_view(['GET'])
def product_list(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True, context={"request": request})  # Pass request context
    return Response(serializer.data)

from django.shortcuts import get_object_or_404
from django.http import JsonResponse




def product_detail(request, pk):
    product = get_object_or_404(Product, id=pk)
    data = {
        "category": product.category, 
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "size":product.size,
        "fabric":product.fabric,
        "price": product.price,
        "stock": product.stock,
        "image": product.image.url if product.image else None
    }
    return JsonResponse(data)
# --------------------------------------------------------------------------
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Invalidate the refresh token (you could also invalidate access token here if necessary)
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()  # This blacklists the refresh token
            
            return Response({"detail": "Successfully logged out."}, status=200)
        except Exception as e:
            return Response({"detail": "Error logging out."}, status=400)



# -----------------------------------------------------------

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import ShoppingCart, ShoppingCartItem
from .serializers import ShoppingCartItemSerializer, ShoppingCartSerializer
from django.shortcuts import get_object_or_404


class ShoppingCartView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure only logged-in users can access

    def post(self, request):
        """Add item to shopping cart"""
        # Use the ShoppingCartItemSerializer to validate and create a new cart item
        serializer = ShoppingCartItemSerializer(data=request.data, context={"request": request})

        if serializer.is_valid():
            # Save the cart item (this handles adding a new item or updating the quantity if the item already exists)
            cart_item = serializer.save()

            return Response(ShoppingCartItemSerializer(cart_item, context={"request": request}).data, 
                            status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        """Retrieve shopping cart items for the logged-in user"""
        # Get or create the user's shopping cart
        cart = get_object_or_404(ShoppingCart, user=request.user)

        # Get all items in the user's shopping cart
        cart_items = ShoppingCartItem.objects.filter(cart=cart)
        serializer = ShoppingCartItemSerializer(cart_items, many=True, context={"request": request})

        # Calculate the total price of all items in the cart
        total_cart_price = sum(item['total_price'] for item in serializer.data)

        # Return the list of cart items and the total price
        return Response({
            "cart_items": serializer.data,
            "total_cart_price": total_cart_price  # Send total price of all carted items
        })


# ----------------------------------------------

# views.py

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import ShoppingCart, ShoppingCartItem
from .serializers import ShoppingCartItemSerializer

class ShoppingCartDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Retrieve shopping cart items for the logged-in user"""
        # Retrieve the user's shopping cart
        cart = get_object_or_404(ShoppingCart, user=request.user)

        # Get the cart items
        cart_items = ShoppingCartItem.objects.filter(cart=cart)
        
        # Serialize cart items
        serializer = ShoppingCartItemSerializer(cart_items, many=True, context={"request": request})

        # Calculate total price of items in the cart
        total_cart_price = sum(item['total_price'] for item in serializer.data)

        # Return cart items and total price
        return Response({
            "cart_items": serializer.data,
            "total_cart_price": total_cart_price
        })

# delete items in cart 
class RemoveCartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, item_id):
        """Remove a specific item from the shopping cart"""
        cart = get_object_or_404(ShoppingCart, user=request.user)
        cart_item = get_object_or_404(ShoppingCartItem, id=item_id, cart=cart)

        cart_item.delete()  # Delete the item

        return Response({"message": "Item removed from cart"}, status=status.HTTP_204_NO_CONTENT)
    
# __________________order__________________________________
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import  OrderHistory, OrderHistoryItem, Product
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import ShoppingCart, OrderHistory, OrderHistoryItem, Product

class PlaceOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("Received order data:", request.data)  # Debugging log

        # Get cart items from the request
        items = request.data.get("cart_items", [])
        if not items:
            return Response({"error": "No cart items provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Get the authenticated user
        user = request.user

        # Fetch the user's cart
        cart = ShoppingCart.objects.filter(user=user).first()
        if not cart:
            return Response({"error": "No cart found for this user"}, status=status.HTTP_400_BAD_REQUEST)

        # Create a new order history
        order = OrderHistory.objects.create(user=user)

        for item in items:
            product_id = item.get("product_id")
            quantity = item.get("quantity")

            if not product_id or not quantity:
                return Response({"error": "Invalid item format"}, status=status.HTTP_400_BAD_REQUEST)

            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                return Response({"error": f"Product ID {product_id} not found"}, status=status.HTTP_400_BAD_REQUEST)

            OrderHistoryItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=product.price
            )

        # Update the total price
        order.update_total_price()

        # Clear the cart after placing the order
        cart.items.all().delete()

        return Response(
            {"message": "Order placed successfully!", "order_id": order.id},
            status=status.HTTP_201_CREATED
        )

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import OrderHistory
from .serializers import OrderHistorySerializer
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_orders(request):
    # Fetch all orders for the authenticated user
    orders = OrderHistory.objects.filter(user=request.user)
    serializer = OrderHistorySerializer(orders, many=True)
    return Response(serializer.data)

