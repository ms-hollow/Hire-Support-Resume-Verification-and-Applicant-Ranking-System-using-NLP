from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import JobApplication, JobHiring

@receiver(post_save, sender=JobApplication)
@receiver(post_delete, sender=JobApplication)
def update_num_applications(sender, instance, **kwargs):
    job_hiring = instance.job_hiring 
    job_hiring.update_num_applications() 
