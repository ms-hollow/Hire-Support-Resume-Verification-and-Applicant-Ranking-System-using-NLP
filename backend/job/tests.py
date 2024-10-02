from django.test import TestCase
from applicant.models import Applicant
from company.models import Company
from .models import JobHiring, ScoringCriteria, JobApplication
from datetime import date
from users.models import User

class JobHiringTestCase(TestCase):
    def setUp(self):
        # Create a company instance
        self.user = User.objects.create_user(
            username='testuser@example.com',
            email='testuser@example.com',
            password='testpassword'
        )
        self.company = Company.objects.create(
            user=self.user,
            company_name='ABC Corporation',
            industry = 'Tech',
            number_of_employees=60,
            hr_name='John Smith',
            contact_number='0987641332',
            company_address='123 Test Company St',
        )

        # Create a JobHiring instance
        self.job_hiring = JobHiring.objects.create(
            company=self.company,
            job_industry="Technology",
            job_title="Software Engineer",
            work_location="New York",
            work_arrangement="Remote",
            employment_type="Full-time",
            num_positions=3,
            job_description="Develop and maintain software applications.",
            qualifications="Bachelor's degree in Computer Science or related field.",
            salary=85000.00,
            benefits="Health insurance, 401k",
            verification_option="Standard",
            application_deadline=date(2024, 12, 31),
            status="Active"
        )

        # Create some ScoringCriteria for the job hiring
        ScoringCriteria.objects.create(
            job_hiring=self.job_hiring,
            criteria_name="Work Experience",
            weight_percentage=50.00,
            preference="5+ years in relevant field"
        )
        ScoringCriteria.objects.create(
            job_hiring=self.job_hiring,
            criteria_name="Education",
            weight_percentage=30.00,
            preference="Bachelor's degree"
        )
        ScoringCriteria.objects.create(
            job_hiring=self.job_hiring,
            criteria_name="Skills",
            weight_percentage=20.00,
            preference="Python, Django"
        )

    def test_job_hiring_creation(self):
        """Test if JobHiring is created correctly"""
        self.assertEqual(self.job_hiring.job_title, "Software Engineer")
        self.assertEqual(self.job_hiring.num_positions, 3)
        self.assertEqual(self.job_hiring.company.company_name, "ABC Corporation")

    def test_scoring_criteria_creation(self):
        """Test if ScoringCriteria is associated with JobHiring"""
        criteria = self.job_hiring.scoring_criteria.all()
        self.assertEqual(criteria.count(), 3)
        self.assertEqual(criteria[0].criteria_name, "Work Experience")
        self.assertEqual(criteria[1].weight_percentage, 30.00)

    def test_get_scoring_criteria(self):
        """Test the get_scoring_criteria method"""
        criteria_array = self.job_hiring.get_scoring_criteria()
        self.assertEqual(len(criteria_array), 3)
        self.assertEqual(criteria_array[0], ["Work Experience", 50.00, "5+ years in relevant field"])
        self.assertEqual(criteria_array[1], ["Education", 30.00, "Bachelor's degree"])

class JobApplicationTestCase(TestCase):
    def setUp(self):
        # Create an Applicant instance
        self.user = User.objects.create_user(
            username='testapplicant@example.com',
            email='testapplicant@example.com',
            password='testapplicant'
        )
        self.applicant = Applicant.objects.create(
            user=self.user,
            first_name='John',
            last_name='Doe',
            sex='Male',
            date_of_birth='1990-01-01',
            age=34,
            contact_number='1234567890',
            present_address='123 Test St',
            linkedin_profile='https://linkedin.com/in/testuser'
        )

        # Create a company instance
        self.user = User.objects.create_user(
            username='testuser@example.com',
            email='testuser@example.com',
            password='testpassword'
        )
        self.company = Company.objects.create(
            user=self.user,
            company_name='ABC Corporation',
            industry = 'Tech',
            number_of_employees=60,
            hr_name='John Smith',
            contact_number='0987641332',
            company_address='123 Test Company St',
        )

        # Create a JobHiring instance
        self.job_hiring = JobHiring.objects.create(
            company=self.company,
            job_industry="Technology",
            job_title="Software Engineer",
            work_location="New York",
            work_arrangement="Remote",
            employment_type="Full-time",
            num_positions=3,
            job_description="Develop and maintain software applications.",
            qualifications="Bachelor's degree in Computer Science or related field.",
            salary=85000.00,
            benefits="Health insurance, 401k",
            verification_option="Standard",
            application_deadline=date(2024, 12, 31),
            status="Active"
        )


        # Associate saved job with applicant
        self.applicant.saved_jobs.add(self.job_hiring)

        # Fetch all saved jobs
        saved_jobs = self.applicant.saved_jobs.all()

        # Print saved jobs in a readable format
        print("Saved Jobs:")
        for job in saved_jobs:
            # Use job.job_title to reference the correct field for the job title
            print(f"Job ID: {job.pk}, Job Title: {job.job_title}")  # Use job.pk or job.id for the ID


        # Print JobHiring details
        print("Job Hiring Details:")
        print(f"Company: {self.job_hiring.company.company_name}")
        print(f"Industry: {self.job_hiring.job_industry}")
        print(f"Job Title: {self.job_hiring.job_title}")
        print(f"Location: {self.job_hiring.work_location}")
        print(f"Arrangement: {self.job_hiring.work_arrangement}")
        print(f"Type: {self.job_hiring.employment_type}")
        print(f"Positions Available: {self.job_hiring.num_positions}")
        print(f"Description: {self.job_hiring.job_description}")
        print(f"Qualifications: {self.job_hiring.qualifications}")
        print(f"Salary: {self.job_hiring.salary}")
        print(f"Benefits: {self.job_hiring.benefits}")
        print(f"Verification Option: {self.job_hiring.verification_option}")
        print(f"Application Deadline: {self.job_hiring.application_deadline}")
        print(f"Status: {self.job_hiring.status}")

        # Create a JobApplication instance
        self.job_application = JobApplication.objects.create(
            applicant=self.applicant,
            job_hiring=self.job_hiring,  
            resume="resumes/john_doe.pdf",
            application_date=date(2024, 10, 1),
            status="Pending",
            interview_date=date(2024, 10, 10),
            interview_time="14:00:00",
            interview_location="Online",
            scores="Overall: 85, Experience: 90, Education: 80, Skills: 80",
            verification_result="All documents verified",
        )


        # Print JobApplication details
        print("Job Application Details:")
        print(f"Applicant: {self.job_application.applicant.first_name} {self.job_application.applicant.last_name}")
        print(f"Job Hiring: {self.job_application.job_hiring.job_title}")
        print(f"Resume: {self.job_application.resume}")
        print(f"Application Date: {self.job_application.application_date}")
        print(f"Status: {self.job_application.status}")
        print(f"Interview Date: {self.job_application.interview_date}")
        print(f"Interview Time: {self.job_application.interview_time}")
        print(f"Interview Location: {self.job_application.interview_location}")
        print(f"Scores: {self.job_application.scores}")
        print(f"Verification Result: {self.job_application.verification_result}")

    def test_job_application_creation(self):
        """Test if JobApplication is created correctly"""
        self.assertEqual(self.job_application.applicant.first_name, "John")
        self.assertEqual(self.job_application.job_hiring.job_title, "Software Engineer")
        self.assertEqual(self.job_application.scores, "Overall: 85, Experience: 90, Education: 80, Skills: 80")

    def test_job_application_status(self):
        """Test if the application status is correctly set to Pending by default"""
        self.assertEqual(self.job_application.status, "Pending")

    def test_saved_jobs_association(self):
        """Test if saved jobs are correctly associated with the applicant"""
        self.assertIn(self.job_hiring, self.applicant.saved_jobs.all())