from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import JobHiringSerializer, JobApplicationSerializer, JobApplicationDocumentSerializer, NotificationSerializer
from .models import JobHiring, JobApplication, JobApplicationDocument, RecentSearch, Company, Notification
from applicant.models import Applicant
from django.db import transaction
from django.utils import timezone
from datetime import timedelta
from django.http import JsonResponse

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    user = request.user 
    notifications = Notification.objects.filter(recipient=user).order_by('-created_at')
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notification_as_read(request, notification_id):
    notification = get_object_or_404(Notification, id=notification_id, recipient=request.user)
    notification.is_read = True
    notification.save()
    return JsonResponse({'success': True, 'message': 'Notification marked as read.'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def unread_notifications(request):
    notifications = Notification.objects.filter(recipient=request.user, is_read=False)
    notifications_list = [
        {"message": notification.message, "created_at": notification.created_at} for notification in notifications
    ]
    return JsonResponse({"notifications": notifications_list})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_notification(request):
    notification_ids = request.data.get('notification_ids', [])

    if not notification_ids:
        return Response({"error": "No notification IDs provided"}, status=400)

    notifications = Notification.objects.filter(id__in=notification_ids)
    
    if not notifications.exists():
        return Response({"error": "Some or all notifications not found"}, status=404)

    deleted_count, _ = notifications.delete()

    return Response({"message": f"{deleted_count} notification(s) deleted successfully"}, status=200)

#* Create Job Hiring
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_job_hiring(request):
    serializer = JobHiringSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(company=request.user.company)  
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#* Edit Job Hiring
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_job_hiring(request, pk):
    try:
        job_hiring = JobHiring.objects.get(pk=pk)

        # Make a copy of the request data to modify
        updated_data = request.data.copy()

        # If current status is "draft", update to "open"
        if job_hiring.status == "draft":
            updated_data["status"] = "open"

        serializer = JobHiringSerializer(job_hiring, data=updated_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except JobHiring.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_draft_job_hirings(request):
    drafts = JobHiring.objects.filter(company=request.user.company, status='draft')
    serializer = JobHiringSerializer(drafts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def job_hiring_list_company(request):
    company = get_object_or_404(Company, user=request.user)
    job_listings = JobHiring.objects.filter(company=company) 
    serializer = JobHiringSerializer(job_listings, many=True)
    return Response(serializer.data)

#* Delete Job Hiring
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_job_hiring(request, pk):
    try:
        job_hiring = JobHiring.objects.get(pk=pk)
        job_hiring.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except JobHiring.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

#* Retrieve all job hirings and filter to only show job hirings with status 'open'
@api_view(['GET']) 
@permission_classes([IsAuthenticated])
def job_hiring_list(request):
    job_listings = JobHiring.objects.filter(status='open')

    if not job_listings:
        return Response({"message": "No draft job listings found"}, status=404)

    serializer = JobHiringSerializer(job_listings, many=True)
    return Response(serializer.data)
    
#* View job hiring details
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def job_hiring_details(request, pk):
    try:
        job_hiring = JobHiring.objects.get(pk=pk)
        serializer = JobHiringSerializer(job_hiring)
        return Response(serializer.data)
    except JobHiring.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

#* Search Job Hiring post made by the company
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_job_hiring_list(request):
    company = request.user.company # request kung sino company ang naka login
    job_title = request.query_params.get('job_title', '')
    
    job_hirings = JobHiring.objects.filter(company=company) # filter yung job hirings created by the company
    if job_title:
        job_hirings = job_hirings.filter(title__icontains=job_title)

    serializer = JobHiringSerializer(job_hirings, many=True)
    return Response(serializer.data)

#* Search Job Hiring [APPLICANT]
@api_view(['GET'])
def search_job(request):
    job_title = request.query_params.get('job_title', '')
    job_industry = request.query_params.get('job_industry', '')
    work_location = request.query_params.get('work_location', '')
    creation_date = request.query_params.get('creation_date', '')
    work_setup = request.query_params.get('work_setup', '')
    employment_type = request.query_params.get('employment_type', '')
    salary = request.query_params.get('salary', '')
    experience_level = request.query_params.get('experience_level', '')

    job_hirings = JobHiring.objects.all()

    if job_title:
        job_hirings = job_hirings.filter(title__icontains=job_title)
    
    if job_industry:
        job_hirings = job_hirings.filter(industry__icontains=job_industry)
    
    if work_location:
        job_hirings = job_hirings.filter(location__icontains=work_location)

    if creation_date:
        if creation_date == 'last_24_hours':
            job_hirings = job_hirings.filter(created_at__gte=timezone.now() - timedelta(days=1))
        elif creation_date == 'last_7_days':
            job_hirings = job_hirings.filter(created_at__gte=timezone.now() - timedelta(days=7))
        elif creation_date == 'last_30_days':
            job_hirings = job_hirings.filter(created_at__gte=timezone.now() - timedelta(days=30))
    
    if work_setup:
        job_hirings = job_hirings.filter(work_setup__icontains=work_setup)

    if employment_type:
        job_hirings = job_hirings.filter(employment_type__icontains=employment_type)

    if salary:
        job_hirings = job_hirings.filter(salary__gte=salary)

    if experience_level:
        job_hirings = job_hirings.filter(experience_level__icontains=experience_level)

    # Save the search filters and the job hiring results to the database
    if request.user.is_authenticated:
        recent_search = RecentSearch.objects.create(
            user=request.user,
            job_title=job_title,
            job_industry=job_industry,
            work_location=work_location,
            creation_date=creation_date,
            work_setup=work_setup,
            employment_type=employment_type,
            salary=salary,
            experience_level=experience_level
        )

        # Save the matching job hirings (if any) to the recent search
        recent_search.job_hirings.set(job_hirings)

    # Serialize and return the filtered job listings
    serializer = JobHiringSerializer(job_hirings, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def show_recent_searches(request):
    recent_searches = RecentSearch.objects.filter(user=request.user).order_by('-created_at')
    
    result_data = []
    for recent_search in recent_searches:
        filters = recent_search.get_search_filters()  # Get saved filters
        job_hirings = recent_search.job_hirings.all()  # Get the job hirings that were part of the search

        # Serialize job hirings for response
        job_hirings_serializer = JobHiringSerializer(job_hirings, many=True)

        result_data.append({
            "filters": filters,
            "job_hirings": job_hirings_serializer.data
        })

    return Response(result_data)

#TODO Note need to add checker if nakapag apply na ba si applicant sa specific job hiring 
#TODO If yes, dapat hindi niya ito tanggapin
@api_view(['POST'])
def create_job_application(request):
    if request.method == 'POST':
        # Get non-file data
        data = request.data.copy()
        
        # Remove files-related fields from data to avoid issues with validation
        document_types = data.pop('document_type', [])
        document_files = request.FILES.getlist('document_file')

        serializer = JobApplicationSerializer(data=data)
        
        if serializer.is_valid():
            with transaction.atomic():  # Optional, to ensure all-or-nothing saving
                job_application = serializer.save()
                
                # Save each file with corresponding document type
                for doc_type, doc_file in zip(document_types, document_files):
                    JobApplicationDocument.objects.create(
                        job_application=job_application,
                        document_type=doc_type,
                        document_file=doc_file
                    )

                # After saving the job application, check for applicant count and create notifications
                job_hiring = job_application.job_hiring
                job_hiring.check_applicant_count() # Check if any thresholds are met and send notification
                
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#? For company side kapag papalitan na ang status
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_application_status(request, application_id):
    user = request.user  
    job_application = get_object_or_404(JobApplication, job_application_id=application_id)

    if job_application.job_hiring.company.user != user:
        return Response({'error': 'You are not authorized to update this application.'}, status=403)

    new_status = request.data.get('application_status')
    if not new_status:
        return Response({'error': 'Status is required.'}, status=400)
  
    job_application.application_status = new_status
    # Set a flag to indicate that a notification is being created in the view
    job_application._notification_created = True
    job_application.save()

    return Response({'message': 'Application status updated.'})

#? Check specific application
@api_view(['GET'])
def check_application(request, pk):
    applicant_id = request.query_params.get('applicant_id')

    if not applicant_id:
        return Response(
            {"error": "Applicant ID is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        job_hiring = JobHiring.objects.get(pk=pk)
    except JobHiring.DoesNotExist:
        return Response(
            {"error": "Job hiring not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    application_exists = JobApplication.objects.filter(
        job_hiring=job_hiring,
        applicant_id=applicant_id
    ).exists()

    return Response({"hasApplied": application_exists}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_application_applicant(request):
    applicant = get_object_or_404(Applicant, user=request.user)
    job_applications = JobApplication.objects.filter(applicant=applicant)
    serializer = JobApplicationSerializer(job_applications, many=True)
    return Response(serializer.data)

#* Delete Job Application
@api_view(['DELETE'])
def delete_job_application(request, pk):
    try:
        job_application = JobApplication.objects.get(pk=pk)
        job_application.delete()
        return Response(status=status.HTTP_400_BAD_REQUEST)
    except JobApplication.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

#* Edit Job Application
@api_view(['POST'])
def edit_job_application(request, pk):
    try:
        job_application = JobApplication.objects.get(pk=pk)
        serializer = JobApplicationSerializer(job_application, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except JobApplication.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

#* Get the list of all job applications 
@api_view(['GET'])
def job_application_list(request):
    job_application = JobApplication.objects.all()
    serializer = JobApplicationSerializer(job_application, many=True)
    return Response(serializer.data)

#* View job application details
@api_view(['GET'])
def job_application_details(request, pk):
    try:
        job_application = JobApplication.objects.get(pk=pk)
        serializer = JobApplicationSerializer(job_application)
        return Response(serializer.data)
    except JobApplication.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['PATCH'])
def cancel_job_application(request, application_id):
    try:
        # Get the job application by its ID
        job_application = JobApplication.objects.get(job_application_id=application_id)

        # Update the application status to 'Cancelled'
        job_application.application_status = JobApplication.CANCELLED
        job_application.save()

        return Response({"message": "Job application cancelled successfully."}, status=status.HTTP_200_OK)
    
    except JobApplication.DoesNotExist:
        return Response({"error": "Job application not found."}, status=status.HTTP_404_NOT_FOUND)