from django.db import models
from company.models import Company

#* Notes: Hindi pa automatically nare-retrieve ang company name will find a way paano gagawin don
#TODO: Job Application

class JobHiring(models.Model):
    job_hiring_id = models.AutoField(primary_key=True) #PK
    company = models.ForeignKey(Company, on_delete=models.CASCADE) #FK
    job_industry = models.CharField(max_length=50)
    job_title = models.CharField(max_length=100)
    work_location = models.CharField(max_length=100)
    work_setup = models.CharField(max_length=20, choices=[('Onsite', 'Onsite'), ('Remote', 'Remote'), ('Hybrid', 'Hybrid')])
    employment_type = models.CharField(max_length=20, choices=[('Full-time', 'Full-time'), ('Part-time', 'Part-time'), ('Contract', 'Contract'), ('Internship', 'Internship')])
    num_positions = models.PositiveIntegerField()
    job_description = models.TextField()
    experience_level = models.CharField(max_length=20, choices=[('Internship','Internship'), ('Entry-level', 'Entry-level'), ('Associate', 'Associate'), 
                                                                ('Mid-level','Mid-level'), ('Senior', 'Senior'), ('Lead', 'Lead'), ('Manager', 'Manager')])
    qualifications = models.CharField(max_length=300)
    schedule = models.CharField(max_length=300)
    salary = models.CharField(max_length=300)
    benefits = models.CharField(max_length=300)

    verification_option = models.CharField(max_length=300, blank=True, null=True)
    creation_date = models.DateField(auto_now_add=True)
    application_deadline = models.DateField()
    status = models.CharField(max_length=10, choices=[('Draft', 'Draft'), ('Open', 'Open'), ('Active', 'Active'), ('Closed', 'Closed')])

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
        return self.job_title
    
#Represents the criteria used to evaluate applicants for a specific job posting. This model stores details about each scoring criterion, such as its name, weight, and preference.
class ScoringCriteria(models.Model):
    job_hiring = models.ForeignKey(JobHiring, related_name='scoring_criteria', on_delete=models.CASCADE)
    criteria_name = models.CharField(max_length=100, blank=True, null=True)
    weight_percentage = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    preference = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.criteria_name} for {self.job_hiring.job_title}"
    
class JobApplication(models.Model):
    job_application_id = models.AutoField(primary_key=True)  # PK
    job_hiring = models.ForeignKey(JobHiring, on_delete=models.CASCADE)  # FK to JobHiring
    applicant = models.ForeignKey('applicant.Applicant', on_delete=models.CASCADE)  # string reference # FK to Applicant 
    
    # Applicant details
    email = models.EmailField()
    first_name = models.CharField(max_length=50, blank=True, null=True)
    middle_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    
    # Documents
    resume = models.FileField(upload_to='resumes/')
    educational_documents = models.FileField(upload_to='education_docs/', blank=True, null=True)
    experience_documents = models.FileField(upload_to='experience_docs/', blank=True, null=True)
    additional_documents = models.FileField(upload_to='additional_docs/', blank=True, null=True)
    
    # Application status and scores
    application_date = models.DateField(auto_now_add=True)
    application_status = models.CharField(max_length=20, choices=[('Pending', 'Pending'), ('Shortlisted', 'Shortlisted'), 
                                                                  ('Rejected', 'Rejected'), ('Accepted', 'Accepted')])
    scores = models.JSONField(blank=True, null=True)  # To store calculated scores per criteria
    verification_result = models.JSONField(blank=True, null=True)  # Store verification results
    
    # Methods to calculate and update scores
    def calculate_scores(self):
        # Fetch the criteria from job_hiring
        criteria = self.job_hiring.get_scoring_criteria()
        
        # Implement score calculation based on the criteria and applicant details
        score_data = {}
        for criterion in criteria:
            score_data[criterion['name']] = 0  # Placeholder for actual scoring logic
        
        # Store the calculated scores
        self.scores = score_data
        self.save()
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} application for {self.job_hiring.job_title}"


