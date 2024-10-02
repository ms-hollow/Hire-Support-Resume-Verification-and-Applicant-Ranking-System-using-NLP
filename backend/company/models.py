from django.db import models
from users.models import User

#! Note: Kapag may binago sa model, lagi i-migrate 
#? Command: 
#? python manage.py makemigrations
#? python manage.py migrate

class Company(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=50)
    industry = models.CharField(max_length=50)
    number_of_employees = models.PositiveIntegerField()
    hr_name = models.CharField(max_length=50)
    contact_number = models.PositiveIntegerField()
    company_address = models.TextField()
    
    def __str__(self):
        return self.company_name