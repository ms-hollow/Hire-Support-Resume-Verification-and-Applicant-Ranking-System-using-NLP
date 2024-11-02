from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from .models import User
from .form import RegisterUserForm
from applicant.models import Applicant
from company.models import Company

# Create your views here.

def register_applicant(request):
    if request.method == 'POST':
        if 'step1' in request.POST:  # Handling step 1 (registration)
            form = RegisterUserForm(request.POST)
            if form.is_valid():
                user = form.save(commit=False)
                user.is_applicant = True
                user.username = user.email  # Set the email as the username
                user.save()
                Applicant.objects.create(user=user)  # Create an empty Applicant profile
                messages.info(request, 'Your account has been created. Please complete your profile.')
                # Automatically log the user in after registration
                login(request, user)
                
                # Redirect to the profile completion page
                return redirect('complete-applicant-profile')
        else:
            messages.warning(request, 'Something went wrong with your submission.')

    else:
        form = RegisterUserForm()

    return render(request, 'users/register_applicant.html', {'form': form})

def register_company(request):
    if request.method == 'POST':
        form = RegisterUserForm(request.POST)
        
        if form.is_valid():
            # Create the user but don't save it to the database yet
            user = form.save(commit=False)
            user.is_company = True
            user.username = user.email  # Set the email as the username
            user.save()  # Save the user to the database
            
            # Create the company profile associated with this user
            Company.objects.create(user=user)
            messages.info(request, 'Your account has been created. Please complete your profile.')
            
            # Automatically log the user in after registration
            login(request, user)
            
            # Redirect to the profile completion page
            return redirect('complete-company-profile')
        
        else:
            # Display form errors if there are any
            messages.warning(request, 'Something went wrong: ' + str(form.errors))
            return render(request, 'users/register_company.html', {'form': form})

    else:
        form = RegisterUserForm()
        
    return render(request, 'users/register_company.html', {'form': form})


def login_user(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        # Check if the user exists in the Applicant database
        try:
            applicant = Applicant.objects.get(user__email=email)
            user = applicant.user  # Get the related User object
        except Applicant.DoesNotExist:
            # Check if the user exists in the Company database
            try:
                company = Company.objects.get(user__email=email)
                user = company.user  # Get the related User object
            except Company.DoesNotExist:
                messages.warning(request, "Username not found. Please ensure you've registered as either an Applicant or a Company.")
                return redirect('login')

        # If the user exists, authenticate
        user = authenticate(request, username=email, password=password)

        if user is not None and user.is_active:
            login(request, user)
            return redirect('dashboard')
        else:
            messages.warning(request, 'The password you entered is incorrect. Please try again.')
            return redirect('login')
    else: 
        return render(request, 'users/login.html')

def logout_user(request):
    logout(request)
    messages.info(request, 'Your session has ended')
    return redirect('login')