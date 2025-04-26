from django.urls import path
from . import views

urlpatterns = [
    path('job-hirings/', views.job_hiring_list, name='job_hiring_list'), # list of all job hirings
    path('hirings/company', views.job_hiring_list_company, name='job_hiring_list_company'), # list of all job hirings for company
    path('hirings/drafts/', views.list_draft_job_hirings, name='list_draft_job_hirings'),  # list drafts
    path('hirings/<int:pk>/', views.job_hiring_details, name='job_hiring_details'), # specific job hiring
    path('hirings/create/', views.create_job_hiring, name='create-job-hiring'),
    path('hirings/edit/<int:pk>/', views.edit_job_hiring, name='edit_job_hiring'),
    path('hirings/delete/<int:pk>', views.delete_job_hiring, name='delete_job_hiring'),
    path('hirings/search/', views.search_job_hiring_list, name='search_job_hiring_list'),
    path('hirings/search_job/', views.search_job, name='search_job'),
    path('hirings/recent-search/', views.show_recent_searches, name='show_recent_searches'),

    path('notifications/', views.get_notifications, name='get_notifications'),
    path('notifications/mark-as-read/<int:notification_id>/', views.mark_notification_as_read, name='mark_notification_as_read'),
    path('notifications/unread/', views.unread_notifications, name='unread_notifications'),
    path('notifications/delete-notification/', views.delete_notification, name='delete_notification'),
    
    path('applications/', views.job_application_list, name='job_application_list'), # list of all job applications
    path('applications/<int:pk>', views.job_application_details, name='job_application_details'),
    path('applications/<int:application_id>/status/', views.get_application_status, name='application-status'), # see result ng application (makikita rin sa applications, pero no documents ang json nito)  / dito rin makikita ang readable ng status ng application if processed na.
    path('applications/check/<int:pk>/', views.check_application, name='check-application'),
    path('applications/create', views.create_job_application, name='create_job_application'),
    path('applications/edit/<int:pk>', views.edit_job_application, name='edit_job_application'),
    path('applications/delete/<int:pk>', views.delete_job_application, name='delete_job_application'),
    path('applications/cancel/<int:application_id>/', views.cancel_job_application, name='cancel-job-application'),
    path('applications/update-application-status/<int:application_id>/', views.change_application_status, name='change-application-status'),
    path('applications/get-all-applications/', views.get_all_application_applicant, name='get_all_application_applicant')
]

