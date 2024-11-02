from django.shortcuts import render, redirect
from jobs.form import JobHiringForm, ScoringCriteriaForm
from jobs.models import ScoringCriteria
from django.forms import modelformset_factory

ScoringCriteriaFormSet = modelformset_factory(ScoringCriteria, form=ScoringCriteriaForm, extra=3)

def create_job_hiring(request):
    # Get the company associated with the logged-in user
    company = request.user.company  # Adjust this based on how you associate users with companies

    if request.method == 'POST':
        job_form = JobHiringForm(request.POST, company=company)  # Pass the company to the form
        scoring_formset = ScoringCriteriaFormSet(request.POST)

        if job_form.is_valid() and scoring_formset.is_valid():
            job_hiring = job_form.save()  # Save job hiring, company is set in form's save method
            for scoring_form in scoring_formset:
                scoring_criteria = scoring_form.save(commit=False)
                scoring_criteria.job_hiring = job_hiring
                scoring_criteria.save()
            return redirect('/create_job_hiring')  # Change to your success URL

    else:
        job_form = JobHiringForm(company=company)  # Pass the company when creating the form
        scoring_formset = ScoringCriteriaFormSet(queryset=ScoringCriteria.objects.none())

    return render(request, 'jobs/create_job_hiring.html', {
        'job_form': job_form,
        'scoring_formset': scoring_formset,
    })