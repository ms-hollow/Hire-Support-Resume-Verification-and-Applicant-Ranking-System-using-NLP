from django.db import models
from applicant.models import Applicant
from company.models import Company

#! Note: Kapag may binago sa model, lagi i-migrate 
#? Command: 
#? python manage.py makemigrations
#? python manage.py migrate

class JobHiring(models.Model):
    job_hiring_id = models.AutoField(primary_key=True) #PK
    company = models.ForeignKey(Company, on_delete=models.CASCADE) #FK
    job_industry = models.CharField(max_length=50)
    job_title = models.CharField(max_length=100)
    work_location = models.CharField(max_length=100)
    work_arrangement = models.CharField(max_length=20, choices=[('Onsite', 'Onsite'), ('Remote', 'Remote'), ('Hybrid', 'Hybrid')])
    employment_type = models.CharField(max_length=20, choices=[('Full-time', 'Full-time'), ('Part-time', 'Part-time'), ('Contract', 'Contract'), ('Internship', 'Internship')])
    num_positions = models.PositiveIntegerField()
    job_description = models.TextField()
    qualifications = models.TextField()
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    benefits = models.TextField(blank=True, null=True)
    
    verification_option = models.CharField(max_length=50)
    creation_date = models.DateField(auto_now_add=True)
    application_deadline = models.DateField() 
    status = models.CharField(max_length=10, choices=[('Draft', 'Draft'), ('Active', 'Active'), ('Closed', 'Closed')])

    def get_scoring_criteria(self): # Retrieves the scoring criteria associated with this job posting in a 2D array format.
        criteria_array = []
        for criteria in self.scoring_criteria.all():
            criteria_data = [
                criteria.criteria_name,
                criteria.weight_percentage,
                criteria.preference
            ]
            criteria_array.append(criteria_data)
        return criteria_array

    def __str__(self):
        return self.job_title

class ScoringCriteria(models.Model): #Represents the criteria used to evaluate applicants for a specific job posting. This model stores details about each scoring criterion, such as its name, weight, and preference.
    job_hiring = models.ForeignKey(JobHiring, related_name='scoring_criteria', on_delete=models.CASCADE)
    criteria_name = models.CharField(max_length=100)
    weight_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    preference = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.criteria_name} for {self.job_hiring.job_title}"

class JobApplication(models.Model):
    application_id = models.AutoField(primary_key=True) #PK
    applicant = models.ForeignKey(Applicant, on_delete=models.CASCADE) #FK
    job_hiring = models.ForeignKey(JobHiring, on_delete=models.CASCADE) #FK
    resume = models.FileField(upload_to='resumes/')
    educational_documents = models.FileField(upload_to='education_docs/', blank=True, null=True)
    experience_documents = models.FileField(upload_to='experience_docs/', blank=True, null=True)
    additional_documents = models.FileField(upload_to='additional_docs/', blank=True, null=True)
    application_date = models.DateField(auto_now_add=True) 
    status = models.CharField(max_length=20, choices=[('Pending', 'Pending'), ('Shortlisted', 'Shortlisted'), ('Rejected', 'Rejected'), ('Scheduled Interview', 'Scheduled Interview'), ('Accepted', 'Accepted'), ('Withdrawn', 'Withdrawn')])
    interview_date = models.DateField() 
    interview_time = models.TimeField()
    interview_location = models.CharField(max_length=255, blank=True, null=True)

    scores = models.CharField(max_length=255) # ? this will store the overall score and score per criteria
    verification_result = models.CharField(max_length=255) # ? this will store list of verified and unverified credentials

    note = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Application {self.application_id} for {self.job_hiring.job_title}"