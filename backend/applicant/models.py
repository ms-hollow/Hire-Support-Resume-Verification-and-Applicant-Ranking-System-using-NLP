from django.db import models
from users.models import User


class Applicant(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=50)
    middle_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50)
    sex = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Others', 'Others')])
    date_of_birth = models.DateField()
    age = models.IntegerField()
    contact_number = models.CharField(max_length=15)
    present_address = models.CharField(max_length=50)
    linkedin_profile = models.URLField(blank=True, null=True)
    # saved_jobs = models.ManyToManyField('JobHiring', blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
    

