from django.urls import path
from . import views

urlpatterns = [
    path('job-hirings/', views.job_hiring_list, name='job_hiring_list'), # list of all job hirings
    path('hirings/<int:pk>/', views.job_hiring_details, name='job_hiring_details'), # specific job hiring
    path('hirings/create/', views.create_job_hiring, name='create_job_hiring'),
    path('hirings/edit/<int:pk>/', views.edit_job_hiring, name='edit_job_hiring'),
    path('hirings/delete/<int:pk>', views.delete_job_hiring, name='delete_job_hiring'),
    path('hirings/search/', views.search_job_hiring_list, name='search_job_hiring_list'),
    
    path('applications/', views.job_application_list, name='job_application_list'), # list of all job applications
    path('applications/<int:pk>', views.job_application_details, name='job_application_details'),
    path('applications/create', views.create_job_application, name='create_job_application'),
    path('applications/edit/<int:pk>', views.edit_job_application, name='edit_job_application'),
    path('applications/delete/<int:pk>', views.delete_job_application, name='delete_job_application'),
    path('applications/cancel/<int:application_id>/', views.cancel_job_application, name='cancel-job-application')
]

