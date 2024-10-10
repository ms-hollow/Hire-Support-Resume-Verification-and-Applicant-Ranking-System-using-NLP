from django import forms
from applicant.models import Applicant

class ApplicantProfileForm(forms.ModelForm):
    class Meta:
        model = Applicant
        fields = ['first_name', 'middle_name', 'last_name', 'sex', 'date_of_birth', 
                  'age', 'contact_number', 'present_address', 'linkedin_profile']
        
