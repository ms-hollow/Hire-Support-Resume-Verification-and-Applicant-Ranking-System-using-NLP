from django.shortcuts import render, redirect
from django.contrib import messages
from jobs.form import JobHiringForm, ScoringCriteriaForm
from jobs.models import ScoringCriteria
from django.forms import modelformset_factory

ScoringCriteriaFormSet = modelformset_factory(ScoringCriteria, form=ScoringCriteriaForm)

def create_job_hiring(request):
    # Get the company associated with the logged-in user
    company = request.user.company  # Adjust this based on how you associate users with companies
    company_name = company.company_name

    if request.method == 'POST':
        job_form = JobHiringForm(request.POST, company=company)  # Pass the company to the form
        scoring_formset = ScoringCriteriaFormSet(request.POST)

        if job_form.is_valid() and scoring_formset.is_valid():
            job_hiring = job_form.save()  # Save job hiring, company is set in form's save method
            for scoring_form in scoring_formset:
                scoring_criteria = scoring_form.save(commit=False)
                scoring_criteria.job_hiring = job_hiring
                scoring_criteria.save()
            return redirect('dashboard')  # Change to your success URL
        else:
            # If the forms are not valid, print the errors for debugging
            print(job_form.errors)  # Print job form errors
            print(scoring_formset.errors)  # Print scoring formset errors

    else:
        job_form = JobHiringForm(company=company)  # Pass the company when creating the form
        scoring_formset = ScoringCriteriaFormSet(queryset=ScoringCriteria.objects.none())

    return render(request, 'jobs/create_job_hiring.html', {
        'job_form': job_form,
        'scoring_formset': scoring_formset,
        'company_name': company_name, 
    })
