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
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.models import User
from django.shortcuts import render
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from django.conf import settings
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.views import TokenRefreshView

User = get_user_model() # kukunin yung user na currently naka-login sa app

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['email'] = user.email
        token['is_company'] = user.is_company
        token['is_applicant'] = user.is_applicant

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        email = request.data.get('username', None)
        password = request.data.get('password', None)

        # Validate email format
        if not email:
            return Response({'error': 'Email is required'}, status=400)
        
        try:
            EmailValidator()(email)
        except ValidationError:
            return Response({'error': 'Invalid email format'}, status=400)

        # Check for missing password
        if not password:
            return Response({'error': 'Password is required'}, status=400)

        # Check if the user exists
        user = User.objects.filter(email=email).first()
        if user is None:
            return Response({'error': 'Email does not exist'}, status=404)

        # Check if the password is correct
        if not check_password(password, user.password):
            return Response({'error': 'Invalid password'}, status=400)

        # Generate JWT token if validation passes
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=200)
        return Response({'error': 'Invalid credentials'}, status=400)
    
class MyTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        refresh_token = request.data.get('refresh')  # Get the refresh token from the request
        if refresh_token:
            response.data['refresh'] = refresh_token  # Add it back to the response
        return response

class RegisterUserView(APIView):
    def post(self, request):
        # Check if the email already exists in the database
        email = request.data.get('email')
        if User.objects.filter(email=email).exists():
            return Response({'email': ['This email is already registered.']}, status=status.HTTP_400_BAD_REQUEST)

        # Proceed with registration if email is unique
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token

            access_token['is_company'] = user.is_company
            access_token['is_applicant'] = user.is_applicant

            # Return the tokens in the response
            return Response({
                "access_token": str(access_token),
                "refresh_token": str(refresh),
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
def user_list(request):
    users = User.objects.all()  # Get all users
    serializer = UserSerializer(users, many=True)  
    return Response(serializer.data)

@api_view(['POST'])
def check_email(request):
    email = request.data.get('email', None)
    
    if not email:
        return Response({'error': 'Email is required'}, status=400)
    
    # Check if the email already exists in the database
    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email is already registered'}, status=409)
    else:
        return Response({'message': 'Email is available'}, status=200)
    
@api_view(['POST'])
def auth_email(request):
    email = request.data.get('email', None)
    
    if not email:
        return Response({'error': 'Email is required'}, status=400)
    
    # Check if the email exists in the database
    if User.objects.filter(email=email).exists():
        return Response({'message': 'Account Found'}, status=200)
    else:
        return Response({'error': 'Email does not exist'}, status=status.HTTP_404_NOT_FOUND)

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

    print(f"Google login successful. User email: {email}")  # Print the email from the token

    # Check if a user with the email exists
    User = get_user_model()
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'User not found. Please register.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"An error occurred: {e}")
        return Response({'error': 'An unexpected error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Print user details for debugging
    print(f"User found: {user}")  
    print(f"User is_company: {user.is_company}")  
    print(f"User is_applicant: {user.is_applicant}")  

    # Generate JWT tokens for the user, including the roles
    refresh = RefreshToken.for_user(user)
    access_token = refresh.access_token

    # Manually add the roles to the token
    access_token['is_company'] = user.is_company
    access_token['is_applicant'] = user.is_applicant

    # Return the response with user data, including roles
    return Response({
        'access': str(access_token),
        'refresh': str(refresh),
        'email': email,
        'is_company': user.is_company,
        'is_applicant': user.is_applicant,
    }, status=status.HTTP_200_OK)

def test_csrf(request):
    return render(request, 'users/test_csrf.html')

from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_protect

@csrf_protect
def get_csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrf_token': csrf_token})

from django.views.decorators.csrf import csrf_exempt
@csrf_exempt
class PasswordResetRequest(APIView):
    def post(self, request):
        email = request.data.get("email")
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "No user found with this email."}, status=status.HTTP_404_NOT_FOUND)

        # Generate password reset token and uid
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(user.pk.encode()).decode()
        
        # Send the reset email
        reset_link = f'http://localhost:3000/users/password-reset/{uid}/{token}/'
        send_mail(
            'Password Reset Request',
            f'Click the link to reset your password: {reset_link}',
            'noreply@yourdomain.com',
            [email],
            fail_silently=False,
        )

        return Response({"detail": "Password reset email sent."}, status=status.HTTP_200_OK)
