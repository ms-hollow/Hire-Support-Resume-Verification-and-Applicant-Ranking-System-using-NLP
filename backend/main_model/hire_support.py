import json
import os
from document_extraction import extract_documents
from resume_parser import parse_resume
from resume_verification import verify_resume
from score_experience import score_experiences
from score_skill import score_skills
from score_education import score_education
from score_certification import score_certification

def load_json_file(file_path):
    """
    Load and return data from a JSON file
    Args: file_path (str): Path to the JSON file
    Returns: dict: Parsed JSON data
    """
    try:
        with open(file_path, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        print(f"Error: File not found at {file_path}")
        return None
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON format in {file_path}")
        return None


def parse_list_string(list_string):
    """
    Convert comma-separated string to list and remove whitespace
    Args: list_string (str): Comma-separated string
    Returns: list: List of stripped strings
    """
    return [item.strip() for item in list_string.split(',')]


def process_hiring_settings(data):
    """
    Process job hiring settings data and separate list fields into dictionaries
    Args: data (dict): Job hiring settings data
    Returns: tuple: Regular variables and dictionaries containing list data
    """

    # Store lists data in each dictionary
    job_titles_dict = {
        'directly_relevant': parse_list_string(data['directly_relevant_job_titles']),
        'highly_relevant': parse_list_string(data['highly_relevant_job_titles']),
        'moderately_relevant': parse_list_string(data['moderately_relevant_job_titles'])
    }

    skills_dict = {
        'primary_skills': parse_list_string(data['primary_skills']),
        'secondary_skills': parse_list_string(data['secondary_skills']),
        'additional_skills': parse_list_string(data['additional_skills'])
    }

    field_study_dict = {
        'first_choice': parse_list_string(data['first_choice_field_study']),
        'second_choice': parse_list_string(data['second_choice_field_study']),
        'third_choice': parse_list_string(data['third_choice_field_study'])
    }

    return (job_titles_dict, skills_dict, field_study_dict)


def process_application(data):
    """
    Process job application data and separate list fields into dictionaries
    Args: data (dict): Job application data
    Returns: tuple: Regular variables and dictionary containing list data
    """

    # Store lists data in each dictionary
    documents_dict = {
        'experiences': parse_list_string(data['experience_documents_links']),
        'education': parse_list_string(data['educational_documents_links']),
        'certifications': parse_list_string(data['certifications_documents_links'])
    }

    return documents_dict

def main():
    """
    Main function to execute the hire support system
    """
    # Prompt for json files (dummy application and job hiring settings)
    hiring_settings_path = r'backend\main_model\sample_inputs\job_hiring_settings\Full Stack Web Developer.json'
    job_application_path = r'backend\main_model\sample_inputs\job_application\Alexander Mendoza.json'
    # hiring_settings_path = input("Enter the path to job_hiring_settings.json: ")
    # job_application_path = input("Enter the path to job_application.json: ")

    # Load JSON files put them in a dictionary
    settings = load_json_file(hiring_settings_path)
    application = load_json_file(job_application_path)

    # Process lists data: store them in a dictionary
    if settings and application:
        documents_paths = process_application(application)
        job_titles_preferences, skills_preferences, field_study_preferences = process_hiring_settings(settings)

    # Initialize storage for extracted texts
    extracted_texts = {
        "resume": None,  # Store the resume text as a single string
        "experiences": [],  # List for experience document texts
        "education": [],  # List for educational document texts
        "certifications": []  # List for certification document texts
    }

    # Set default empty lists for document paths
    resume_link = application.get('resume_link', None)
    experiences = documents_paths.get('experiences', []) if documents_paths else []
    education = documents_paths.get('education', []) if documents_paths else []
    certifications = documents_paths.get('certifications', []) if documents_paths else []

    # Provide warnings if any document path is missing
    if not resume_link:
        print("Warning: Resume link is missing. Processing without a resume.")
    if not experiences:
        print("Warning: No experience documents uploaded. Processing without experiences.")
    if not education:
        print("Warning: No education documents uploaded. Processing without education details.")
    if not certifications:
        print("Warning: No certification documents uploaded. Processing without certifications.")

    # Get the extracted texts
    extracted_texts = extract_documents (
        application['resume_link'], documents_paths['experiences'], documents_paths['education'], documents_paths['certifications']
    )

    # Print extracted texts
    for category, texts in extracted_texts.items():
        if category == "resume":
            continue
        print(f"=============== {category.upper()} TEXTS ============")
        for idx, text in enumerate(texts, start=1):
            print(f"{category.capitalize()} {idx}: {text}")
        print()  # Add a blank line after each section

    # Parse Resume (4 criterias)
    applicant_experiences, applicant_education, applicant_certifications, applicant_skills = parse_resume(extracted_texts['resume'], skills_preferences)

    # Verify resume
    missing_names, applicant_experiences, applicant_education, applicant_certifications = verify_resume(application, extracted_texts, applicant_experiences, applicant_education, applicant_certifications)

    # Create a structured verification result dictionary
    verification_result = {
        'resume_verification': {
            'missing_name_components': missing_names
        },
        'experience_verification': applicant_experiences,
        'education_verification': applicant_education,
        'certification_verification': applicant_certifications
    }

    print("\n====================== VERIFICATION RESULTS SUMMARY =====================================")

    print("\nRESUME:\n")
    print("These registered name components can't be found in the uploaded resume: ")
    for key, value in missing_names.items():
        formatted_key = key.replace("_", " ").title()  # e.g., "first_name" -> "First Name"
        print(f"{formatted_key}: {value}")

    print("\nEXPERIENCES:")
    for exp in applicant_experiences:
        print(f"\nJob Title: {exp['job_title']}")
        print(f"Company: {exp['company']}")
        print(f"Duration: {exp['start_date']} to {exp['end_date']}")
        print(f"Verification Status: {exp['verification_status']}")

    print("\nEDUCATION:")
    for edu in applicant_education:
        print(f"\nCourse: {edu['course']}")
        print(f"School: {edu['school']}")
        print(f"Duration: {edu['start_date']} to {edu['end_date']}")
        print(f"Verification Status: {edu['verification_status']}")

    print("\nCERTIFICATIONS:")
    for cert in applicant_certifications:
        print(f"\nCertification: {cert['certification']}")
        # print(f"Provider: {cert['provider']}")
        print(f"Date: {cert['start_date']} to {cert['end_date']}")
        print(f"Verification Status: {cert['verification_status']}")

    # Define the directory and file path
    file_path = os.path.join(r'backend/verification_result.json')

    # Save the JSON file
    with open(file_path, 'w') as json_file:
        json.dump(verification_result, json_file, indent=4)

    print(f"\n✅ Verification results saved to: {file_path}")


    print("\n========================== SCORING RESULTS ===================================")

    print("\n============== EXPERIENCE ============== ")

    # Score experience
    applicant_experiences, total_experience_score = score_experiences(applicant_experiences, job_titles_preferences, settings)

    # Print experience details
    for i, exp in enumerate(applicant_experiences, 1):
        print(f"\nEXPERIENCE {i}:")
        print(f"Job title: {exp['job_title']}")
        print(f"Company: {exp['company']}")
        print(f"Start date: {exp['start_date']}")
        print(f"End date: {exp['end_date']}")
        print(f"Verification status: {exp['verification_status']}")
        print(f"Relevance score: {exp['relevance_score']:.2f}")
        print(f"No. of months: {exp['no_of_months']}")
        print(f"Experience score: {exp['experience_score']:.2f}")

    print(f"\nTotal Experience Score: {total_experience_score:.2f}")

    print("\n============== SKILLS ============== ")

    # Score Skills
    applicant_skills, total_skills_score = score_skills(applicant_skills, settings)

    print(f"Primary Skills Score: {applicant_skills['primary_skills_score']:.2f}")
    print(f"Secondary Skills Score: {applicant_skills['secondary_skills_score']:.2f}")
    print(f"Additional Skills Score: {applicant_skills['additional_skills_score']:.2f}")
    print(f"\nTotal Skills Score: {total_skills_score:.2f}")

    print("\n============== EDUCATION ============== ")

    # Score Education
    applicant_education, total_education_score = score_education(applicant_education, field_study_preferences, settings)

    for education in applicant_education:
        print(f"\nCourse: {education['course']}")
        print(f"School: {education['school']}")
        print(f"Start Date: {education['start_date']}")
        print(f"End Date: {education['end_date']}")
        print(f"Verification Status: {education['verification_status']}")
        print(f"Relevance Score: {education['relevance_score']:.2f}")
        print(f"Education Type Score: {education['education_type_score']:.2f}")
        print(f"Honor Bonus: {education['honor_bonus']}")
        print(f"School Bonus: {education['school_bonus']}")
        print(f"Education Score: {education['education_score']:.2f}")

    print(f"\nTotal Education Score: {total_education_score}")

    print("\n============== CERTIFICATION ============== ")

    # Score Certification
    applicant_certifications, total_certification_score = score_certification(applicant_certifications, job_titles_preferences, skills_preferences, settings)

    for certification in applicant_certifications:
        print(f"\nCertification: {certification['certification']}")
        #print(f"Institution/Provider: {certification['provider']}")
        print(f"Start Date: {certification['start_date']}")
        print(f"End Date: {certification['end_date']}")
        print(f"Verification Status: {certification['verification_status']}")
        print(f"Relevance Score: {certification['relevance_score']:.2f}")
        print(f"Certification Type Score: {certification['certification_type_score']:.2f}")
        #print(f"Institution/Provider Bonus: {certification['institution_bonus']}")
        print(f"Certification Score: {certification['certification_score']:.2f}")

    print(f"\nTotal Certification Score: {total_certification_score}")

    # Calculate overall score
    # Calculate total weight
    total_weight = (
            settings['experience_weight'] +
            settings['skills_weight'] +
            settings['education_weight'] +
            settings['certifications_weight']
    )

    # Calculate weighted overall score
    overall_score = (
            (total_experience_score * settings['experience_weight']) +
            (total_skills_score * settings['skills_weight']) +
            (total_education_score * settings['education_weight']) +
            (total_certification_score * settings['certifications_weight'])
    )

    # Normalize by total weight
    overall_score = overall_score / total_weight

    print("\n============== APPLICANT SCORE SUMMARY ============== ")
    # Print the applicant score summary
    print(f"Experience: {total_experience_score:.2f}")
    print(f"Education: {total_education_score:.2f}")
    print(f"Skills: {total_skills_score:.2f}")
    print(f"Certifications: {total_certification_score:.2f}")
    print(f"Overall Score: {overall_score:.2f}")

    # Create a simple scores dictionary with just the summary values
    scores_summary = {
        'experience_score': round(total_experience_score, 2),
        'education_score': round(total_education_score, 2),
        'skills_score': round(total_skills_score, 2),
        'certification_score': round(total_certification_score, 2),
        'overall_score': round(overall_score, 2)
    }

    # Define the directory and file path
    file_path = os.path.join(r'backend/scores.json')

    # Save the JSON file
    with open(file_path, 'w') as json_file:
        json.dump(scores_summary, json_file, indent=4)

    print(f"\n Scores results saved to: {file_path}")


if __name__ == "__main__":
    main()