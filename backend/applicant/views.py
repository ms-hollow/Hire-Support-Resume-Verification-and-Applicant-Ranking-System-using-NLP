from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Applicant
from .serializers import ApplicantProfileFormSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Ensure the user is authenticated
def complete_applicant_profile(request):
    # Retrieve the applicant profile
    applicant = get_object_or_404(Applicant, user=request.user)

    # Use the serializer to validate and create the applicant profile
    serializer = ApplicantProfileFormSerializer(applicant, data=request.data)

    if serializer.is_valid():
        # Save the validated data
        serializer.save()  # Save the applicant profile
        request.user.has_applicant_acc = True  # Mark the user as having an applicant account
        request.user.save()  # Save the user instance
        return Response({"message": "Your profile has been created."}, status=200)
    else:
        # Return serializer errors as response
        return Response(serializer.errors, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Ensure the user is authenticated
def view_applicant_profile(request, pk):
    # Use get_object_or_404 to handle cases where the applicant doesn't exist
    applicant = get_object_or_404(Applicant, pk=pk)
    serializer = ApplicantProfileFormSerializer(applicant)
    return Response(serializer.data, status=200)  # Return serialized applicant data

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_applicant_profile(request):
    applicant = get_object_or_404(Applicant, user=request.user)
    serializer = ApplicantProfileFormSerializer(applicant, data=request.data)

    if serializer.is_valid():
        # Save the updated applicant profile without contact number validation
        serializer.save()  # Save the updated applicant profile
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
