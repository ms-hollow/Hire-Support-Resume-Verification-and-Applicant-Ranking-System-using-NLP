from django import forms
from company.models import Company

class CompanyProfileForm(forms.ModelForm):
    class Meta:
        model = Company
        fields = ['company_name', 'industry', 'number_of_employees', 'hr_name', 'contact_number', 'company_address']