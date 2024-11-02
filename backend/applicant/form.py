from django import forms
from applicant.models import Applicant

class ApplicantProfileForm(forms.ModelForm):
    class Meta:
        model = Applicant
        exclude = ('user',)
        
