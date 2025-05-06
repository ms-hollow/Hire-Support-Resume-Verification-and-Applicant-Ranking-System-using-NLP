from rapidfuzz import fuzz
from datetime import datetime
import re


def clean_job_title(title):
    """
    Clean and standardize job title by converting to lowercase, removing extra spaces,
    and replacing hyphens and other separators with spaces.

    Args:
        title (str): Job title to clean

    Returns:
        str: Cleaned job title
    """
    # Replace hyphens, underscores, and other common separators with spaces
    cleaned = re.sub(r'[-_/\\]', ' ', title.lower())
    # Remove any special characters and extra spaces
    cleaned = re.sub(r'[^\w\s]', '', cleaned)
    # Normalize spaces
    return ' '.join(cleaned.split())

def match_job_titles(experience_title, preference_titles):
    """
    Check if all words in any preference title are present in the experience title
    using fuzzy string matching.

    Args:
        experience_title (str): Job title from experience
        preference_titles (list): List of preferred job titles to match against

    Returns:
        bool: True if a match is found, False otherwise
    """
    experience_words = set(clean_job_title(experience_title).split())

    for pref_title in preference_titles:
        pref_words = set(clean_job_title(pref_title).split())

        # Debug printing to help understand the matching process
        #print(f"Matching: Experience words {experience_words} against preference words {pref_words}")

        # Check if all words in preference title exist in experience title with threshold
        all_words_present = all(
            any(fuzz.ratio(pref_word, exp_word) >= 75 for exp_word in experience_words)
            for pref_word in pref_words
        )

        if all_words_present:
            print(f"Match found: {experience_title} matches with {pref_title}")
            return True

    return False


def get_number_of_months(start_date, end_date):
    """
    Calculate the number of months between start and end dates.
    Handles both MM/YYYY and YYYY formats.

    Args:
        start_date (str): Start date in MM/YYYY or YYYY format
        end_date (str): End date in MM/YYYY or YYYY format

    Returns:
        int: Number of months between dates
    """

    def parse_date(date_str):
        if '/' in date_str:  # MM/YYYY format
            month, year = map(int, date_str.split('/'))
            return datetime(year, month, 1)
        else:  # YYYY format
            return datetime(int(date_str), 1, 1)

    start = parse_date(start_date)
    end = parse_date(end_date)

    months = (end.year - start.year) * 12 + (end.month - start.month)

    # Subtract 6 months if both dates are in YYYY format
    if '/' not in start_date and '/' not in end_date:
        months -= 6

    return max(months, 0)


def score_experiences(applicant_experiences, job_titles_preferences, settings):
    """
    Score applicant experiences based on job title relevance and duration.

    Args:
        applicant_experiences (list): List of dictionaries containing experience details
        job_titles_preferences (dict): Dictionary of job titles categorized by relevance
        settings (dict): Job hiring settings including weights and specialization
    Returns:
        applicant_expereinces: Updated applicant_experiences dictionary
    """
    month_value = 0.8333
    total_experience_score = 0

    # Senior level keywords
    senior_keywords = ['senior', 'sr.', 'lead', 'iii', '3', 'director', 'head', 'principal', 'architect']

    # Mid level keywords
    mid_keywords = ['mid level', 'associate', 'ii', '2', 'intermediate']

    for experience in applicant_experiences:
        # Clean job title
        job_title = clean_job_title(experience['job_title'])
        relevance_score = 0

        # Calculate relevance score based on specialization and job title matches
        if settings.get('specialization') != 'none':
            # Add specialization bonus if present in job title
            if settings['specialization'].lower() in job_title:
                relevance_score += 0.2
            # Check matches in different relevance categories
            if match_job_titles(job_title, job_titles_preferences.get('directly_relevant', [])):
                relevance_score += 0.8
            elif match_job_titles(job_title, job_titles_preferences.get('highly_relevant', [])):
                relevance_score += 0.6
            elif match_job_titles(job_title, job_titles_preferences.get('moderately_relevant', [])):
                relevance_score += 0.4
            else:
                print(f"Job title is not relevant: {job_title}")
        else:
            # Scoring without specialization
            if match_job_titles(job_title, job_titles_preferences.get('directly_relevant', [])):
                relevance_score += 1.0
            elif match_job_titles(job_title, job_titles_preferences.get('highly_relevant', [])):
                relevance_score += 0.8
            elif match_job_titles(job_title, job_titles_preferences.get('moderately_relevant', [])):
                relevance_score += 0.6
            else:
                print(f"Job title is not relevant: {job_title}")

        # Check for senior level keywords
        if any(keyword in job_title for keyword in senior_keywords):
            role_level_score = 3
        # Check for mid level keywords
        elif any(keyword in job_title for keyword in mid_keywords):
            role_level_score = 2
        else:
            role_level_score = 0

        # Calculate number of months and experience score
        number_of_months = get_number_of_months(experience['start_date'], experience['end_date'])
        experience_score = number_of_months * month_value * relevance_score + role_level_score

        # Consider verification_option (i-multiply sa experience_score)
        if 'unverified' in experience['verification_status']:
            experience_score *= settings['verification_option']

        # Update the experience dictionary with new scores
        experience['relevance_score'] = relevance_score
        experience['no_of_months'] = number_of_months
        experience['role_level_score'] = role_level_score
        experience['experience_score'] = experience_score

        total_experience_score += experience_score

    return applicant_experiences, total_experience_score


if __name__ == "__main__":
    """
    Main function with example input data to test the experience scoring system.
    Includes various scenarios to test different aspects of the scoring logic.
    """
    # Example applicant experiences with different scenarios
    applicant_experiences = [
        {
            "job_title": "Senior Python Developer",  # Directly relevant + specialization
            "company": "Tech Solutions Inc",
            "start_date": "03/2020",
            "end_date": "12/2023",
            "verification_status": "verified"
        },
        {
            "job_title": "Full-Stack Engineer",  # Highly relevant
            "company": "Digital Innovations",
            "start_date": "2018",
            "end_date": "2020",
            "verification_status": "verified"
        },
        {
            "job_title": "IT Systems Engineer",  # Moderately relevant
            "company": "Global Tech Corp",
            "start_date": "06/2017",
            "end_date": "12/2018",
            "verification_status": "unverified: [missing employment dates]"
        },
        {
            "job_title": "Marketing Specialist",  # Not relevant
            "company": "Business Solutions",
            "start_date": "01/2016",
            "end_date": "05/2017",
            "verification_status": "verified"
        }
    ]

    # Job titles preferences with different relevance categories
    job_titles_preferences = {
        'directly_relevant': [
            'Python Developer',
            'Software Engineer Python',
            'Python Software Developer',
            'Senior Developer'
        ],
        'highly_relevant': [
            'Full Stack Developer',
            'Full Stack Engineer',
            'Software Developer',
            'Backend Developer'
        ],
        'moderately_relevant': [
            'IT Engineer',
            'Systems Engineer',
            'Software Analyst',
            'Technical Consultant'
        ]
    }

    # Settings with specialization
    settings = {
        'specialization': 'Python',
        'job_title': 'Senior Python Developer',
        'verification_option': 1,
        'weights': {
            'experience': 0.4,
            'skills': 0.3,
            'education': 0.3
        }
    }

    # Test the scoring function
    print("Testing experience scoring system...")
    print("\nSettings:")
    print(f"Job Title: {settings['job_title']}")
    print(f"Specialization: {settings['specialization']}")
    print("\nProcessing experiences...")

    applicant_experiences, total_experience_score = score_experiences(
        applicant_experiences,
        job_titles_preferences,
        settings
    )

    # Print experience details
    for i, exp in enumerate(applicant_experiences, 1):
        print(f"\nExperience {i}:")
        print(f"Job title: {exp['job_title']}")
        print(f"Company: {exp['company']}")
        print(f"Start date: {exp['start_date']}")
        print(f"End date: {exp['end_date']}")
        print(f"Verification status: {exp['verification_status']}")
        print(f"Relevance score: {exp['relevance_score']:.2f}")
        print(f"No. of months: {exp['no_of_months']}")
        print(f"Role level score: {exp['role_level_score']:.2f}")
        print(f"Experience score: {exp['experience_score']:.2f}")

    print(f"\nTotal Experience Score: {total_experience_score:.2f}")
