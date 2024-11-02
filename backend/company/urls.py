from django.urls import path
from . import views

urlpatterns = [
    path('complete-company-profile/', views.complete_company_profile, name='complete-company-profile'),
    path('view-company-profile/<int:pk>/', views.view_company_profile, name='view-company-profile')
]