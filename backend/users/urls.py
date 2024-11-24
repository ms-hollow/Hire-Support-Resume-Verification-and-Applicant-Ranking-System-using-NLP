from django.urls import path
from . import views

urlpatterns = [
    path('register-applicant/', views.register_applicant, name='register-applicant'),
    path('register-company/', views.register_company, name='register-company'),
    # path('applicant-profile/<int:user_id>/', views.applicant_profile, name='applicant_profile'),  
    # path('company-profile/<int:user_id>/', views.company_profile, name='company_profile'),  
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_user, name='logout')
]