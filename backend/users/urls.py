from django.urls import path
from django.contrib.auth import views as auth_views
from .views import RegisterUserView, LoginUserView, LogoutUserView, change_password, user_list, check_email, google_login, auth_email, test_csrf

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register-user'),
    path('login/', LoginUserView.as_view(), name='login-user'),
    path('logout/', LogoutUserView.as_view(), name='logout-user'),
    path('change-password/', change_password, name='change_password'),
    path('user-list/', user_list, name='user_list'),
    path('google-login/', google_login, name='google-login'),
    path('check-email/', check_email, name='check_email'),
    path('auth-email/', auth_email, name='auth_email'),
    path('csrf-test/', test_csrf, name='csrf_test'),

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
