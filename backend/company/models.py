from django.db import models
from users.models import User

# Create your models here.
class Company(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE) # nandito ang email & pass
    company_name = models.CharField(max_length=50, null=True, blank=False)
    number_applicants = models.PositiveIntegerField(null=True, blank=False)
    contact_number = models.CharField(null=True, blank=False)
    job_industry = models.CharField(max_length=50, null=True, blank=False)
    region = models.CharField(max_length=50, null=True, blank=False)
    province = models.CharField(max_length=50, null=True, blank=False)
    city = models.CharField(max_length=50, null=True, blank=False)
    postal_code = models.CharField(max_length=50, null=True, blank=False)
    barangay = models.CharField(max_length=50, null=True, blank=False)
    present_address =  models.CharField(max_length=50, null=True, blank=False)
    linkedin_profile  =  models.CharField(max_length=50, null=True, blank=False)
    
    def __str__(self):
        return self.company_name