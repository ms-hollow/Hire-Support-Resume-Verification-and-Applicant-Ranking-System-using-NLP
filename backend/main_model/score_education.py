from rapidfuzz import fuzz
from datetime import datetime
import re


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


def get_relevance_score(course, field_study_preferences):
    """
    Calculate relevance score based on course match with field preferences.

    Args:
        course (str): The course to evaluate
        field_study_preferences (dict): Dictionary containing field preferences as lists
                                      {'first_choice': ['Computer Science', 'Software Engineering'], ...}

    Returns:
        float: Relevance score (1.0, 0.8, 0.6, or 0.4)
    """
    cleaned_course = clean_text(course)

    # Check first choice preferences
    for field in field_study_preferences.get('first_choice', []):
        if check_word_presence(cleaned_course, clean_text(field)):
            return 1.0

    # Check second choice preferences
    for field in field_study_preferences.get('second_choice', []):
        if check_word_presence(cleaned_course, clean_text(field)):
            return 0.8

    # Check third choice preferences
    for field in field_study_preferences.get('third_choice', []):
        if check_word_presence(cleaned_course, clean_text(field)):
            return 0.6

    return 0.4

def get_education_type_score(course, is_relevant):
    """
    Calculate education type score based on degree level and relevance.

    Args:
        course (str): The course to evaluate
        is_relevant (bool): Whether the course is relevant to preferences

    Returns:
        int: Education type score
    """
    cleaned_course = clean_text(course)

    if any(word in cleaned_course for word in ['strand', 'track']):
        return 1
    elif any(word in cleaned_course for word in ['diploma', 'technical', 'vocational']):
        return 20
    elif 'bachelor' in cleaned_course:
        return 40
    elif 'master' in cleaned_course:
        return 20
    elif any(word in cleaned_course for word in ['doctor', 'phd']):
        return 30
    return 0


def get_honor_bonus(honors):
    """
    Calculate honor bonus based on academic distinctions.

    Args:
        honors (list): List of honors/distinctions

    Returns:
        int: Honor bonus score
    """
    if not honors:
        return 0

    cleaned_honors = [clean_text(honor) for honor in honors]

    if any('summa cum laude' in honor for honor in cleaned_honors):
        return 5
    elif any('magna cum laude' in honor for honor in cleaned_honors):
        return 3
    elif any('cum laude' in honor for honor in cleaned_honors):
        return 2
    return 0


def get_school_bonus(school, school_preferences):
    """
    Calculate school bonus based on preferred schools.

    Args:
        school (str): School to evaluate
        school_preferences (str): Comma-separated list of preferred schools

    Returns:
        int: School bonus score
    """
    if not school_preferences:
        return 0

    cleaned_school = clean_text(school)
    for preferred_school in school_preferences.split(','):
        if fuzz.ratio(cleaned_school, clean_text(preferred_school.strip())) >= 75:
            return 3
    return 0


def score_education(applicant_education, field_study_preferences, settings):
    """
    Score each education entry based on various criteria and preferences.

    Args:
        applicant_education (list): List of education dictionaries
        field_study_preferences (dict): Dictionary of field preferences
        settings (dict): Dictionary of scoring settings

    Returns:
        tuple: (Updated education list, total score)
    """
    total_education_score = 0
    bachelor_counter = 0
    master_counter = 0
    doctor_counter = 0

    for education in applicant_education:
        # Calculate relevance score
        relevance_score = get_relevance_score(education['course'], field_study_preferences)
        education['relevance_score'] = relevance_score

        # Calculate education type score
        is_relevant = relevance_score > 0
        education['education_type_score'] = get_education_type_score(education['course'], is_relevant)

        # Calculate honor bonus
        education['honor_bonus'] = get_honor_bonus(education.get('honors', []))

        # Calculate school bonus
        education['school_bonus'] = get_school_bonus(education['school'], settings.get('school_preference', ''))

        # Calculate total score for this education
        education_score = (
                education['education_type_score'] * education['relevance_score'] +
                education['school_bonus'] +
                education['honor_bonus']
        )

        # Consider verification_option (i-multiply sa experience_score)
        if 'unverified' in education['verification_status']:
            education_score *= settings['verification_option']

        # Track degree counts
        if 'bachelor' in clean_text(education['course']):
            bachelor_counter += 1
        elif 'master' in clean_text(education['course']):
            master_counter += 1
        elif any(word in clean_text(education['course']) for word in ['doctor', 'phd']):
            doctor_counter += 1

        total_education_score += education_score
        education['education_score'] = education_score

    return applicant_education, total_education_score

if __name__ == "__main__":
    # Example usage with diverse education backgrounds

    applicant_education = [
        {
            "course": "Bachelor of Science in Computer Science",
            "school": "Technological University of the Philippines",
            "start_date": "01/2020",
            "end_date": "12/2023",
            "verification_status": "verified",
            "honors": ["Cum Laude"]
        },
        {
            "course": "Diploma in Computer Technology",
            "school": "De La Salle College of St. Benilde",
            "start_date": "06/2018",
            "end_date": "05/2020",
            "verification_status": "verified",
            "honors": []
        },
        {
            "course": "Master of Science in Information Technology",
            "school": "University of the Philippines",
            "start_date": "01/2024",
            "end_date": "Present",
            "verification_status": "unverified",
            "honors": []
        },
        {
            "course": "Doctor of Philosophy in Data Science",
            "school": "Ateneo de Manila University",
            "start_date": "08/2025",
            "end_date": "Present",
            "verification_status": "unverified",
            "honors": []
        },

        {
            "course": "Information and Communications Technology (ICT) Strand",
            "school": "Philippine Science High School",
            "start_date": "06/2014",
            "end_date": "05/2016",
            "verification_status": "verified",
            "honors": ["With High Honors"]
        }
    ]

    field_study_preferences = {
        "first_choice": "Computer Science, Software Engineering, Information Technology",
        "second_choice": "Computer Engineering, Information Systems",
        "third_choice": "Mathematics, Physics, Engineering"
    }

    settings = {
        "school_preference": "University of the Philippines, De La Salle University, Ateneo de Manila University",
        "honors": True,
        "multiple_degrees": True,
        "verification_option": 1
    }

    applicant_education, total_education_score = score_education(
        applicant_education,
        field_study_preferences,
        settings
    )

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

