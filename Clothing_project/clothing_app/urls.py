from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, product_list, product_detail,ShoppingCartView,ShoppingCartDetailView,RemoveCartItemView,ProfileView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path("products/", product_list, name="product-list"),  
    path('products/<int:pk>/', product_detail, name='product_detail'),
    path('shoppingcart/', ShoppingCartView.as_view(), name='shopping_cart'), 
    path('cart/', ShoppingCartDetailView.as_view(), name='view_cart'),
    path("cart/remove/<int:item_id>/", RemoveCartItemView.as_view(), name="cart-remove-item"),

   
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 