from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from .models import JobApplication, Notification, Company
from django.contrib.auth import get_user_model

User = get_user_model()


@receiver(post_save, sender=JobApplication)
@receiver(post_delete, sender=JobApplication)
def update_num_applications(sender, instance, **kwargs):
    job_hiring = instance.job_hiring 
    job_hiring.update_num_applications()


@receiver(post_save, sender=JobApplication)
def create_application_notification(sender, instance, created, **kwargs):
    job_hiring = instance.job_hiring
    applicant = instance.applicant
    company_user = job_hiring.company.user
    company = Company.objects.get(id=job_hiring.company_id)

    if created:
        applicant_full_name = f"{applicant.first_name} {applicant.middle_name} {applicant.last_name}"

        # Notify applicant (only if not already notified)
        if not Notification.objects.filter(
            recipient=applicant.user,
            message=f"You have successfully applied for '{job_hiring.job_title}' in {company.company_name}."
        ).exists():
            Notification.objects.create(
                recipient=applicant.user,
                message=f"You have successfully applied for '{job_hiring.job_title}' in {company.company_name}."
            )

        # Notify company (only if not already notified)
        if not Notification.objects.filter(
            recipient=company_user,
            message=f"New application received for '{job_hiring.job_title}' from {applicant_full_name}."
        ).exists():
            Notification.objects.create(
                recipient=company_user,
                message=f"New application received for '{job_hiring.job_title}' from {applicant_full_name}."
            )

        # Update count + check thresholds
        job_hiring.update_num_applications()
        job_hiring.check_applicant_count()


@receiver(pre_save, sender=JobApplication)
def notify_application_status_change(sender, instance, **kwargs):
    if not instance.pk:
        return  
    
    old_instance = JobApplication.objects.get(pk=instance.pk)
    if old_instance.application_status != instance.application_status:
        Notification.objects.create(
            recipient=instance.applicant.user,
            message=f"Your application for '{instance.job_hiring.job_title}' was {instance.application_status.lower()}."
        )
