from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import JobHiringSerializer, JobApplicationSerializer, JobApplicationDocumentSerializer, NotificationSerializer
from applicant.serializers import ApplicantProfileFormSerializer
from .models import JobHiring, JobApplication, JobApplicationDocument, RecentSearch, Company, Notification
from applicant.models import Applicant
from django.db import transaction
from django.utils import timezone
from datetime import timedelta
from django.views.decorators.csrf import csrf_exempt
from main_model.utils.file_processors import extract_hiring_settings
from main_model.utils.file_processors import extract_application_data
from main_model.hire_support import process_application
import logging
from django.conf import settings

# Configure logging
logger = logging.getLogger(__name__)
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
        # Save the JobHiring instance
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

#* Retrieve job hiring lists made by company
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
#* Applicant Side
@api_view(['GET']) 
@permission_classes([IsAuthenticated])
def job_hiring_list(request):
    job_listings = JobHiring.objects.filter(status='open')

    if not job_listings:
        return Response({"message": "No draft job listings found"}, status=404)

    serializer = JobHiringSerializer(job_listings, many=True)
    return Response(serializer.data)
    
#* View job hiring details || Specific Job Hiring
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
                # Save application with submitted status
                job_application = serializer.save(application_status='processing')

                # Save each file with corresponding document type in proper location
                for i, doc_file in enumerate(document_files):
                    # Make sure index is valid
                    doc_type = document_types[i] if i < len(document_types) else 'other'
                    
                    # Create and save the document
                    document = JobApplicationDocument(
                        job_application=job_application,
                        document_type=doc_type,
                        document_file=doc_file
                    )

                    # Save the document
                    if settings.GDRIVE_ENABLED:
                        # Save the document which will upload to Google Drive
                        document.save()
                        
                        # If the GoogleDriveStorage._save method returned a Google Drive ID
                        # it should be accessible from the file object
                        if hasattr(doc_file, 'google_drive_id'):
                            document.google_drive_id = doc_file.google_drive_id
                            print(f"Setting Google Drive ID: {document.google_drive_id}")
                            document.save(update_fields=['google_drive_id'])
                        else:
                            print("No Google Drive ID found in file object")
                    else:
                        document.save()
                
                # Update status and run background tasks
                job_application.application_status = 'processing'
                job_application.save()
                
                # After saving the job application, check for applicant count and create notifications
                job_hiring = job_application.job_hiring
                job_hiring.check_applicant_count() # Check if any thresholds are met and send notification
                
                # Start processing in background
                from .tasks import run_in_background
                run_in_background(job_application.job_application_id)
                
                # Return immediately with processing status and ID
                return Response({
                    "message": "Your application has been submitted and is being processed.",
                    "application_id": job_application.job_application_id,
                    "status": "processing",
                    "data": serializer.data
                }, status=status.HTTP_202_ACCEPTED)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#? For company side kapag papalitan na ang status
@api_view(['PUT'])
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

    return Response({'message': 'Application status updated!'})

#? Check specific application
@api_view(['GET'])
def get_application_status(request, application_id):
    try:
        job_application = JobApplication.objects.get(job_application_id=application_id)
        
        response_data = {
            'application_id': job_application.job_application_id,
            'status': job_application.application_status,
            'job_title': job_application.job_hiring.job_title,
            'application_date': job_application.application_date,
        }
        
        # Include results if processing is complete
        if job_application.application_status == 'processed':
            response_data['scores'] = job_application.scores
            response_data['verification_result'] = job_application.verification_result
            
        return Response(response_data, status=status.HTTP_200_OK)
        
    except JobApplication.DoesNotExist:
        return Response({
            "error": "Job application not found."
        }, status=status.HTTP_404_NOT_FOUND)

#* Applicant side to check if the applicant has already applied for a specific job hiring 
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

#* Get all job applications of the applicant
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_application_applicant(request):
    applicant = get_object_or_404(Applicant, user=request.user)
    job_applications = JobApplication.objects.filter(applicant=applicant)
    serializer = JobApplicationSerializer(job_applications, many=True)
    return Response(serializer.data)

#* Get specific job application of the applicant
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_job_specific_application(request, application_id):
    try:
        job_application = JobApplication.objects.get(pk=application_id)
        job_application_serializer = JobApplicationSerializer(job_application)
        job_hiring_serializer = JobHiringSerializer(job_application.job_hiring)

        # Combine the serialized data
        response_data = job_application_serializer.data
        response_data['company_name'] = job_hiring_serializer.data.get('company_name')

        return Response(response_data, status=status.HTTP_200_OK)
    except JobApplication.DoesNotExist:
        return Response({"error": "Job application not found."}, status=status.HTTP_404_NOT_FOUND)

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
@api_view(['PUT'])
def edit_job_application(request, pk):
    try:
        job_application = JobApplication.objects.get(pk=pk)

        # Filter the request data to include only the allowed fields
        allowed_fields = ['application_status', 'interview_date', 'interview_start_time', 'interview_end_time', 'interview_location_link']
        filtered_data = {key: value for key, value in request.data.items() if key in allowed_fields}

        # Pass the filtered data to the serializer
        serializer = JobApplicationSerializer(job_application, data=filtered_data, partial=True)

        # Validate and save the changes
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except JobApplication.DoesNotExist:
        return Response({"error": "Job application not found."}, status=status.HTTP_404_NOT_FOUND)

#* Get the list of all job applications of the applicant 
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
        return Response(serializer.data, status=status.HTTP_200_OK)

    except JobApplication.DoesNotExist:
        return Response({"error": "Job application not found."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PATCH'])
def cancel_job_application(request, application_id):
    try:
        job_application = JobApplication.objects.get(job_application_id=application_id)

        # Check if the status is already 'withdrawn'
        if job_application.application_status == 'withdrawn':
            return Response({"message": "Job application is already withdrawn."}, status=status.HTTP_400_BAD_REQUEST)

        # Update the status to 'withdrawn'
        job_application.application_status = 'withdrawn'
        job_application.save()

        return Response({"message": "Job application cancelled successfully."}, status=status.HTTP_200_OK)
    
    except JobApplication.DoesNotExist:
        return Response({"error": "Job application not found."}, status=status.HTTP_404_NOT_FOUND)

#* Get all job applications for a specific job hiring
@api_view(['GET'])
def get_applicants_summary(request, job_hiring_id):
    try:
        job_hiring = JobHiring.objects.get(pk=job_hiring_id)
        applicants = JobApplication.objects.filter(job_hiring=job_hiring)

        # Serialize the applicants data
        job_application_serializer = JobApplicationSerializer(applicants, many=True)
        
        # Add applicant profiles to each job application
        application_lists = []
        for applicant_data in job_application_serializer.data:
            applicant_id = applicant_data.get('applicant')  # Get the applicant ID
            if applicant_id:
                try:
                    # Query the Applicant model
                    applicant = Applicant.objects.get(pk=applicant_id)
                    # Serialize the applicant profile
                    applicant_serializer = ApplicantProfileFormSerializer(applicant)
                    # Add the applicant profile to the job application data
                    applicant_data['applicant_profile'] = applicant_serializer.data
                except Applicant.DoesNotExist:
                    applicant_data['applicant_profile'] = {"error": f"Applicant with ID {applicant_id} does not exist."}
            else:
                applicant_data['applicant_profile'] = {"error": "Applicant ID is missing."}
            
            # Append the updated job application data to the list
            application_lists.append(applicant_data)
        
        # Return the response with job applications and their associated applicant profiles
        return Response(application_lists, status=status.HTTP_200_OK)
    
    except JobHiring.DoesNotExist:
        return Response({"error": "Job hiring not found."}, status=status.HTTP_404_NOT_FOUND)
