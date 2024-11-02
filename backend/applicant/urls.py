from django.urls import path
from . import views

urlpatterns = [
    path('complete-applicant-profile/', views.complete_applicant_profile, name='complete-applicant-profile'),
    path('view-applicant-profile/<int:pk>/', views.view_applicant_profile, name='view-applicant-profile'),
]