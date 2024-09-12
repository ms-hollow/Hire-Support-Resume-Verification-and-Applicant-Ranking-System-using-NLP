from django.db import models
from django.template.defaultFilters import slugify
from cloudinary.models import CloudinaryField

# Create your models here.

# Sample model 
class JobHiring(models.Model):
    title=models.CharField(max_length=200)
    description=models.TextField()
    slug=models.models.SlugField(max_length=225)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    logo=CloudinaryField('Image', overwrite=True, format="jpg")

    class Meta:
        ordering=('-created_at',)

    def __str__(self):
        return self.title
    
    def save(self,*args, **kwargs):
        to_assign=slugify(self.title)

        if JobHiring.objects.filter(slug=to_assign).exists():
            to_assign=to_assign+str(JobHiring.objects.all().count())

        self.slug=to_assign

        super().save(**args, **kwargs)