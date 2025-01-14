from django.db import models
from company.models import Company
from users.models import User
import os
from django.utils.text import slugify

class JobHiring(models.Model): 
    job_hiring_id = models.AutoField(primary_key=True) #PK
    company = models.ForeignKey(Company, on_delete=models.CASCADE) #FK

    job_title = models.CharField(max_length=100, null=True, blank=False)
    job_industry = models.CharField(max_length=50, null=True, blank=False)
    job_description = models.TextField()
    
    work_location = models.CharField(max_length=300, null=True, blank=False)
    work_setup = models.CharField(max_length=300, null=True, blank=False)
    employment_type = models.CharField(max_length=300, null=True, blank=False)
    qualifications = models.TextField()
    schedule = models.CharField(max_length=300)
    salary = models.JSONField(null=True, blank=True)
    frequency = models.CharField(max_length=300, null=True, blank=False)
    benefits = models.JSONField(null=True, blank=True)
    experience_level = models.CharField(max_length=300, null=True, blank=False)
    num_positions = models.PositiveIntegerField()
    verification_option = models.CharField(max_length=300, null=True, blank=False)
    creation_date = models.DateField(auto_now_add=True)
    required_documents = models.JSONField(null=True, blank=True)
    application_deadline = models.DateField()
    status = models.CharField(max_length=10, null=True, blank=False)
    additional_notes = models.TextField(max_length=300, null=True, blank=True)

    def get_scoring_criteria(self):
        criteria_list = []
        for criteria in self.scoring_criteria.all():
            criteria_data = {
                'name': criteria.criteria_name,
                'weight': criteria.weight_percentage,
                'preference': criteria.preference
            }
            criteria_list.append(criteria_data)
        return criteria_list
    
    def __str__(self):
        return f"{self.job_title} at {self.company.company_name}"
    
#Represents the criteria used to evaluate applicants for a specific job posting. This model stores details about each scoring criterion, such as its name, weight, and preference.
class ScoringCriteria(models.Model):
    job_hiring = models.ForeignKey(JobHiring, related_name='scoring_criteria', on_delete=models.CASCADE)
    criteria_name = models.CharField(max_length=100, blank=True, null=True)
    weight_percentage = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    preference = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"{self.criteria_name} for {self.job_hiring.job_title}"

class JobApplication(models.Model):

    job_application_id = models.AutoField(primary_key=True)
    job_hiring = models.ForeignKey(JobHiring, on_delete=models.CASCADE)
    applicant = models.ForeignKey('applicant.Applicant', on_delete=models.CASCADE)  
    email = models.EmailField()  
    application_date = models.DateField(auto_now_add=True)
    application_status = models.CharField(max_length=20, default='draft')
    scores = models.JSONField(blank=True, null=True)
    verification_result = models.JSONField(blank=True, null=True)

    def __str__(self):
        return f"Application for {self.job_hiring.job_title}"

def applicant_document_upload_path(instance, filename):
    # Get the applicant's name, slugified (converted to a safe format for URLs)
    applicant_name = slugify(instance.job_application.applicant.name)  
    
    # Get the job posting ID from the related job_hiring
    job_posting = f"Job Posting - {instance.job_application.job_hiring.id}"
    
    # Get the document type, slugified
    document_type = slugify(instance.document_type)  # Convert the document type into a safe string for file storage
    
    # Return the full file path where the document will be stored
    return os.path.join('Applicants', applicant_name, job_posting, document_type, filename)

class JobApplicationDocumentFile(models.Model):
    # This field stores the actual document file, with a dynamic upload path.
    # The path is defined by the applicant_document_upload_path function.
    file = models.FileField(upload_to=applicant_document_upload_path)  
    
    # This field stores the timestamp when the file was uploaded.
    created_at = models.DateTimeField(auto_now_add=True)  # Automatically set when the file is first created.

    # String representation of the model (when printed or displayed)
    def __str__(self):
        return f"File uploaded on {self.created_at}"

# Model representing a document associated with a job application.
class JobApplicationDocument(models.Model):
    # Foreign key relationship to JobApplication. This ties the document to a specific job application.
    # 'related_name' allows reverse access to all documents from a JobApplication instance.
    job_application = models.ForeignKey(JobApplication, related_name='documents', on_delete=models.CASCADE)
    
    # The document's type (e.g., "Resume", "Cover Letter")
    document_type = models.CharField(max_length=255)  
    
    # Many-to-many relationship with JobApplicationDocumentFile.
    # A document can have multiple files (e.g., one document type may have multiple versions or formats).
    files = models.ManyToManyField(JobApplicationDocumentFile, related_name='documents')

    def __str__(self):
        return self.document_type

class RecentSearch(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    job_title = models.CharField(max_length=255, blank=True, null=True)
    job_industry = models.CharField(max_length=255, blank=True, null=True)
    work_location = models.CharField(max_length=255, blank=True, null=True)
    creation_date = models.CharField(max_length=50, blank=True, null=True)
    work_setup = models.CharField(max_length=50, blank=True, null=True)
    employment_type = models.CharField(max_length=50, blank=True, null=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    experience_level = models.CharField(max_length=50, blank=True, null=True)
    job_hirings = models.ManyToManyField(JobHiring, blank=True) # Store the actual job hirings

    def __str__(self):
        return f"Recent searches"
    
    def get_search_filters(self):
        return {
            "job_title": self.job_title,
            "job_industry": self.job_industry,
            "work_location": self.work_location,
            "creation_date": self.creation_date,
            "work_setup": self.work_setup,
            "employment_type": self.employment_type,
            "salary": self.salary,
            "experience_level": self.experience_level,
        }
