from django.contrib import admin
from .models import JobHiring, ScoringCriteria, JobApplication

admin.site.register(JobHiring)
admin.site.register(ScoringCriteria)
admin.site.register(JobApplication)