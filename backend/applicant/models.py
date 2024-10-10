from django.db import models
from users.models import User

# Create your models here.
class Applicant(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=50, null=True, blank=True)
    middle_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, null=True, blank=True)
    sex = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Others', 'Others')], null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    age = models.PositiveIntegerField(null=True, blank=True)
    contact_number = models.PositiveIntegerField(null=True, blank=True)
    present_address = models.CharField(max_length=50, null=True, blank=True)
    linkedin_profile = models.URLField(blank=True, null=True)
    # saved_jobs = models.ManyToManyField(to='job.JobHiring', blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
