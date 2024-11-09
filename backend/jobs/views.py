from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import JobHiringSerializer, JobApplicationSerializer
from .models import JobHiring, JobApplication, JobApplicationDocument
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
    job_hirings = JobHiring.objects.all()
    serializer = JobHiringSerializer(job_hirings, many=True)
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
    company_name = request.query_params.get('company_name', '')
    job_hirings = JobHiring.objects.filter(company__company_name__icontains=company_name)
    serializer = JobHiringSerializer(job_hirings, many=True)
    return Response(serializer.data)

#* Create Job Application
@csrf_exempt #! Remove kapag tapos na sa testing
@api_view(['POST'])
def create_job_application(request):
    if request.method == 'POST':
        # Extract main data, removing document fields
        document_types = request.data.getlist('document_type[]')
        document_files = request.FILES.getlist('document_file[]')

        # Create the job application
        data = request.data.copy()
        data.pop('document_type', None)
        data.pop('document_file', None)

        # Validate and save main job application data
        serializer = JobApplicationSerializer(data=data)
        if serializer.is_valid():
            job_application = serializer.save()

            # Manually create the documents if files exist
            for document_type, document_file in zip(document_types, document_files):
                JobApplicationDocument.objects.create(
                    job_application=job_application,
                    document_type=document_type,
                    document_file=document_file
                )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#* Delete Job Application
@csrf_exempt #! Remove kapag tapos na sa testing
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