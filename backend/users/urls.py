from django.urls import path
from .views import RegisterUserView, LoginUserView, LogoutUserView, change_password, user_list, google_login

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register-user'),
    path('login/', LoginUserView.as_view(), name='login-user'),
    path('logout/', LogoutUserView.as_view(), name='logout-user'),
    path('change-password/', change_password, name='change_password'),
    path('user-list/', user_list, name='user_list'),
    path('google-login/', google_login, name='google-login'),
]
