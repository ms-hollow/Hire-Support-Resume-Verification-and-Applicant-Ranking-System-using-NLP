from rest_framework import serializers
from .models import Company

class CompanyProfileFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = [  'company_name',  
                    'number_applicants',  
                    'contact_number', 
                    'job_industry',
                    'region',
                    'province',
                    'city',
                    'postal_code',
                    'barangay',
                    'present_address',
                    'linkedin_profile'
                ]

    def create(self, validated_data):
        user = validated_data.pop('user')
        company = Company.objects.create(user=user, **validated_data)

        return company
    
    def update(self, instance, validated_data):
        instance.company_name = validated_data.get('company_name', instance.company_name)
        instance.number_applicants = validated_data.get('number_applicants', instance.number_applicants)
        instance.contact_number = validated_data.get('contact_number', instance.contact_number)
        instance.job_industry = validated_data.get('job_industry', instance.job_industry)
        instance.region = validated_data.get('region', instance.region)
        instance.province = validated_data.get('province', instance.province)
        instance.city = validated_data.get('city', instance.city)
        instance.postal_code = validated_data.get('postal_code', instance.postal_code)
        instance.barangay = validated_data.get('barangay', instance.barangay)
        instance.present_address = validated_data.get('present_address', instance.present_address)
        instance.linkedin_profile = validated_data.get('linkedin_profile', instance.linkedin_profile)

        instance.save()
        return instance

