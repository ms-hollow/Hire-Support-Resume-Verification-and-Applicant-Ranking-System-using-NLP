from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    email = models.EmailField(unique=True)
    is_company = models.BooleanField(default=False) # kung company ba si user
    is_applicant = models.BooleanField(default=False) # kung applicant ba si user

    has_applicant_acc = models.BooleanField(default=False)
    has_company_acc = models.BooleanField(default=False)

    google_id = models.CharField(max_length=255, unique=True, blank=True, null=True) 