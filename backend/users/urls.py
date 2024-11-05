from django.urls import path
from .views import RegisterUserView, LoginUserView, LogoutUserView, change_password

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register-user'),
    path('login/', LoginUserView.as_view(), name='login-user'),
    path('logout/', LogoutUserView.as_view(), name='logout-user'),
    path('change-password/', change_password, name='change_password'),
]
