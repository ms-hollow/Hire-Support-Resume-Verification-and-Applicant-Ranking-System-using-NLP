from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import JobHiringSerializer, JobApplicationSerializer, JobApplicationDocumentSerializer
from .models import JobHiring, JobApplication, JobApplicationDocument, RecentSearch
from django.db import transaction
from django.utils import timezone
from datetime import timedelta
from django.views.decorators.csrf import csrf_exempt

#* Create Job Hiring
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_job_hiring(request):
    if request.method == 'POST':
        serializer = JobHiringSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#* Edit Job Hiring
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_job_hiring(request, pk):
    try:
        job_hiring = JobHiring.objects.get(pk=pk)
        serializer = JobHiringSerializer(job_hiring, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except JobHiring.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

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

#* Retrieve all job hirings
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def job_hiring_list(request):
    job_listings = JobHiring.objects.all()
    if not job_listings:
        return Response({"message": "No job listings found"}, status=404)
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

# Create a new job application
@api_view(['POST'])
def create_job_application(request):
    if request.method == 'POST':
        # Copy the data from the request
        data = request.data.copy()

        # Create a serializer for the JobApplication model
        serializer = JobApplicationSerializer(data=data)
        
        # Validate the serializer data
        if serializer.is_valid():
            with transaction.atomic():
                job_application = serializer.save(application_status="draft")  # Save as draft

                # Return the job application ID to frontend
                return Response({'job_application_id': job_application.id}, status=status.HTTP_201_CREATED)

        # If serializer is invalid, return validation errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# Upload documents for the job application
@api_view(['POST'])
def upload_documents(request):
    if request.method == 'POST':
        # Copy the request data
        data = request.data.copy()

        # Retrieve the job application ID from the request data
        job_application_id = data.get('job_application_id')
        
        # If no job application ID is provided, return an error
        if not job_application_id:
            return Response({'error': 'Job application ID is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Retrieve the job application from the database
        try:
            job_application = JobApplication.objects.get(id=job_application_id)
        except JobApplication.DoesNotExist:
            return Response({'error': 'Job application not found.'}, status=status.HTTP_404_NOT_FOUND)

        # If the job application is no longer in the draft state, prevent document uploads
        if job_application.application_status != 'draft':
            return Response({'error': 'Application is already submitted and cannot be updated.'}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve document types and files from the request data
        document_types = data.pop('document_type', [])
        document_files = request.FILES.getlist('document_file')

        # Save each document type and file associated with the job application
        for doc_type, doc_file in zip(document_types, document_files):
            JobApplicationDocument.objects.create(
                job_application=job_application,
                document_type=doc_type,
                document_file=doc_file
            )

        # Return a success message after uploading documents
        return Response({'message': 'Documents uploaded successfully.'}, status=status.HTTP_200_OK)


# Confirm the job application (view details and uploaded documents)
@api_view(['GET'])
def confirm_job_application(request, job_application_id):
    try:
        # Retrieve the job application from the database
        job_application = JobApplication.objects.get(id=job_application_id)
        
        # Retrieve all documents uploaded for the job application
        documents = JobApplicationDocument.objects.filter(job_application=job_application)

        # If the job application is not in draft state, prevent further updates
        if job_application.application_status != 'draft':
            return Response({'error': 'Application already submitted.'}, status=status.HTTP_400_BAD_REQUEST)

        # Serialize the job application and documents to return in the response
        job_application_data = JobApplicationSerializer(job_application).data
        document_data = JobApplicationDocumentSerializer(documents, many=True).data

        # Return the job application details and documents
        return Response({
            'job_application': job_application_data,
            'documents': document_data
        }, status=status.HTTP_200_OK)

    except JobApplication.DoesNotExist:
        return Response({'error': 'Job application not found.'}, status=status.HTTP_404_NOT_FOUND)


# Submit the job application (mark as completed)
@api_view(['POST'])
def submit_job_application(request):
    if request.method == 'POST':
        # Retrieve the job application ID from the request data
        job_application_id = request.data.get('job_application_id')

        # If no job application ID is provided, return an error
        if not job_application_id:
            return Response({'error': 'Job application ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve the job application from the database
        try:
            job_application = JobApplication.objects.get(id=job_application_id)
        except JobApplication.DoesNotExist:
            return Response({'error': 'Job application not found.'}, status=status.HTTP_404_NOT_FOUND)

        # If the job application is already completed, prevent resubmission
        if job_application.application_status == 'completed':
            return Response({'error': 'Application has already been submitted.'}, status=status.HTTP_400_BAD_REQUEST)

        # Update the application status to "completed"
        job_application.application_status = 'completed'
        job_application.save()

        # Return a success message and the final job application data
        return Response({
            'message': 'Application submitted successfully.',
            'job_application': JobApplicationSerializer(job_application).data
        }, status=status.HTTP_200_OK)


# def create_job_application(request):
#     if request.method == 'POST':
#         data = request.data.copy()  
        
#         job_hiring_id = data.get('job_hiring') 
#         applicant_id = data.get('applicant')  

#         # Check if an existing application already exists for the applicant and job_hiring
#         existing_application = JobApplication.objects.filter(job_hiring=job_hiring_id, applicant=applicant_id).first()

#         if existing_application:
#             return Response({'error': 'You have already applied for this job.'}, status=status.HTTP_400_BAD_REQUEST)
        
#         # Remove files-related fields from data to avoid issues with validation
#         document_types = data.pop('document_type', [])
#         document_files = request.FILES.getlist('document_file')

#         # Create the Job Application serializer
#         serializer = JobApplicationSerializer(data=data)
        
#         if serializer.is_valid():
#             with transaction.atomic():  # Optional, to ensure all-or-nothing saving
#                 job_application = serializer.save()  # Save the job application
                
#                 # Save each file with corresponding document type
#                 for doc_type, doc_file in zip(document_types, document_files):
#                     JobApplicationDocument.objects.create(
#                         job_application=job_application,
#                         document_type=doc_type,
#                         document_file=doc_file
#                     )
                
#                 return Response(serializer.data, status=status.HTTP_201_CREATED)
        
#         # If the serializer is not valid, return errors
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#* Delete Job Application
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_job_application(request, pk):
    try:
        job_application = JobApplication.objects.get(pk=pk)
        job_application.delete()
        return Response(status=status.HTTP_400_BAD_REQUEST)
    except JobApplication.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

#* Edit Job Application
@api_view(['POST'])
@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
def job_application_list(request):
    job_application = JobApplication.objects.all()
    serializer = JobApplicationSerializer(job_application, many=True)
    return Response(serializer.data)

#* View job application details
@api_view(['GET'])
@permission_classes([IsAuthenticated])
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
