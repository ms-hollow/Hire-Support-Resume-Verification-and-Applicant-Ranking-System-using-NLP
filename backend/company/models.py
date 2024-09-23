from django.db import models

# Create your models here.
# TODO: Create a model for Company

class Company(models.Model):
    company_name = models.CharField(max_length=50)
    industry = models.CharField(max_length=50)
    number_of_employees = models.IntegerField()
    hr_name = models.CharField(max_length=50)
    company_email = models.EmailField(unique=True)
    contact_number = models.CharField(max_length=15)
    company_address = models.TextField()
    password = models.CharField(max_length=20)
    
    def __str__(self):
        return self.company_name