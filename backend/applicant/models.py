from django.db import models
from users.models import User

# Create your models here.
class Applicant(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=50, null=True, blank=False)
    last_name = models.CharField(max_length=50, null=True, blank=False)
    middle_name = models.CharField(max_length=50, null=True, blank=False)
    sex = models.CharField(max_length=10, null=True, blank=False)
    date_of_birth = models.DateField(null=True, blank=False)
    age = models.PositiveIntegerField(null=True, blank=False)
    region = models.CharField(max_length=50, null=True, blank=False)
    province = models.CharField(max_length=50, null=True, blank=False)
    postal_code = models.CharField(max_length=50, null=True, blank=False)
    city = models.CharField(max_length=50, null=True, blank=False)
    contact_number = models.CharField(null=True, blank=False)
    barangay = models.CharField(null=True, blank=False)
    present_address = models.CharField(null=True, blank=False)
    linkedin_profile = models.URLField(null=True, blank=False)
    saved_jobs = models.ManyToManyField('jobs.JobHiring', related_name='saved_by', blank=True)

    def __str__(self):
        return f"{self.first_name} {self.middle_name} {self.last_name}"
