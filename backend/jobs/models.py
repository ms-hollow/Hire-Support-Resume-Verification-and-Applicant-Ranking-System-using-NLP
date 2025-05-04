from django.db import models
from company.models import Company
from users.models import User
import os
from google_drive.storage import GoogleDriveStorage
from django.conf import settings

STATUS_CHOICES = (
    ('draft', 'Draft'),
    ('open', 'Open'),
    ('closed', 'Closed'),
    ('complete', 'Complete')
)

class JobHiring(models.Model): 
    job_hiring_id = models.AutoField(primary_key=True) #PK
    company = models.ForeignKey(Company, on_delete=models.CASCADE) #FK

    job_title = models.CharField(max_length=100, null=True, blank=False)
    job_industry = models.CharField(max_length=50, null=True, blank=False)
    specialization = models.JSONField(null=True, blank=False)
    job_description = models.TextField(null=True, blank=False)
    
    region = models.CharField(max_length=300, null=True, blank=False)
    province = models.CharField(max_length=300, null=True, blank=False)
    city = models.CharField(max_length=300, null=True, blank=False)

    work_setup = models.CharField(max_length=300, null=True, blank=False)
    employment_type = models.CharField(max_length=300, null=True, blank=False)
    qualifications = models.TextField()
    schedule = models.CharField(max_length=300)
    benefits = models.CharField(max_length=300, null=True, blank=True) # Note: change to CharField
    experience_level = models.CharField(max_length=300, null=True, blank=False)
    num_positions = models.PositiveIntegerField()
    salary_min = models.CharField(max_length=300, null=True, blank=True) # Note: change to CharField
    salary_max = models.CharField(max_length=300, null=True, blank=True) # Note: change to CharField
    salary_frequency = models.CharField(max_length=300, null=True, blank=False)
    creation_date = models.DateTimeField(auto_now_add=True)
    
    verification_option = models.CharField(max_length=300, null=True, blank=True)
    required_documents = models.JSONField(null=True, blank=True)
    application_deadline = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, null=True, blank=True)

    weight_of_criteria = models.JSONField(null=True, blank=True)
    additional_notes = models.TextField(null=True, blank=True) 

    num_applications = models.PositiveIntegerField(default=0)

    def update_num_applications(self): # Method to update the num_applications field.
        self.num_applications = self.jobapplication_set.count() 
        self.save()

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
    
    def check_applicant_count(self):
        applicant_count = self.jobapplication_set.count()
        thresholds = [5] # Pwede palitan or dagdagan

        for threshold in thresholds:
            if applicant_count == threshold:
                message = f"Your job hiring for {self.job_title} has reached number of applicants."
                
                # Create a notification for the company
                Notification.objects.create(
                    recipient=self.company.user,  
                    message=message
                )

    def __str__(self):
        return f"{self.job_title} at {self.company.company_name}"

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
    
    # Updated status choices
    APPLICATION_STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('processing', 'Processing'),
        ('processed', 'Submitted'),
        ('error', 'Processing Failed'),
        ('cancelled', 'Cancelled'),
        ('shortlisted', 'Shortlisted'),
        ('rejected', 'Rejected'),
        ('interview scheduled', 'Interview Scheduled'),
        ('emailed', 'Emailed'),
        ('accepted', 'Accepted'),
    ]
    
    application_status = models.CharField(
        max_length=20, 
        choices=APPLICATION_STATUS_CHOICES,
        default='draft'
    )
    scores = models.JSONField(blank=True, null=True)
    verification_result = models.JSONField(blank=True, null=True)
    interview_date = models.DateField(null=True, blank=True)
    interview_start_time = models.TimeField(null=True, blank=True)
    interview_end_time = models.TimeField(null=True, blank=True)
    interview_location_link = models.CharField(max_length=255, null=True, blank=True)

    def notify_applicant(self, message):
        Notification.objects.create(
            recipient=self.applicant.user,
            message=message
        )

    def save(self, *args, **kwargs):
        is_new = self._state.adding
        old_status = None

        if not is_new:
            old_instance = JobApplication.objects.get(pk=self.pk)
            old_status = old_instance.application_status

        super().save(*args, **kwargs)

        if is_new:
            self.job_hiring.update_num_applications()
            self.job_hiring.check_applicant_count()
        elif old_status != self.application_status:
            self.notify_applicant(f"Your application for {self.job_hiring.job_title} was {self.application_status.lower()}.")

    def __str__(self):
        return f"Application for {self.job_hiring.job_title}"


def get_resume_upload_path(instance, filename):
    """Define upload path for resume files"""
    job_hiring_id = instance.job_application.job_hiring.job_hiring_id
    applicant_id = instance.job_application.applicant.id
    
    # Ensure directory exists
    from main_model.utils.file_structure import get_applicant_dir
    applicant_dir = get_applicant_dir(job_hiring_id, applicant_id)
    
    # Create a new filename with original extension
    name, ext = os.path.splitext(filename)
    new_filename = f"resume{ext}"
    
    return os.path.join(f'job_hirings/job_hiring_{job_hiring_id}/applications/applicant_{applicant_id}', new_filename)

def get_document_upload_path(instance, filename):
    """Define upload path for document files based on document type"""
    job_hiring_id = instance.job_application.job_hiring.job_hiring_id
    applicant_id = instance.job_application.applicant.id
    doc_type = instance.document_type.lower()
    
    # Ensure directory exists
    from main_model.utils.file_structure import get_document_type_dir
    doc_dir = get_document_type_dir(job_hiring_id, applicant_id, doc_type)
    
    # Build path and ensure it's relative (no leading slash)
    path = f'job_hirings/job_hiring_{job_hiring_id}/applications/applicant_{applicant_id}/documents/{doc_type}/{filename}'
    return path.lstrip('/')  # Remove leading slash if present

# Create a single instance to be reused
google_drive_storage = GoogleDriveStorage() if getattr(settings, 'GDRIVE_ENABLED', False) else None

class JobApplicationDocument(models.Model):
    job_application = models.ForeignKey(JobApplication, related_name='documents', on_delete=models.CASCADE)
    document_type = models.CharField(max_length=255)
    
    # Use a callable for upload_to
    document_file = models.FileField(
        upload_to=get_document_upload_path,
        storage=google_drive_storage if getattr(settings, 'GDRIVE_ENABLED', False) else None
    )
    
    # Add a field to store Google Drive file ID
    google_drive_id = models.CharField(max_length=255, blank=True, null=True)
    
    def __str__(self):
        return f"{self.document_type} for {self.job_application}"

class Notification(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    job_application = models.ForeignKey(JobApplication, on_delete=models.CASCADE, null=True, blank=True) 

    def __str__(self):
        return f"Notification to {self.recipient}"
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
