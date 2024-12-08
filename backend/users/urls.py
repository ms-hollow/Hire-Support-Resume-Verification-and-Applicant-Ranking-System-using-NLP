from django.urls import path
from django.contrib.auth import views as auth_views
from .views import RegisterUserView, LogoutUserView, change_password, user_list, check_email, google_login, auth_email, test_csrf, get_csrf_token, MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register-user'),
    path('logout/', LogoutUserView.as_view(), name='logout-user'),
    path('change-password/', change_password, name='change_password'),
    path('user-list/', user_list, name='user_list'),
    path('google-login/', google_login, name='google-login'),
    path('check-email/', check_email, name='check_email'),
    path('auth-email/', auth_email, name='auth_email'),
    path('csrf-test/', test_csrf, name='csrf_test'),
    path('get_csrf_token/', get_csrf_token, name='get_csrf_token'),

    # JWT Token Endpoints
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),  # Get JWT token Access
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refresh JWT token

    path('password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
]

#TODO for forgt password
#* 1 - Submit email form
#* 2 - Email sent success message
#* 3 - Link to Reset form email
#* 4 - password change successfully
