from rest_framework import serializers
from django.contrib.auth import authenticate
from  .models import Applicant

# Creating form for applicant profile
class ApplicantProfileFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = Applicant
        fields = ['applicant_name', 'sex', 'date_of_birth', 'age', 'contact_number', 'present_address', 'linkedin_profile', 'saved_jobs']

    def create(self, validated_data):
        user = validated_data.pop('user')
        applicant = Applicant.objects.create(user=user, **validated_data)

        return applicant
    
