from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Company
from .form import CompanyProfileForm
from users.models import User

# Create your views here.
def complete_company_profile(request):
    company = Company.objects.get(user=request.user)
    
    if request.method == 'POST':
        form = CompanyProfileForm(request.POST, instance=company)
        
        # Check if the form is valid
        if form.is_valid():
            contact_number = form.cleaned_data.get('contact_number')
            valid = True  # A flag to track if all validations pass
            
            # Check if the contact number starts with '9'
            if not contact_number.startswith('9'):
                messages.warning(request, "Please enter a valid Philippine contact number")
                valid = False
            
            # Check if the contact number has at least 9 digits
            if len(contact_number) < 9:
                messages.warning(request, "Contact number must contain at least 9 digits.")
                valid = False
            
            if valid:
                # Concatenate the country code
                contact_number = '+63 ' + contact_number
                
                # Save the form and user data
                var = form.save(commit=False)
                var.contact_number = contact_number  # Set the modified contact number
                user = User.objects.get(id=request.user.id)
                user.has_company_acc = True
                var.save()
                user.save()
                messages.info(request, 'Your account has been created.')
                return redirect('dashboard')
        
        else:
            # Handle form errors and display them
            for field, errors in form.errors.items():
                for error in errors:
                    messages.warning(request, f"{field}: {error}")
    else:
        form = CompanyProfileForm(instance=company)
    
    # Return the form for both POST and GET requests
    context = {'form': form}
    return render(request, 'company/complete_company_profile.html', context)


# view company profile
def view_company_profile(request, pk):
    company = Company.objects.get(pk=pk)
    context = {'company':company}
    return render(request, 'company/view_company_profile.html', context)

#TODO edit company profile