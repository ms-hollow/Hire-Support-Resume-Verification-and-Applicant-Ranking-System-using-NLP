from django.db import models
from users.models import User

# Create your models here.
class Company(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE) # nandito ang email & pass
    company_name = models.CharField(max_length=50, null=True, blank=False)
    industry = models.CharField(max_length=50, null=True, blank=False)
    number_of_employees = models.PositiveIntegerField(null=True, blank=False)
    hr_name = models.CharField(max_length=50, null=True, blank=False)
    contact_number = models.CharField(null=True, blank=False)
    company_address = models.CharField(max_length=50, null=True, blank=False)
    
    def __str__(self):
        return self.company_name