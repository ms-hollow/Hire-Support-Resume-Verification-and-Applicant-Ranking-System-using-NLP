from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from .models import User
from .form import RegisterUserForm
from applicant.form import ApplicantProfileForm
from applicant.models import Applicant
from company.models import Company
from company.form import CompanyProfileForm

# Create your views here.

def register_applicant(request):
    if request.method == 'POST':
        if 'step1' in request.POST:  # Handling step 1 (registration)
            form = RegisterUserForm(request.POST)
            if form.is_valid():
                user = form.save(commit=False)
                user.is_applicant = True
                user.username = user.email
                user.save()
                Applicant.objects.create(user=user)  # Create the Applicant profile
                messages.info(request, 'Your account has been created. Please complete your profile.')
                return redirect('applicant_profile', user_id=user.id)  # Redirect to the profile completion page
        else:
            messages.warning(request, 'Something went wrong with your submission.')

    else:
        form = RegisterUserForm()

    return render(request, 'users/register_applicant.html', {'form': form})

def applicant_profile(request, user_id):
    user = User.objects.get(id=user_id)
    if request.method == 'POST':
        profile_form = ApplicantProfileForm(request.POST, instance=user.applicant)  # Link to the Applicant profile
        if profile_form.is_valid():
            profile_form.save()  # Save the profile data
            messages.info(request, 'Your profile has been completed.')
            return redirect('login')  # Redirect to the login page
    else:
        profile_form = ApplicantProfileForm()

    return render(request, 'users/applicant_profile.html', {
        'profile_form': profile_form,
        'user': user
    })

def register_company(request):
    if request.method == 'POST':
        print("Received POST request")
        form = RegisterUserForm(request.POST)
        
        if form.is_valid():
            print("Form is valid")
            user = form.save(commit=False)
            user.is_company = True
            user.username = user.email 
            user.save()  # Save the user instance
            Company.objects.create(user=user)  # Create an Applicant profile
            messages.info(request, 'Your account has been created. Please complete your profile.')
            return redirect('company_profile', user_id=user.id)  # Redirect to the profile completion page
        else:
            print("Form errors:", form.errors)  # Output errors for debugging
            messages.warning(request, 'Something went wrong: ' + str(form.errors))
            return render(request, 'users/register_company.html', {'form': form})  # Render the form again


    else:
        form = RegisterUserForm()
        
    return render(request, 'users/register_company.html', {'form': form})

def company_profile(request, user_id):
    user = User.objects.get(id=user_id)
    if request.method == 'POST':
        profile_form = CompanyProfileForm(request.POST, instance=user.company)  
        if profile_form.is_valid():
            profile_form.save()  # Save the profile data
            messages.info(request, 'Your profile has been completed.')
            return redirect('login')  # Redirect to the login page
    else:
        profile_form = CompanyProfileForm()

    return render(request, 'users/company_profile.html', {
        'profile_form': profile_form,
        'user': user
    })

def login_user(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        user = authenticate(request, username=email, password=password)
        if user is not None and user.is_active:
            login(request, user)
            return redirect('dashboard')
        else:
            messages.warning(request, 'Something went wrong')
            return redirect('login')
    else: 
        return render(request, 'users/login.html')
    
def logout_user(request):
    logout(request)
    messages.info(request, 'Your session has ended')
    return redirect('login')