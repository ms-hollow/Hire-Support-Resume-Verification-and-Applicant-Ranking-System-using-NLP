from django import forms
from jobs.models import JobHiring, ScoringCriteria

class JobHiringForm(forms.ModelForm):  
    class Meta:
        model = JobHiring
        exclude = ('company', 'creation_date',) 

    def __init__(self, *args, **kwargs):
        company = kwargs.pop('company', None)  # Extract the company from kwargs
        super(JobHiringForm, self).__init__(*args, **kwargs)
        if company:
            self.instance.company = company

class ScoringCriteriaForm(forms.ModelForm):
    class Meta:
        model = ScoringCriteria
        fields = [
            'criteria_name', 
            'weight_percentage', 
            'preference'
        ]
