from rest_framework import serializers
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
    
    def update(self, instance, validated_data):
        # Update each field if it's included in validated_data
        instance.applicant_name = validated_data.get('applicant_name', instance.applicant_name)
        instance.sex = validated_data.get('sex', instance.sex)
        instance.date_of_birth = validated_data.get('date_of_birth', instance.date_of_birth)
        instance.age = validated_data.get('age', instance.age)
        instance.contact_number = validated_data.get('contact_number', instance.contact_number)
        instance.present_address = validated_data.get('present_address', instance.present_address)
        instance.linkedin_profile = validated_data.get('linkedin_profile', instance.linkedin_profile)

        # Handle the many-to-many relationship for saved_jobs
        saved_jobs = validated_data.get('saved_jobs', None)
        if saved_jobs is not None:
            instance.saved_jobs.set(saved_jobs)  # Use set() for many-to-many fields

        instance.save()
        return instance