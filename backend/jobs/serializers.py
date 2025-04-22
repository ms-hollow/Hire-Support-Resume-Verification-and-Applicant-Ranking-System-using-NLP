from rest_framework import serializers
from .models import JobHiring, ScoringCriteria, JobApplication, JobApplicationDocument, Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'message', 'created_at', 'is_read'] 

class ScoringCriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScoringCriteria
        fields = [
            'criteria_name',
            'weight_percentage',
            'preference', 
        ]

class JobHiringSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.company_name', read_only=True)
    scoring_criteria = ScoringCriteriaSerializer(many=True, required=False)

    class Meta:
        model = JobHiring
        fields = '__all__'

    def validate(self, data):
        # Default to 'open' if status isn't provided
        status = data.get('status', 'open')

        # Only check required fields if not a draft
        if status != 'draft':
            required_fields = [
                'job_title', 'job_industry', 'specialization', 'job_description',
                'region', 'province', 'city', 'work_setup', 'employment_type',
                'qualifications', 'schedule', 'experience_level',
                'num_positions', 'salary_frequency'
            ]
            missing = [field for field in required_fields if not data.get(field)]
            if missing:
                raise serializers.ValidationError(
                    f"Missing required fields for a published job: {', '.join(missing)}"
                )
        return data

    def create(self, validated_data):
        scoring_data = validated_data.pop('scoring_criteria', [])
        job_hiring = JobHiring.objects.create(**validated_data)
        for item in scoring_data:
            ScoringCriteria.objects.create(job_hiring=job_hiring, **item)
        return job_hiring

    def update(self, instance, validated_data):
        scoring_data = validated_data.pop('scoring_criteria', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        instance.scoring_criteria.all().delete()
        for item in scoring_data:
            ScoringCriteria.objects.create(job_hiring=instance, **item)

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
            # 'scores',
            # 'verification_result',
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
    
    def validate(self, attrs):
        if attrs.get('application_status') == 'completed':
            required_fields = ['job_hiring', 'applicant', 'email', 'documents']
            missing_fields = [field for field in required_fields if not attrs.get(field)]
            if missing_fields:
                raise serializers.ValidationError(
                    {field: f"{field} is required for a completed application." for field in missing_fields}
                )
        return attrs