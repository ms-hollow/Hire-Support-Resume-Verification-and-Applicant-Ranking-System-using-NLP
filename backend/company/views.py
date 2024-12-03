from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Company
from .serializers import CompanyProfileFormSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated]) 
def complete_company_profile(request):
    company = get_object_or_404(Company, user=request.user)

    serializer = CompanyProfileFormSerializer(company, data=request.data)

    if serializer.is_valid():
        serializer.save()
        request.user.has_company_acc = True
        request.user.save()
        return Response({"message": "Your profile has been created."}, status=200)
    else:
        return Response(serializer.errors, status=400)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_company_profile(request, pk):
    company = get_object_or_404(Company, pk=pk)
    serializer = CompanyProfileFormSerializer(company)
    return Response(serializer.data, status=200)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_company_profile(request):
    company = get_object_or_404(Company, user=request.user)
    serializer = CompanyProfileFormSerializer(company, data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)
