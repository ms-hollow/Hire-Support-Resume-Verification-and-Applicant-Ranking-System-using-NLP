import re
from rapidfuzz import fuzz
from typing import Dict, List, Set

def get_similarity_ratio(str1: str, str2: str) -> float:
    """
    Calculate similarity ratio between two strings using rapidfuzz
    Args:
        str1: First string to compare
        str2: Second string to compare
    Returns:
        float: Similarity ratio between 0 and 1
    """
    return fuzz.ratio(str1.lower(), str2.lower()) / 100.0

def get_threshold(text_length: int) -> float:
    """
    Determine similarity threshold based on text length.
    Shorter texts require higher similarity for matching.
    Args:
        text_length: Length of the text to match
    Returns:
        float: Similarity threshold between 0 and 1
    """
    if text_length <= 5:
        return 1.0  # Exact match for very short strings
    elif text_length <= 8:
        return 0.90
    else:
        return 0.85

def find_skill_occurrences(text: str, skill: str) -> int:
    """
    Find occurrences of a skill in text using fuzzy matching.
    Considers word boundaries and common separators.
    Args:
        text: Text to search in
        skill: Skill to search for
    Returns:
        int: Number of occurrences found
    """
    text = text.lower()
    skill = skill.lower()
    threshold = get_threshold(len(skill))

    # Split text into words considering multiple delimiters
    words = re.split(r'[\s,\-\n]+', text)
    count = 0

    # Check each word/phrase for potential match
    for word in words:
        # Clean the word from punctuation
        word = word.strip('.,;:()')

        # For very short skills (1-4 chars), require exact match
        if len(skill) <= 4:
            if word == skill:
                count += 1
            continue

        # For longer skills, use fuzzy matching with token_sort_ratio.
        if len(word.split()) > 1 or len(skill.split()) > 1:     # This handles cases where word order might be different
            similarity = fuzz.token_sort_ratio(word, skill) / 100.0
        else:
            similarity = fuzz.ratio(word, skill) / 100.0

        if similarity >= threshold:
            count += 1

    return count

def parse_skills(skills: Dict[str, List[str]], resume_text: str) -> Dict[str, Dict[str, int]]:
    """
    Parse and count skills occurrences in the resume text with fuzzy matching.
    Args:
        skills: Dictionary containing lists of skills categorized as primary, secondary, and additional
        resume_text: Single string containing the entire resume content
    Returns:
        Dictionary containing matched skills and their frequencies in the resume
    """

    # Initialize result dictionary
    matched_skills = {
        "primary_skills": {},
        "secondary_skills": {},
        "additional_skills": {}
    }

    # Process each skill category
    for category in ['primary', 'secondary', 'additional']:
        skill_list = skills.get(f'{category}_skills', [])

        for skill in skill_list:
            # Count occurrences in the resume text
            total_count = find_skill_occurrences(resume_text, skill)

            # Add skill to results if found
            if total_count > 0:
                matched_skills[f'{category}_skills'][skill] = total_count

    return matched_skills


# Example usage:
if __name__ == "__main__":
    # Sample input
    sample_skills = {
        "primary_skills": ["C++", "Python", "C", "Reactjs", "AWS", "Docker"],
        "secondary_skills": ["Git", "Ruby", "React", "C#", "GitLab"],
        "additional_skills": ["Django"]
    }

    # Sample resume text (combined into a single string)
    sample_resume = """
    Skills:
    Programming: C++, Python, Git
    Frameworks: Django Reactjs, React, C#

    Experience:
    Developed C++ applications
    Used Python and Git for version control C#, Ruby, Git, Git Lab React.js

    Projects:
    Created Django web application
    Implemented Ruby scripts, React, C#, Reactj
    """

    result = parse_skills(sample_skills, sample_resume)
    print(result)