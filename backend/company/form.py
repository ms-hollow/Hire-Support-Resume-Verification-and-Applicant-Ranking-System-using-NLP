from django import forms
from .models import Company

class CompanyProfileForm(forms.ModelForm):
    class Meta:
        model = Company
        exclude = ('user',) # This will include everything na need fill-upan except the user