from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, product_list, product_detail, ShoppingCartView, ShoppingCartDetailView, RemoveCartItemView, ProfileView, place_order, get_user_orders
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Authentication and registration endpoints
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    
    # User profile and product endpoints
    path('profile/', ProfileView.as_view(), name='profile'),
    path("products/", product_list, name="product-list"),
    path('products/<int:pk>/', product_detail, name='product_detail'),

    # Shopping Cart endpoints
    path('shoppingcart/', ShoppingCartView.as_view(), name='shopping_cart'),
    path('cart/', ShoppingCartDetailView.as_view(), name='view_cart'),
    path("cart/remove/<int:item_id>/", RemoveCartItemView.as_view(), name="cart-remove-item"),

    # Order management endpoints
    path('place_order/', place_order, name='place_order'),  # Place an order
    path('orders/', get_user_orders, name='get_user_orders'),  # Get all orders for a user
]

# Static and media files configuration
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
