"""
score_skills.py - Module for scoring candidate skills based on company preferences
This module provides functionality to calculate weighted scores for different skill levels
(primary, secondary, additional) based on their frequency in a candidate's profile.
"""


def score_skills(applicant_skills, settings):
    """
    Calculate skill scores for an applicant based on skill frequency and importance level.

    Args:
        applicant_skills (dict): Dictionary containing categorized skills and their frequencies
        settings (dict): Job settings including weights and other preferences

    Returns:
        dict: Updated applicant_skills dictionary with calculated scores
    """
    # Base score for skill calculations
    base_score = 10

    # Initialize score categories
    applicant_skills['primary_skills_score'] = 0
    applicant_skills['secondary_skills_score'] = 0
    applicant_skills['additional_skills_score'] = 0

    # Calculate primary skills score
    for skill, frequency in applicant_skills['primary_skills'].items():
        skill_score = base_score + (frequency * 2)
        applicant_skills['primary_skills_score'] += skill_score
        #print(f"Primary skill '{skill}' with frequency {frequency} = {skill_score:.2f} points")

    # Calculate secondary skills score
    for skill, frequency in applicant_skills['secondary_skills'].items():
        skill_score = base_score + (frequency * 2)
        applicant_skills['secondary_skills_score'] += skill_score
        #print(f"Secondary skill '{skill}' with frequency {frequency} = {skill_score:.2f} points")

    # Calculate additional skills score
    for skill, frequency in applicant_skills['additional_skills'].items():
        skill_score = base_score + (frequency * 2)
        applicant_skills['additional_skills_score'] += skill_score
        #print(f"Additional skill '{skill}' with frequency {frequency} = {skill_score:.2f} points")

    # Calculate total weighted score
    # Primary skills: 50%, Secondary skills: 30%, Additional skills: 20%
    total_skills_score = (
            applicant_skills['primary_skills_score'] * 0.5 +
            applicant_skills['secondary_skills_score'] * 0.3 +
            applicant_skills['additional_skills_score'] * 0.2
    )

    return applicant_skills, total_skills_score


if __name__ == "__main__":
    """
    Main function demonstrating the usage of the skill scoring module.
    """
    # Sample input data
    sample_applicant_skills = {
        "primary_skills": {
            "C++": 5,
            "C": 4,
            "Python": 5
        },
        "secondary_skills": {
            "Git": 3,
            "Ruby": 3
        },
        "additional_skills": {
            "Django": 2
        }
    }

    sample_settings = {
        "job_title": "Senior Software Engineer",
        "specialization": "Backend Development",
    }

    scored_skills, total_skills_score = score_skills(sample_applicant_skills, sample_settings)


