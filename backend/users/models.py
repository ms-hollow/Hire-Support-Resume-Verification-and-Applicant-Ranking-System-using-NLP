from django.db import models
from django.contrib.auth.models import AbstractUser

#! Note: Kapag may binago sa model, lagi i-migrate 
#? Command: 
#? python manage.py makemigrations
#? python manage.py migrate

class User(AbstractUser):
    email = models.EmailField(unique=True)
    is_company = models.BooleanField(default=False) # kung company ba si user
    is_applicant = models.BooleanField(default=False) # kung applicant ba si user

