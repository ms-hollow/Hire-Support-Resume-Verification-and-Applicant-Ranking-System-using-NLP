from rest_framework import serializers
from .models import Company

class CompanyProfileFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['company_name', 'industry', 'number_of_employees', 'hr_name', 'contact_number', 'company_address']

    def create(self, validated_data):
        user = validated_data.pop('user')
        company = Company.objects.create(user=user, **validated_data)

        return company
    
    def update(self, instance, validated_data):
        instance.company_name = validated_data.get('company_name', instance.company_name)
        instance.industry = validated_data.get('industry', instance.industry)
        instance.number_of_employees = validated_data.get('number_of_employees', instance.number_of_employees)
        instance.hr_name = validated_data.get('hr_name', instance.hr_name)
        instance.contact_number = validated_data.get('contact_number', instance.contact_number)
        instance.company_address = validated_data.get('company_address', instance.company_address)

        instance.save()
        return instance

