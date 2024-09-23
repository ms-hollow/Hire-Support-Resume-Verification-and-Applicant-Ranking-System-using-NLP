from django.db import models

# Create your models here.

# TODO: Create a model for applicant

from django.db import models

# Create your models here.
class Applicant(models.Model):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50)
    middle_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50)
    sex = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Others', 'Others')])
    date_of_birth = models.DateField()
    age = models.IntegerField()
    contact_number = models.CharField(max_length=15)
    present_address = models.TextField()
    linkedin_profile = models.URLField(blank=True, null=True)
    password = models.CharField(max_length=20)
    saved_jobs = models.ManyToManyField('JobHiring', blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
    

