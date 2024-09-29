from django.test import TestCase
from .models import Company, User

class CompanyModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser@example.com',
            email='testuser@example.com',
            password='testpassword'
        )
        self.company = Company.objects.create(
            user=self.user,
            company_name='Some Company',
            industry = 'Tech',
            number_of_employees=60,
            hr_name='John Smith',
            contact_number='0987641332',
            company_address='123 Test Company St',
        )

    def test_company_fields(self):
        print('Testing applicant fields:')
        print(f'Company Name: {self.company.company_name}')
        print(f'Industry: {self.company.industry}')
        print(f'No. Employees: {self.company.number_of_employees}')
        print(f'HR Name: {self.company.hr_name}')
        print(f'Contact No: {self.company.contact_number}')
        print(f'Address: {self.company.company_address}')
        print(self.company)
       
