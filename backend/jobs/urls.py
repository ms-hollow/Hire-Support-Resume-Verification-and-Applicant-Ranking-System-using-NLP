from django.urls import path
from jobs.views import create_job_hiring

urlpatterns = [
    path('create-job-hiring/', create_job_hiring, name='create_job_hiring'),
]