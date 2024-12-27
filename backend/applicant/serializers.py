from rest_framework import serializers
from  .models import Applicant

# Creating form for applicant profile
class ApplicantProfileFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = Applicant
        fields = ['first_name', 
                  'middle_name', 
                  'last_name', 
                  'sex', 
                  'date_of_birth', 
                  'age', 
                  'region',
                  'province',
                  'postal_code',
                  'city',
                  'contact_number', 
                  'barangay',
                  'present_address', 
                  'linkedin_profile', 
                  'saved_jobs']
    
    def create(self, validated_data):
        user = validated_data.pop('user')
        applicant = Applicant.objects.create(user=user, **validated_data)

        return applicant
    
    def update(self, instance, validated_data):
        # Update each field if it's included in validated_data
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.middle_name = validated_data.get('middle_name', instance.middle_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.sex = validated_data.get('sex', instance.sex)
        instance.date_of_birth = validated_data.get('date_of_birth', instance.date_of_birth)
        instance.age = validated_data.get('age', instance.age)
        instance.region = validated_data.get('region', instance.region)
        instance.province = validated_data.get('province', instance.province)
        instance.postal_code = validated_data.get('postal_code', instance.postal_code)
        instance.city = validated_data.get('city', instance.city)
        instance.contact_number = validated_data.get('contact_number', instance.contact_number)
        instance.barangay = validated_data.get('barangay', instance.barangay)
        instance.present_address = validated_data.get('present_address', instance.present_address)
        instance.linkedin_profile = validated_data.get('linkedin_profile', instance.linkedin_profile)

        # Handle the many-to-many relationship for saved_jobs
        saved_jobs = validated_data.get('saved_jobs', None)
        if saved_jobs is not None:
            instance.saved_jobs.set(saved_jobs)  # Use set() for many-to-many fields

        instance.save()
        return instance