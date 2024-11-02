from django import forms
from jobs.models import JobHiring, ScoringCriteria

class JobHiringForm(forms.ModelForm):  
    class Meta:
        model = JobHiring
        fields = [
            'company', 
            'job_industry', 
            'job_title', 
            'work_location', 
            'work_setup', 
            'employment_type', 
            'num_positions', 
            'job_description', 
            'experience_level', 
            'qualifications', 
            'schedule',
            'salary', 
            'benefits', 
            'verification_option', 
            'application_deadline', 
            'status'
        ]

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
