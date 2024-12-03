from rest_framework import serializers
from .models import JobHiring, ScoringCriteria, JobApplication, JobApplicationDocument

class ScoringCriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScoringCriteria
        fields = [
            'criteria_name',
            'weight_percentage',
            'preference', 
        ]

class JobHiringSerializer(serializers.ModelSerializer):
    
    company_name = serializers.CharField(source='company.company_name', read_only=True) # kunin ang company name
    scoring_criteria = ScoringCriteriaSerializer(many=True, required=False)

    class Meta:
        model = JobHiring
        fields = [
            'job_hiring_id',
            'company',       
            'company_name', # save applicant name
            'job_title',
            'job_industry',
            'job_description',
            'work_location',
            'work_setup',
            'employment_type',
            'qualifications',
            'schedule',
            'salary',
            'frequency',
            'benefits',
            'experience_level',
            'num_positions',
            'verification_option',
            'creation_date',
            'required_documents',
            'application_deadline',
            'status',
            'additional_notes',
            'scoring_criteria'
        ]

    def create(self, validated_data):
        scoring_criteria_scores = validated_data.pop('scoring_criteria', [])
        job_hiring = JobHiring.objects.create(**validated_data) # Create JobHiring instance

        for criteria_data in scoring_criteria_scores:
            ScoringCriteria.objects.create(job_hiring=job_hiring, **criteria_data)
        
        return job_hiring
    
    def update(self, instance, validated_data):
        scoring_criteria_scores = validated_data.pop('scoring_criteria', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        instance.scoring_criteria.all().delete()

        for criteria_data in scoring_criteria_scores:
            ScoringCriteria.objects.create(job_hiring=instance, **criteria_data)

        return instance

class JobApplicationDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplicationDocument
        fields = ['document_type', 'document_file']

class JobApplicationSerializer(serializers.ModelSerializer):

    documents = JobApplicationDocumentSerializer(many=True, required=False)
    applicant_name = serializers.CharField(source='applicant.applicant_name', read_only=True) # kunin ang applicant name

    class Meta:
        model = JobApplication
        fields = [
            'job_application_id',
            'job_hiring',
            'applicant',
            'applicant_name', # save applicant name
            'email',
            'application_date',
            'application_status',
            'scores',
            'verification_result',
            'documents',  # Include nested documents
        ]
 
    def create(self, validated_data):
        documents_list = validated_data.pop('documents', [])
        job_application = JobApplication.objects.create(**validated_data)

        # Save multiple documents
        for document_data in documents_list:
            JobApplicationDocument.objects.create(job_application=job_application, **document_data)

        return job_application
    
    def update(self, instance, validated_data):
        documents_data = validated_data.pop('documents', []) 

        # Update fields on the Job Application 
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update related documents
        if documents_data:
            instance.documents.all().delete()  # Optional: delete previous documents
            for document_data in documents_data: # Add new documents
                JobApplicationDocument.objects.create(job_application=instance, **document_data)

        return instance