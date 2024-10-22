from django.shortcuts import render, redirect
from jobs.form import JobHiringForm, ScoringCriteriaForm
from jobs.models import ScoringCriteria
from django.forms import modelformset_factory

ScoringCriteriaFormSet = modelformset_factory(ScoringCriteria, form=ScoringCriteriaForm, extra=3)

def create_job_hiring(request):
    if request.method == 'POST':
        job_form = JobHiringForm(request.POST)
        scoring_formset = ScoringCriteriaFormSet(request.POST)

        if job_form.is_valid() and scoring_formset.is_valid():
            job_hiring = job_form.save()
            for scoring_form in scoring_formset:
                scoring_criteria = scoring_form.save(commit=False)
                scoring_criteria.job_hiring = job_hiring
                scoring_criteria.save()
            return redirect('/create_job_hiring')  # Change to your success URL

    else:
        job_form = JobHiringForm()
        scoring_formset = ScoringCriteriaFormSet(queryset=ScoringCriteria.objects.none())

    return render(request, 'jobs/create_job_hiring.html', {  # Ensure correct path
        'job_form': job_form,
        'scoring_formset': scoring_formset,
    })
