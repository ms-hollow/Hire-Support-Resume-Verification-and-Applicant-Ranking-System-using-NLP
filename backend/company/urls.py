from django.urls import path
from .views import complete_company_profile, view_company_profile, edit_company_profile

urlpatterns = [
    path('profile/', complete_company_profile, name='complete-company-profile'),
    path('profile/edit/', edit_company_profile, name='edit-applicant-profile'),
    path('profile/view/<int:pk>/', view_company_profile, name='view-company-profile'),
]
