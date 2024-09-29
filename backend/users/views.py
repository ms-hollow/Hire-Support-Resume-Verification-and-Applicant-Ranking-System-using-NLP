from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from .models import User
from .form import RegisterUserForm
from applicant.models import Applicant
from company.models import Company

# Register Applicant
def register_applicant(request):
    if request.method == 'POST':
        form = RegisterUserForm(request.POST)
        if form.is_valid():
            var = form.save(commit=False)
            var.is_applicant = True
            var.username = var.email
            var.save()
            Applicant.objects.create(user=var)
            messages.info(request, 'Your account has been created.')
            return redirect('login')
        else:
            messages.warning(request, 'Something went wrong.')
            return redirect('register_applicant')
    else:
        form = RegisterUserForm()
        context = {'form': form}
        return render(request, 'users/register_applicant.html', context)

# Register Company
def register_company(request):
    if request.method == 'POST':
        form = RegisterUserForm(request.POST)
        if form.is_valid():
            var = form.save(commit=False)
            var.is_company = True
            var.username = var.email
            var.save()
            Company.objects.create(user=var)
            messages.info(request, 'Your account has been created.')
            return redirect('login')
        else:
            messages.warning(request, 'Something went wrong.')
            return redirect('register_company')
    else:
        form = RegisterUserForm()
        context = {'form': form}
        return render(request, 'users/register_company.html', context)
    
# Log In user
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
        return render(request, 'user/login.html')
    
def logout_user(request):
    logout(request)
    messages.info(request, 'Your session has ended.')
    return redirect('login')