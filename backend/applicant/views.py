from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Applicant
from .form import ApplicantProfileForm
from users.models import User

def complete_applicant_profile(request):
    applicant = Applicant.objects.get(user=request.user)

    if request.method == 'POST':
        form = ApplicantProfileForm(request.POST, instance=applicant)

        if form.is_valid():
            contact_number = form.cleaned_data.get('contact_number')
            valid = True

            if not contact_number.startswith('9'):
                messages.warning(request, "Please enter a valid Philippine contact number")
                valid = False

            if len(contact_number) < 9:
                messages.warning(request, "Contact number must contain at least 9 digits.")
                valid = False
            
            if not contact_number.isdigit():
                messages.warning(request, "Please enter a valid Philippine contact number")
                valid = False

            if valid:
                # Concatenate the country code
                contact_number = '+63 ' + contact_number

                var = form.save(commit=False)
                var.contact_number = contact_number
                user = User.objects.get(id=request.user.id)
                user.has_applicant_acc = True
                var.save()
                user.save()
                messages.info(request, 'Your account has been created.')
                return redirect('dashboard')
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.warning(request, f"{field}: {error}" )
    else:
        form = ApplicantProfileForm(instance=applicant)

    context = {'form' : form}
    return render(request, 'applicant/complete_applicant_profile.html', context)

def view_applicant_profile(request, pk):
    applicant = Applicant.objects.get(pk=pk)
    context =  {'applicant':applicant}
    return render(request, 'applicant/view_applicant_profile.html', context)

#TODO edit applicant profile

