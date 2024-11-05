from django.urls import path
from .views import complete_applicant_profile, view_applicant_profile, edit_applicant_profile

urlpatterns = [
    path('profile/', complete_applicant_profile, name='complete-applicant-profile'),
    path('profile/edit/', edit_applicant_profile, name='edit-applicant-profile'),  
    path('view/<int:pk>/', view_applicant_profile, name='view-applicant-profile'),  
]
