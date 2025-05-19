from rapidfuzz import fuzz, process
from typing import Dict, List, Optional, Set
import re

def find_pattern_in_text(text: str, pattern: str, threshold: int = 85, debug: bool = False) -> bool:
    """
    Find a pattern in text using flexible word matching.
    Handles word order variations and partial matches efficiently.

    Args:
        text: Text to search in
        pattern: Pattern to find
        threshold: Minimum fuzzy match ratio (default: 85)
        debug: Print debug information

    Returns:
        bool: True if pattern is found in text
    """
    if not text or not pattern:
        return False

    # Clean and normalize text
    text = text.lower().strip()
    pattern = pattern.lower().strip()

    # Replace punctuation with spaces except for hyphens/dashes
    text = re.sub(r"[^\w\s-]", " ", text)  # Keeps letters, numbers, spaces, and hyphens
    pattern = re.sub(r"[^\w\s-]", " ", pattern)

    if debug:
        print(f"\nSearching for pattern: '{pattern}' in text")

    # Check if pattern is a date in mm/yyyy format
    date_pattern = re.compile(r'^\d{2}/\d{4}$')
    is_date = bool(date_pattern.match(pattern))


    # Use exact matching for short patterns or dates
    if len(pattern) <= 0 or is_date:
        #if debug:
            #print(f"Using exact matching for {'short pattern' if len(pattern) < 6 else 'date pattern'}")

        # For date patterns, split text by both spaces and hyphens
        if is_date:
            # First split by spaces, then split any resulting parts by hyphens
            text_words = []
            for part in text.split():
                text_words.extend(part.split('-'))
        else:
            text_words = text.split()

        match_found = pattern in text_words

        if debug:
            print(f"Text words after splitting: {text_words}")
            print(f"Exact match found: {match_found}")
        return match_found

    # Split pattern into individual words
    pattern_words = pattern.split()

    # For multi-word patterns:
    # 1. Find all text windows that could contain the pattern
    text_words = text.split()

    # Track matching scores for each pattern word
    word_match_scores = {}

    # For each pattern word, find its best match in the text
    for pattern_word in pattern_words:
        # Skip very short words (like "a", "an")
        if len(pattern_word) <= 2:
            continue

        best_ratio = 0
        best_match = None

        # Compare with each text word
        for text_word in text_words:
            # Skip very short words in text
            if len(text_word) <= 2:
                continue

            # Use ratio for longer words
            ratio = fuzz.ratio(pattern_word, text_word)

            if ratio > best_ratio:
                best_ratio = ratio
                best_match = text_word

        if debug:
            print(f"\nPattern word: '{pattern_word}'")
            print(f"Best matching text word: '{best_match}' with ratio: {best_ratio}")

        word_match_scores[pattern_word] = best_ratio

    # Calculate overall match score
    valid_scores = [score for score in word_match_scores.values() if score >= threshold]

    if debug:
        print(f"\nWord match scores: {word_match_scores}")
        print(f"Valid matches: {len(valid_scores)} out of {len(pattern_words)} pattern words")

    # Calculate initial required matches (words longer than 2 chars)
    required_matches = len([w for w in pattern_words if len(w) > 2])

    # Reduce required_matches by 1 if pattern_words has more than 1 word
    if len(pattern_words) > 1:
        required_matches = max(required_matches - 1, 0)  # Use max to prevent negative values

    actual_matches = len(valid_scores)

    if debug:
        print(f"Required matches: {required_matches}")
        print(f"Actual matches: {actual_matches}")

    return actual_matches >= required_matches


def fuzzy_match(text: str, pattern: str, debug: bool = False) -> bool:
    """
    Wrapper function for find_pattern_in_text to maintain compatibility
    """
    return find_pattern_in_text(text, pattern, threshold=50, debug=debug)

def get_entity_names(category_type: str) -> Dict[str, str]:
    """
    Get the mapped entity names based on category type.
    """
    entity_mapping = {
        'experience': {
            'primary_entity': 'job title',
            'secondary_entity': 'company'
        },
        'education': {
            'primary_entity': 'course',
            'secondary_entity': 'school'
        },
        'certification': {
            'primary_entity': 'certification',
            'secondary_entity': 'provider'
        }
    }
    return entity_mapping.get(category_type, {})


def verify_category(texts: List[str], first_name: str, last_name: str,
                    primary_entity: str, secondary_entity: str,
                    start_date: str, end_date: str,
                    category_type: str,
                    require_dates: bool = False,
                    debug: bool = False) -> Set[str]:
    """
    Generic verification function for a single entry (experience, education, or certification)
    Returns set of missing entities with proper entity names
    """
    base_entities = {'first_name', 'last_name', 'primary_entity', 'secondary_entity'}
    if require_dates:
        base_entities.update(['start_date', 'end_date'])

    best_missing_entities = base_entities.copy()
    found_valid_document = False

    for idx, text in enumerate(texts):
        # Check if document is relevant to current entry
        is_relevant = fuzzy_match(text, primary_entity, debug=debug) or fuzzy_match(text, secondary_entity, debug=debug)
        #print(f"\nChecking document {idx}:")

        if not is_relevant:
            if debug:
                print(f"Document {idx} not relevant, skipping...")
            continue

        current_missing_entities = set()

        # Check each required entity
        if not fuzzy_match(text, first_name, debug=debug):
            current_missing_entities.add('first_name')
        if not fuzzy_match(text, last_name, debug=debug):
            current_missing_entities.add('last_name')
        if not fuzzy_match(text, primary_entity, debug=debug):
            current_missing_entities.add('primary_entity')
        if not fuzzy_match(text, secondary_entity, debug=debug):
            current_missing_entities.add('secondary_entity')

        #print("done in this document ", idx)

        # Check dates only if required
        if require_dates:
            if not fuzzy_match(text, start_date, debug=debug):
                current_missing_entities.add('start_date')
            if not fuzzy_match(text, end_date, debug=debug):
                current_missing_entities.add('end_date')

        # Update best missing entities if this document is better
        if len(current_missing_entities) < len(best_missing_entities):
            best_missing_entities = current_missing_entities
            found_valid_document = True

    if not found_valid_document:
        return None

    # Map generic entity names to specific ones
    entity_names = get_entity_names(category_type)
    mapped_missing_entities = set()

    for entity in best_missing_entities:
        if entity in ['first_name', 'last_name', 'start_date', 'end_date']:
            mapped_missing_entities.add(entity.replace('_', ' '))
        elif entity == 'primary_entity':
            mapped_missing_entities.add(entity_names['primary_entity'])
        elif entity == 'secondary_entity':
            mapped_missing_entities.add(entity_names['secondary_entity'])

    return mapped_missing_entities

def verify_resume(application: Dict, extracted_texts: Dict[str, List[str]],
                  applicant_experiences: List[Dict],
                  applicant_education: List[Dict],
                  applicant_certifications: List[Dict]) -> Dict[str, List[Dict]]:
    """
    Verify resume credentials through supporting documents using fuzzy string matching.
    Verifies experiences, education, and certifications.
    Returns dictionary containing verified lists for each category.
    """
    # Verify name in resume

    first_name = application.get('first_name', '') or ''  # Use empty string if None
    last_name = application.get('last_name', '') or ''    # Use empty string if None

    first_name = first_name.strip()
    last_name = last_name.strip()

    # Join all resume texts and clean them
    resume_text = ''.join(extracted_texts.get('resume', [''])).strip()

    # Check both names in resume
    first_name_match = fuzzy_match(resume_text, first_name)
    last_name_match = fuzzy_match(resume_text, last_name)

    # Check which name(s) in registered name are missing in the resume
    missing_names = {}

    if not first_name_match and first_name:
        missing_names["first_name"] = first_name
    if not last_name_match and last_name:
        missing_names["last_name"] = last_name

    if missing_names:
        print(f"Warning: The following name components were not found in the resume: {', '.join(missing_names.keys())}")

    # Verify experiences
    experience_texts = extracted_texts.get('experiences', [])
    for experience in applicant_experiences:
        missing_entities = verify_category(
            texts=experience_texts,
            first_name=first_name,
            last_name=last_name,
            primary_entity=experience['job_title'],
            secondary_entity=experience['company'],
            start_date=experience['start_date'],
            end_date=experience['end_date'],
            category_type='experience',
            require_dates=True
        )

        if missing_entities is None:
            experience['verification_status'] = "unverified: no supporting documents found"
        else:
            # For experiences, we allow missing just start_date or end_date
            if not missing_entities or missing_entities == {'start date'} or missing_entities == {'end date'}:
                experience['verification_status'] = "verified"
            else:
                missing_items = [entity.replace('_', ' ') for entity in missing_entities]
                missing_str = ', '.join(missing_items)
                experience['verification_status'] = f"unverified: missing {missing_str}"

    # Verify education
    education_texts = extracted_texts.get('education', [])
    for education in applicant_education:
        missing_entities = verify_category(
            texts=education_texts,
            first_name=first_name,
            last_name=last_name,
            primary_entity=education['course'],
            secondary_entity=education['school'],
            start_date=education['start_date'],
            end_date=education['end_date'],
            category_type='education',
            require_dates=False  # Dates not required for education verification
        )

        if missing_entities is None:
            education['verification_status'] = "unverified: no supporting documents found"
        else:
            # For education, we only need name, course, and school
            if not missing_entities or missing_entities.issubset({'start_date', 'end_date'}):
                education['verification_status'] = "verified"
            else:
                missing_items = [entity.replace('_', ' ') for entity in missing_entities
                                 if entity not in {'start_date', 'end_date'}]
                missing_str = ', '.join(missing_items)
                education['verification_status'] = f"unverified: missing {missing_str}"

    # Verify certifications
    certification_texts = extracted_texts.get('certifications', [])
    for certification in applicant_certifications:
        missing_entities = verify_category(
            texts=certification_texts,
            first_name=first_name,
            last_name=last_name,
            primary_entity=certification['certification'],
            secondary_entity=certification['provider'],
            start_date=certification['start_date'],
            end_date=certification['end_date'],
            category_type='certification',
            require_dates=False  # Dates not required for certification verification
        )

        if missing_entities is None:
            certification['verification_status'] = "unverified: no supporting documents found"
        else:
            # For certifications, we only need name, certification, and provider
            if not missing_entities or missing_entities.issubset({'provider', 'start_date', 'end_date'}):
                certification['verification_status'] = "verified"
            else:
                missing_items = [entity.replace('_', ' ') for entity in missing_entities
                                 if entity not in {'start_date', 'end_date'}]
                missing_str = ', '.join(missing_items)
                certification['verification_status'] = f"unverified: missing {missing_str}"

    return missing_names, applicant_experiences, applicant_education, applicant_certifications


# Sample input data for testing resume verification
if __name__ == "__main__":
    # Application data
    sample_application = {
        'first_name': 'Sarah',
        'last_name': 'Johnson',
        'email': 'sarah.johnson@email.com',
        'phone': '555-0123'
    }

    # Extracted texts from documents
    sample_extracted_texts = {
        'resume': [
            """
            SARAH JOHNSON
            Senior Software Professional
            sarah.johnson@email.com | 555-0123

            PROFESSIONAL EXPERIENCE
            Technical Lead, Cloud Solutions Inc.
            Led development of cloud-native applications and mentored junior developers.

            Software Engineer, Tech Innovations
            Developed and maintained enterprise web applications using Python and React.

            EDUCATION
            Bachelor of Science in Computer Science
            State University

            CERTIFICATIONS
            AWS Certified Solutions Architect
            """
        ],
        'experiences': [
            """
            EMPLOYMENT VERIFICATION
            This letter confirms that Sarah Johnson worked at Inc.
            as Technical Lead from  to Present.
            """
        ],
        'education': [
            """
            TRANSCRIPT
            Student: Sarah Johnson
            Degree: Bachelor o
            Institution: State University
            Period: 
            """,
            """
            TRANSCRIPT
            Student: Sarah Johnson
            Degree: Bachelor o
            Institution: State University
            Period: 
            """,

            """
            TRANSCRIPT
            Student: Sarah Johnson
            Degree: Bachelor o
            Institution: State University
            Period: 
            """,

        ],
        'certifications': [
            """
            CERTIFICATION VERIFICATION
            Name: Sarah Johnson
            Certification: AWS Certified Solutions Architect
            Provider: As
            Issue Date: 
            """
        ]
    }

    # Sample data to verify
    sample_applicant_experiences = [
        {
            "job_title": "Technical Lead",
            "company": "Cloud Solutions Inc",
            "start_date": "03/2024",
            "end_date": "Present",
            "verification_status": None
        }
    ]

    sample_applicant_education = [
        {
            "course": "Bachelor of Science in Computer Science",
            "school": "State University",
            "start_date": "08/2016",
            "end_date": "05/2020",
            "verification_status": None
        }
    ]

    sample_applicant_certifications = [
        {
            "certification": "AWS Certified Solutions Architect",
            "provider": "Amazon Web Services",
            "start_date": "01/2022",
            "end_date": "01/2024",
            "verification_status": None
        }
    ]

    try:
        # Unpack the three returned lists
        verified_experiences, verified_education, verified_certifications = verify_resume(
            application=sample_application,
            extracted_texts=sample_extracted_texts,
            applicant_experiences=sample_applicant_experiences,
            applicant_education=sample_applicant_education,
            applicant_certifications=sample_applicant_certifications
        )

        print("================================== VERIFICATION RESULTS ==================================")

        print("\nEXPERIENCE:")
        for exp in verified_experiences:
            print(f"\nJob Title: {exp['job_title']}")
            print(f"Company: {exp['company']}")
            print(f"Duration: {exp['start_date']} to {exp['end_date']}")
            print(f"Verification Status: {exp['verification_status']}")

        print("\nEDUCATION:")
        for edu in verified_education:
            print(f"\nCourse: {edu['course']}")
            print(f"School: {edu['school']}")
            print(f"Duration: {edu['start_date']} to {edu['end_date']}")
            print(f"Verification Status: {edu['verification_status']}")

        print("\nCERTIFICATIONS:")
        for cert in verified_certifications:
            print(f"\nCertification: {cert['certification']}")
            print(f"Provider: {cert['provider']}")
            print(f"Date: {cert['start_date']} to {cert['end_date']}")
            print(f"Verification Status: {cert['verification_status']}")

    except ValueError as e:
        print(f"Verification Error: {e}")