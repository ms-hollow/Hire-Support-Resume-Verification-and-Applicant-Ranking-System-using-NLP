from django.db import models
from users.models import User

# Create your models here.
class Company(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=50, null=True, blank=True)
    industry = models.CharField(max_length=50, null=True, blank=True)
    number_of_employees = models.PositiveIntegerField(null=True, blank=True)
    hr_name = models.CharField(max_length=50, null=True, blank=True)
    contact_number = models.PositiveIntegerField(null=True, blank=True)
    company_address = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.company_name