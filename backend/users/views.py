from rest_framework.views import APIView # APIView used for creating class-based views to handle HTTP requests like registration, login, and logout easily.
from rest_framework.response import Response
from rest_framework import status,serializers
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import login, logout
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework_simplejwt.tokens import RefreshToken
import requests


User = get_user_model() # kukunin yung user na currently naka-login sa app

class RegisterUserView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            login(request, user)
            return Response({"message": "Registration successful"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#* JWT Based Authentication
class LoginUserView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')  # Extract email from the request data

        # Check if the email exists in the database
        if not User.objects.filter(email=email).exists():
            return Response({'error': 'Email does not exist'}, status=status.HTTP_404_NOT_FOUND)

        # Use the login serializer to validate credentials
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            refresh.payload['email'] = user.email
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            # Determine the user's role (applicant or company)
            user_role = 'company' if user.is_company else 'applicant' if user.is_applicant else 'unknown'

            return Response({
                'access': access_token,
                'refresh': refresh_token,
                'role': user_role,  # Return the role (applicant or company)
                'email': user.email # Include the email in the response
            }, status=status.HTTP_200_OK) 
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
# Customizing the JWT serializer to include user data in the response
class CustomTokenObtainPairSerializer(serializers.Serializer):
    def validate(self, attrs):
        validated_data = super().validate(attrs)
        return validated_data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class LogoutUserView(APIView):
    def post(self, request):
        logout(request)
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Ensure the user is authenticated
def change_password(request):
    user = request.user  # Get the currently authenticated user
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')
    confirm_password = request.data.get('confirm_password')

    if not user.check_password(current_password):
        return Response({"error": "Current password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

    if new_password != confirm_password:
        return Response({"error": "New passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()

    return Response({"message": "Password changed successfully."}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Ensure the user is authenticated
def user_list(request):
    users = User.objects.all()  # Get all users
    serializer = UserSerializer(users, many=True)  
    return Response(serializer.data)

@api_view(['POST'])
def google_login(request):
    token = request.data.get('token')
    if not token:
        return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Verify the token with Google
    google_verify_url = f"https://oauth2.googleapis.com/tokeninfo?id_token={token}"
    response = requests.get(google_verify_url)
    if response.status_code != 200:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
    
    user_info = response.json()
    email = user_info.get('email')

    # Check if a user with the email exists
    User = get_user_model()
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'User not found. Please register.'}, status=status.HTTP_404_NOT_FOUND)

    # Generate JWT tokens for the user
    refresh = RefreshToken.for_user(user)

    # Determine the user's role
    user_role = 'company' if user.is_company else 'applicant' if user.is_applicant else 'unknown'

    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'email': email,
        'role': user_role,  # Include the role in the response
    }, status=status.HTTP_200_OK)

#TODO
#* Setup Backend to Register
