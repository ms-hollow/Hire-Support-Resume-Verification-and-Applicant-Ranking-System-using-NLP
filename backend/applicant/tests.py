from django.test import TestCase
from .models import Applicant, User

class ApplicantModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser@example.com',
            email='testuser@example.com',
            password='testpassword'
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

    def test_applicant_fields(self):
        print('Testing APPLICANT fields:')
        print(f'First Name: {self.applicant.first_name}')
        print(f'Last Name: {self.applicant.last_name}')
        print(f'Sex: {self.applicant.sex}')
        print(f'DOB: {self.applicant.date_of_birth}')
        print(f'Age: {self.applicant.age}')
        print(f'Contact No.: {self.applicant.contact_number}')
        print(f'Contact Address.: {self.applicant.present_address}')
        print(f'LinkedIn No.: {self.applicant.linkedin_profile}')
        
       
