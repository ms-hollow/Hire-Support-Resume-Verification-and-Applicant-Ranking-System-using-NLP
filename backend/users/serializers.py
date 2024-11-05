from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User
from applicant.models import Applicant
from company.models import Company

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'is_applicant', 'is_company']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.username = user.email
        user.set_password(password)  # Encrypt password
        user.save()

        # Create profile based on user type
        if user.is_applicant:
            Applicant.objects.create(user=user)
        elif user.is_company:
            Company.objects.create(user=user)

        return user
    
class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        user = authenticate(username=email, password=password)
        if user is None:
            raise serializers.ValidationError("Invalid email or password.")
        if not user.is_active:
            raise serializers.ValidationError("Account is inactive.")

        data['user'] = user
        return data