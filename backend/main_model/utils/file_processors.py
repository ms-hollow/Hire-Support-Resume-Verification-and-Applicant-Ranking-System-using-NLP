import json
import os
from django.conf import settings
from django.core.files.storage import default_storage

def extract_hiring_settings(job_hiring):
    """Extract hiring settings from a JobHiring model instance as a dictionary"""
    
    # Parse weight_of_criteria if it's a JSON string
    weight_of_criteria = job_hiring.weight_of_criteria or {}
    if isinstance(weight_of_criteria, str):
        try:
            weight_of_criteria = json.loads(weight_of_criteria)
        except json.JSONDecodeError:
            weight_of_criteria = {}
    
    # Get scoring criteria from related model
    scoring_criteria = []
    for criteria in job_hiring.scoring_criteria.all():
        criteria_data = {
            'criteria_name': criteria.criteria_name,
            'weight_percentage': criteria.weight_percentage,
            'preference': criteria.preference
        }
        scoring_criteria.append(criteria_data)
    
    # Initialize fields with default values
    directly_relevant_job_titles = []
    highly_relevant_job_titles = []
    moderately_relevant_job_titles = []
    primary_skills = []
    secondary_skills = []
    additional_skills = []
    first_choice_field_study = ""
    second_choice_field_study = ""
    third_choice_field_study = ""
    school_preference = []
    honors = False
    multiple_degrees = False
    certificate_institution_preference = []
    
    # Extract relevant information from scoring_criteria
    for criteria in scoring_criteria:
        criteria_name = criteria.get('criteria_name', '').lower()
        preference = criteria.get('preference', {})
        
        if criteria_name == 'work experience':
            # Extract job titles based on the structure in your provided sample
            directly_relevant_job_titles = preference.get('directlyRelevant', [])
            highly_relevant_job_titles = preference.get('highlyRelevant', [])
            moderately_relevant_job_titles = preference.get('moderatelyRelevant', [])
        
        elif criteria_name == 'skills':
            # Extract skills based on the structure in your provided sample
            primary_skills = preference.get('primarySkills', [])
            secondary_skills = preference.get('secondarySkills', [])
            additional_skills = preference.get('additionalSkills', [])
        
        elif criteria_name == 'education':
            # Extract education preferences
            first_choice_field_study = preference.get('firstChoice', '')
            second_choice_field_study = preference.get('secondChoice', '')
            third_choice_field_study = preference.get('thirdChoice', '')
        
        elif criteria_name == 'schools':
            # Extract school preferences
            school_preference = preference.get('schoolPreference', [])
            
        elif criteria_name == 'additional points':
            # Extract additional points preferences
            honors = preference.get('honor', '') == '1'
            multiple_degrees = preference.get('multipleDegrees', '') == '1'
        
        elif criteria_name == 'certifications':
            # Extract certification preferences
            certificate_institution_preference = preference.get('preferred', [])
    
    # Calculate weights from scoring criteria or use defaults
    experience_weight = 0.25
    skills_weight = 0.25
    education_weight = 0.25
    certifications_weight = 0.25
    
    # Try to extract weight percentages from scoring criteria
    for criteria in scoring_criteria:
        criteria_name = criteria.get('criteria_name', '').lower()
        weight_str = str(criteria.get('weight_percentage', '0'))
        
        try:
            weight = float(weight_str) / 100  # Convert percentage to decimal
        except (ValueError, TypeError):
            weight = 0
            
        if criteria_name == 'work experience':
            experience_weight = weight
        elif criteria_name == 'skills':
            skills_weight = weight
        elif criteria_name == 'education':
            education_weight = weight
        elif criteria_name == 'certifications':
            certifications_weight = weight
    
    # Convert lists to comma-separated strings for hire_support.py
    directly_relevant_job_titles_str = ", ".join(directly_relevant_job_titles)
    highly_relevant_job_titles_str = ", ".join(highly_relevant_job_titles)
    moderately_relevant_job_titles_str = ", ".join(moderately_relevant_job_titles)
    primary_skills_str = ", ".join(primary_skills)
    secondary_skills_str = ", ".join(secondary_skills)
    additional_skills_str = ", ".join(additional_skills)
    school_preference_str = ", ".join(school_preference)
    certificate_institution_preference_str = ", ".join(certificate_institution_preference)
    
    # Create the hiring settings in the format expected by hire_support.py
    hiring_settings = {
        "job_title": job_hiring.job_title,
        "specialization": ", ".join(job_hiring.specialization) if isinstance(job_hiring.specialization, list) else str(job_hiring.specialization),
        
        # Weights for different criteria
        "experience_weight": experience_weight,
        "skills_weight": skills_weight,
        "education_weight": education_weight,
        "certifications_weight": certifications_weight,
        
        # Experience-related fields
        "directly_relevant_job_titles": directly_relevant_job_titles_str,
        "highly_relevant_job_titles": highly_relevant_job_titles_str,
        "moderately_relevant_job_titles": moderately_relevant_job_titles_str,
        
        # Skills-related fields
        "primary_skills": primary_skills_str,
        "secondary_skills": secondary_skills_str,
        "additional_skills": additional_skills_str,
        
        # Education-related fields
        "first_choice_field_study": first_choice_field_study,
        "second_choice_field_study": second_choice_field_study,
        "third_choice_field_study": third_choice_field_study,
        "school_preference": school_preference_str,
        "honors": honors,
        "multiple_degrees": multiple_degrees,
        
        # Certification-related fields
        "certificate_institution_preference": certificate_institution_preference_str,
        
        # Parse verification option
        "verification_option": parse_verification_option(job_hiring.verification_option)
    }

    return hiring_settings  # Return dictionary directly instead of saving to file
    
    ''''
    # Create job hiring directory
    from main_model.utils.file_structure import get_job_hiring_dir
    job_hiring_dir = get_job_hiring_dir(job_hiring.job_hiring_id)
    
    # Save the JSON file in the job hiring directory
    file_path = os.path.join(job_hiring_dir, 'hiring_settings.json')
    
    # Save the JSON file
    with open(file_path, 'w') as f:
        json.dump(hiring_settings, f, indent=4)
    
    return file_path
    '''

def parse_verification_option(verification_option):
    """Convert verification_option string to numerical value"""
    if not verification_option:
        return 0
        
    verification_option = verification_option.lower()
    
    if 'full' in verification_option or '100%' in verification_option:
        return 1
    elif '50%' in verification_option or 'half' in verification_option:
        return 0.5
    else:
        return 0  # Default value


def extract_application_data(job_application):
    """Extract application data from a JobApplication model instance as a dictionary"""
    
    # Get applicant information
    applicant = job_application.applicant
    
    # Get document links organized by document type
    resume_links = []
    experience_documents_links = []
    educational_documents_links = []
    certifications_documents_links = []
    
    # Group documents by type
    for document in job_application.documents.all():
        # Use actual filesystem path
        if document.document_file:
            doc_path = document.document_file.path  # This gives the full system path
            
            if document.document_type.lower() == 'resume':
                resume_links.append(doc_path)
            elif document.document_type.lower() == 'experience':
                experience_documents_links.append(doc_path)
            elif document.document_type.lower() == 'education':
                educational_documents_links.append(doc_path)
            elif document.document_type.lower() == 'certifications':
                certifications_documents_links.append(doc_path)
    
    # Prepare application data in format expected by hire_support.py
    application_data = {
        "first_name": applicant.first_name if hasattr(applicant, 'first_name') else "",
        "last_name": applicant.last_name if hasattr(applicant, 'last_name') else "",
        "resume_link": resume_links[0] if resume_links else "",
        "experience_documents_links": ", ".join(experience_documents_links),
        "educational_documents_links": ", ".join(educational_documents_links),
        "certifications_documents_links": ", ".join(certifications_documents_links)
    }
    
    return application_data

# ----------------------------DI PA NAGAGAMIT ------------- #

def process_verification_results(file_path):
    """Read verification results from JSON file"""
    with open(file_path, 'r') as f:
        verification_result = json.load(f)
    return verification_result

def process_scores(file_path):
    """Read scores from JSON file"""
    with open(file_path, 'r') as f:
        scores = json.load(f)
    return scores
