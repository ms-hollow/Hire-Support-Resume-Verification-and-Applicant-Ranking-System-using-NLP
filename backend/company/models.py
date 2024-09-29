from django.db import models
from users.models import User


class Company(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=50)
    industry = models.CharField(max_length=50)
    number_of_employees = models.IntegerField()
    hr_name = models.CharField(max_length=50)
    contact_number = models.CharField(max_length=15)
    company_address = models.TextField()
    
    def __str__(self):
        return self.company_name