from django.urls import path
from .views import complete_applicant_profile, view_applicant_profile, edit_applicant_profile, save_job, unsave_job, get_saved_jobs

urlpatterns = [
    path('profile/', complete_applicant_profile, name='complete-applicant-profile'),
    path('profile/edit/', edit_applicant_profile, name='edit-applicant-profile'),  
    path('profile/view/', view_applicant_profile, name='profile_view'),
    path('save-job/<int:job_hiring_id>/', save_job, name='save_job'),
    path('unsave-job/<int:job_hiring_id>/', unsave_job, name='unsave_job'),
    path('saved-jobs/', get_saved_jobs, name='get_saved_jobs'),
]
