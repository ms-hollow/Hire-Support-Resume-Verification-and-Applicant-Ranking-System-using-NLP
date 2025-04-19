import re
from rapidfuzz import fuzz

def clean_text(text):
    """
    Clean and standardize text by converting to lowercase and replacing separators with spaces.

    Args:
        text (str): Input text to clean

    Returns:
        str: Cleaned text
    """
    if not isinstance(text, str):
        return ""
    # Convert to lowercase and replace common separators with spaces
    cleaned = text.lower()
    cleaned = re.sub(r'[-_/]', ' ', cleaned)
    # Remove extra whitespace
    cleaned = ' '.join(cleaned.split())
    return cleaned

def check_word_presence(source, target):
    """
    Check if all words in target are present in source, regardless of order.

    Args:
        source (str): Text to search in
        target (str): Words to look for

    Returns:
        bool: True if all target words are in source
    """
    source_words = set(clean_text(source).split())
    target_words = set(clean_text(target).split())
    return all(word in source_words for word in target_words)

def get_job_title_relevance_score(certification, job_titles_preferences):
    """
    Calculate relevance score based on job title matches.

    Args:
        certification (str): The certification to evaluate
        job_titles_preferences (dict): Dictionary containing job title preferences by relevance level

    Returns:
        float: Relevance score (20, 18, 16, or 0)
    """
    cleaned_cert = clean_text(certification)

    # Check directly relevant job titles
    for title in job_titles_preferences.get('directly_relevant', []):
        if fuzz.ratio(cleaned_cert, clean_text(title)) >= 75:
            return 20.0

    # Check highly relevant job titles
    for title in job_titles_preferences.get('highly_relevant', []):
        if fuzz.ratio(cleaned_cert, clean_text(title)) >= 75:
            return 18.0

    # Check moderately relevant job titles
    for title in job_titles_preferences.get('moderately_relevant', []):
        if fuzz.ratio(cleaned_cert, clean_text(title)) >= 75:
            return 16.0

    return 0.0

def get_skills_relevance_score(certification, skills_preferences):
    """
    Calculate relevance score based on skills matches.

    Args:
        certification (str): The certification to evaluate
        skills_preferences (dict): Dictionary containing skills preferences by relevance level

    Returns:
        float: Relevance score (14, 12, 10, or 5)
    """
    cleaned_cert = clean_text(certification)

    # Check primary skills
    for skill in skills_preferences.get('directly_relevant', []):
        if check_word_presence(cleaned_cert, clean_text(skill)):
            return 14.0

    # Check secondary skills
    for skill in skills_preferences.get('highly_relevant', []):
        if check_word_presence(cleaned_cert, clean_text(skill)):
            return 12.0

    # Check additional skills
    for skill in skills_preferences.get('moderately_relevant', []):
        if check_word_presence(cleaned_cert, clean_text(skill)):
            return 10.0

    return 5.0

def get_certification_type_score(certification):
    """
    Calculate certification type score based on certification level keywords.

    Args:
        certification (str): The certification to evaluate

    Returns:
        float: Certification type score (1.0, 0.8, 0.5, or 0.3)
    """
    cleaned_cert = clean_text(certification)

    # Define certification type keywords
    professional_keywords = ["professional", "architect", "advanced", "specialist", "certified", "accredited", "license", "licensed", "registered"
                           "expert", "consultant", "manager", "expert", "master", "advanced", "manager", "principal", "lead", "practitioner"]
    technical_keywords = ["developer", "engineer", "administrator", "technician",
                         "practitioner", "technical", "programmer"]
    short_course_keywords = ["fundamentals", "essentials", "associate", "introduction",
                           "foundation", "course", "short course", "basics",
                           "entry level", "beginner", "workshop", "training", "foundations", "entry", "junior", "core", "seminar", "program", "internship", "learning", "session"]

    # Check certification type
    if any(keyword in cleaned_cert for keyword in professional_keywords):
        return 1.0
    elif any(keyword in cleaned_cert for keyword in technical_keywords):
        return 0.8
    elif any(keyword in cleaned_cert for keyword in short_course_keywords):
        return 0.5
    return 0.3

def get_institution_bonus(provider, settings):
    """
    Calculate institution bonus based on preferred certification providers.

    Args:
        provider (str): Certification provider to evaluate
        settings (dict): Dictionary containing certification institution preferences

    Returns:
        int: Institution bonus score
    """
    if not settings.get('certificate_institution_preference'):
        return 0

    cleaned_provider = clean_text(provider)
    preferred_institutions = [clean_text(inst.strip())
                            for inst in settings['certificate_institution_preference'].split(',')]

    for institution in preferred_institutions:
        if fuzz.ratio(cleaned_provider, institution) >= 75:
            return 2
    return 0

def score_certification(applicant_certifications, job_titles_preferences,
                       skills_preferences, settings):
    """
    Score each certification based on various criteria and preferences.

    Args:
        applicant_certifications (list): List of certification dictionaries
        job_titles_preferences (dict): Dictionary of job title preferences by relevance
        skills_preferences (dict): Dictionary of skills preferences by relevance
        settings (dict): Dictionary of scoring settings

    Returns:
        tuple: (Updated certifications list, total score)
    """
    total_certification_score = 0

    for certification in applicant_certifications:
        # Get job title relevance score
        job_title_relevance = get_job_title_relevance_score(
            certification['certification'],
            job_titles_preferences
        )

        # Get skills relevance score
        skills_relevance = get_skills_relevance_score(
            certification['certification'],
            skills_preferences
        )

        # Use the higher of the two relevance scores
        certification['relevance_score'] = max(job_title_relevance, skills_relevance)

        # Calculate certification type score
        certification['certification_type_score'] = get_certification_type_score(
            certification['certification']
        )

        # Calculate institution bonus
        certification['institution_bonus'] = get_institution_bonus(
            certification['provider'],
            settings
        )

        # Calculate total score for this certification
        certification_score = (
            certification['certification_type_score'] * certification['relevance_score'] +
            certification['institution_bonus']
        )

        # Apply verification multiplier if certification is unverified
        if 'unverified' in certification.get('verification_status', '').lower():
            certification_score *= settings.get('verification_option', 1)

        certification['certification_score'] = certification_score
        total_certification_score += certification_score

    return applicant_certifications, total_certification_score


if __name__ == "__main__":
    """
    Main function to demonstrate certification scoring system with sample data.
    """
    # Sample certification data with diverse cases
    sample_certifications = [
        {
            "certification": "AWS Certified Solutions Architect - Professional",
            "provider": "Amazon Web Services",
            "start_date": "01/2020",
            "end_date": "12/2024",
            "verification_status": "verified"
        },
        {
            "certification": "Microsoft Azure Developer Associate",
            "provider": "Microsoft",
            "start_date": "03/2021",
            "end_date": "03/2023",
            "verification_status": "verified"
        },
        {
            "certification": "Introduction to Python Programming",
            "provider": "Coursera",
            "start_date": "06/2022",
            "end_date": "07/2022",
            "verification_status": "unverified"
        },
        {
            "certification": "Certified Kubernetes Administrator",
            "provider": "Cloud Native Computing Foundation",
            "start_date": "01/2023",
            "end_date": "01/2024",
            "verification_status": "verified"
        },
        {
            "certification": "Advanced Data Science Specialist",
            "provider": "IBM",
            "start_date": "05/2022",
            "end_date": "05/2024",
            "verification_status": "verified"
        }
    ]

    # Sample job titles preferences for a Cloud Solutions Architect position
    job_titles_preferences = {
        'directly_relevant': [
            'Solutions Architect',
            'Cloud Architect',
            'Infrastructure Architect'
        ],
        'highly_relevant': [
            'Cloud Engineer',
            'DevOps Engineer',
            'Systems Architect'
        ],
        'moderately_relevant': [
            'Software Engineer',
            'System Administrator',
            'Database Administrator'
        ]
    }

    # Sample skills preferences
    skills_preferences = {
        'directly_relevant': [
            'AWS',
            'Cloud Architecture',
            'Infrastructure Design'
        ],
        'highly_relevant': [
            'Kubernetes',
            'Docker',
            'Python',
            'Azure'
        ],
        'moderately_relevant': [
            'Data Science',
            'Machine Learning',
            'Database Management'
        ]
    }

    # Sample settings
    settings = {
        "job_title": "Senior Cloud Solutions Architect",
        "certificate_institution_preference": "AWS, Microsoft, Google Cloud",
        "verification_option": 0.8  # Multiplier for unverified certifications
    }

    print("=== Certification Scoring System Demo ===")
    print("\nJob Position:", settings["job_title"])
    print("Preferred Institutions:", settings["certificate_institution_preference"])
    print("\nScoring Results:")
    print("-" * 50)

    # Run the scoring system
    applicant_certifications, total_certification_score = score_certification(
        sample_certifications,
        job_titles_preferences,
        skills_preferences,
        settings
    )

    for certification in applicant_certifications:
        print(f"\nCertification: {certification['certification']}")
        print(f"Institution/Provider: {certification['provider']}")
        print(f"Start Date: {certification['start_date']}")
        print(f"End Date: {certification['end_date']}")
        print(f"Verification Status: {certification['verification_status']}")
        print(f"Relevance Score: {certification['relevance_score']:.2f}")
        print(f"Certification Type Score: {certification['certification_type_score']:.2f}")
        print(f"Institution/Provider Bonus: {certification['institution_bonus']}")
        print(f"Certification Score: {certification['certification_score']:.2f}")

    print(f"\nTotal Certification Score: {total_certification_score:.2f}")