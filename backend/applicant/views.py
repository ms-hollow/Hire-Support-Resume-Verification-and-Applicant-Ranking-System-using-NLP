# from django.shortcuts import render, redirect
# from django.contrib import messages
# from .models import Applicant
# from .form import ApplicantProfileForm
# from users.models import User

# def complete_applicant_profile(request):
#     applicant = Applicant.objects.get(user=request.user)

#     if request.method == 'POST':
#         form = ApplicantProfileForm(request.POST, instance=applicant)

#         if form.is_valid():
#             contact_number = form.cleaned_data.get('contact_number')
#             valid = True

#             if not contact_number.startswith('9'):
#                 messages.warning(request, "Please enter a valid Philippine contact number")
#                 valid = False

#             if len(contact_number) < 9:
#                 messages.warning(request, "Contact number must contain at least 9 digits.")
#                 valid = False
            
#             if not contact_number.isdigit():
#                 messages.warning(request, "Please enter a valid Philippine contact number")
#                 valid = False

#             if valid:
#                 # Concatenate the country code
#                 contact_number = '+63 ' + contact_number

#                 var = form.save(commit=False)
#                 var.contact_number = contact_number
#                 user = User.objects.get(id=request.user.id)
#                 user.has_applicant_acc = True
#                 var.save()
#                 user.save()
#                 messages.info(request, 'Your account has been created.')
#                 return redirect('dashboard')
#         else:
#             for field, errors in form.errors.items():
#                 for error in errors:
#                     messages.warning(request, f"{field}: {error}" )
#     else:
#         form = ApplicantProfileForm(instance=applicant)

#     context = {'form' : form}
#     return render(request, 'applicant/complete_applicant_profile.html', context)

# def view_applicant_profile(request, pk):
#     applicant = Applicant.objects.get(pk=pk)
#     context =  {'applicant':applicant}
#     return render(request, 'applicant/view_applicant_profile.html', context)

# #TODO edit applicant profile function
# #TODO save jobs

from django.shortcuts import get_object_or_404
from django.contrib import messages
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
    
    # Use the serializer to validate and create/update the applicant profile
    serializer = ApplicantProfileFormSerializer(applicant, data=request.data)

    if serializer.is_valid():
        contact_number = serializer.validated_data.get('contact_number')
        valid = True

        # Validate the contact number
        if not contact_number.startswith('9'):
            return Response({"error": "Please enter a valid Philippine contact number"}, status=400)
        if len(contact_number) < 9:
            return Response({"error": "Contact number must contain at least 9 digits."}, status=400)
        if not contact_number.isdigit():
            return Response({"error": "Please enter a valid Philippine contact number"}, status=400)

        if valid:
            # Add the country code
            contact_number = '+63 ' + contact_number
            
            # Save the validated data
            serializer.save(contact_number=contact_number)  # Save the applicant profile
            request.user.has_applicant_acc = True  # Mark the user as having an applicant account
            request.user.save()  # Save the user instance
            return Response({"message": "Your profile has been updated."}, status=200)
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
def edit_applicant_profile(request):
    applicant = get_object_or_404(Applicant, user=request.user)
    serializer = ApplicantProfileFormSerializer(applicant, data=request.data)

    if serializer.is_valid():
        contact_number = serializer.validated_data.get('contact_number')
        valid = True

        # Validate the contact number
        if not contact_number.startswith('9'):
            messages.warning(request, "Please enter a valid Philippine contact number")
            valid = False
        if len(contact_number) < 9:
            messages.warning(request, "Contact number must contain at least 9 digits.")
            valid = False
        if not contact_number.isdigit():
            messages.warning(request, "Please enter a valid Philippine contact number")
            valid = False

        if valid:
            contact_number = '+63 ' + contact_number
            serializer.save(contact_number=contact_number)  # Save the updated applicant profile
            messages.info(request, 'Your profile has been updated.')
            return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Return errors if invalid
