from django.db import models
from company.models import Company
from users.models import User

#TODO Need to migrate

class JobHiring(models.Model): 
    job_hiring_id = models.AutoField(primary_key=True) #PK
    company = models.ForeignKey(Company, on_delete=models.CASCADE) #FK

    job_title = models.CharField(max_length=100, null=True, blank=False)
    job_industry = models.CharField(max_length=50, null=True, blank=False)
    job_description = models.TextField()
    
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
    creation_date = models.DateField(auto_now_add=True)
    
    verification_option = models.CharField(max_length=300, null=True, blank=True)
    required_documents = models.JSONField(null=True, blank=True)
    application_deadline = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=10, null=True, blank=True)
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


class JobApplicationDocument(models.Model):
    job_application = models.ForeignKey(JobApplication, related_name='documents', on_delete=models.CASCADE)
    document_type = models.CharField(max_length=255)
    document_file = models.FileField(upload_to='documents/') # location kung saan siya iuupload #TODO modify ang path

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