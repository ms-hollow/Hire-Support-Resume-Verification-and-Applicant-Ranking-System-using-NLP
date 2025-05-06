import re
from datetime import datetime
from main_model.NER_experience import ner_experience
from main_model.NER_education import ner_education
from main_model.NER_certification import ner_certification
from main_model.skills_parser import parse_skills

def divide_section(resume_text):
    """
    Parse a resume text into different sections based on predefined keywords.
    Args:
        resume_text (str): Raw text extracted from a resume (single-line or multi-line)
    Returns:
        dict: A dictionary containing parsed resume sections
    """

    # Define keywords for each section (sorted by length to handle longer keywords first)
    section_keywords = {
        'Personal': ['Contact Information', 'Personal Info', 'Personal Details', 'Contacts', 'Profile', 'About Me', 'Bio', 'Biography', 'Personal Data', 'Reach Me At'],
        'Objective': ['Career Objective', 'Professional Objective', 'Objectives', 'Summary'],
        'Experience': ['Professional Experience', 'Work Experience', 'Employment History', 'Work History', 'Career History', 'Professional Background', 'Employment Record', 'Career Details', 'Internships', 'Jobs', 'Experiences', 'Experience',],
        'Education': ['Education', 'Educational Background', 'Academic Background', 'Academic Credential', 'Academic History', 'Education History', 'Educational Attainment', 'Academic Qualifications', 'Educational Credentials', 'Academic Profile', 'Academic Record', 'Degrees', 'Courses' 'Coursework' 'Course Work', 'Academic Qualifications', 'Primary', 'Secondary', 'Tertiary'],
        'Skills': ['Professional Skills', 'Technical Skills', 'Key Skills', 'Skills', 'Core Competencies', 'Professional Competencies', 'Skill Set', 'Abilities', 'Technical Competencies', 'Professional Capabilities', 'Expertise', 'Technical Expertise', 'Technical Proficiencies', 'Skill Summary', "Hobbies"],
        'Certification': ['Certifications', 'Certificates', 'Workshops', 'Trainings', 'Seminars'],
        'Projects': ['Projects', 'Project Portfolio'],
        'Achievements': ['Achievements', 'Awards', 'Accomplishments', 'Milestones'],
        'References': ['References', 'Recommendations']
    }

    # Normalize resume text by removing leading/trailing spaces
    # resume_text = resume_text.strip()

    # Initialize sections dictionary kung saan i-store ang each section
    sections = {}
    current_section = 'Personal' # Assume text starts in the 'Personal' section
    sections[current_section] = ''

    # Prepare keyword patterns for detection
    keyword_patterns = {}
    for section, keywords in section_keywords.items():
        # Create regex patterns that match keywords as whole key words in Title Case or UPPERCASE
        keyword_patterns[section] = [
            r'\b({})\b'.format(re.escape(kw)) for kw in keywords
        ]

    # Find all section matches
    all_matches = []
    for section, patterns in keyword_patterns.items():
        if not patterns:  # Skip Personal section
            continue

        for pattern in patterns:
            # Find all matches that are Title Case or UPPERCASE in the text
            matches = list(re.finditer(pattern, resume_text, re.IGNORECASE))
            matches = [
                match for match in matches
                if (resume_text[match.start():match.end()].istitle() or     # Match Title Case
                    resume_text[match.start():match.end()].isupper())       # Match UPPERCAS
            ]

            # Add matches to all_matches list with their position, section name, and matched text
            for match in matches:
                all_matches.append((match.start(), section, match.group()))

    # Sort matches by their position (kung ano order ng section sa orig resume, ganun rin order ng pag-save
    all_matches.sort(key=lambda x: x[0])

    def group_matches(text, match1, match2):
        """
        Determine if two matches should be grouped together based on word distance.
        Returns True if matches are within 5 words of each other.
        """
        start_pos = match1[0] + len(match1[2])  # End of first match
        end_pos = match2[0]  # Start of second match
        between_text = text[start_pos:end_pos].strip()

        # Count words between matches
        word_count = len(between_text.split())

        return word_count <= 5

    # Group nearby section keywords (within 5 words)
    grouped_matches = []
    current_group = []

    for i, match in enumerate(all_matches):
        if not current_group:
            current_group.append(match)
        else:
            # Check if current match should be grouped with previous match
            last_match = current_group[-1]
            if group_matches(resume_text, last_match, match):
                current_group.append(match)
            else:
                grouped_matches.append(current_group)
                current_group = [match]

    if current_group:
        grouped_matches.append(current_group)

    # Process each group of matches
    for i, group in enumerate(grouped_matches):
        # Get all unique sections in this group
        group_sections = list(set(match[1] for match in group))

        # Determine the text range for this group
        group_start = group[0][0]  # Start of first match in group
        if i + 1 < len(grouped_matches):
            group_end = grouped_matches[i + 1][0][0]  # Start of first match in next group
        else:
            group_end = len(resume_text)  # End of text if this is the last group

        # Extract section text
        section_text = resume_text[group_start:group_end].strip()

        # Remove all section keywords from the text
        for section in group_sections:
            for keyword in section_keywords[section]:
                section_text = re.sub(rf'\b{re.escape(keyword)}\b', '', section_text, flags=re.IGNORECASE)

        # Add the cleaned text to all sections in the group
        for section in group_sections:
            if section in sections:
                sections[section] += ' ' + section_text
            else:
                sections[section] = section_text

    # Process the "Personal" section separately
    if 'Personal' in sections:
        first_keyword_position = all_matches[0][0] if all_matches else len(resume_text)
        sections['Personal'] = resume_text[:first_keyword_position].strip() + ' ' + sections['Personal']

    # Clean up sections
    sections = {k: v.strip() for k, v in sections.items() if v.strip()}

    return sections

def calculate_position(section_text, entity_tuple, existing_positions=None):
    """
    Calculate the start and end position of a text within a section.
    Handles both string and tuple inputs for entity and avoids duplicate positions.

    Args:
        section_text (str): The full text of the section to search in
        entity_tuple (tuple or str): The entity to find, either as (text, label) tuple or string
        existing_positions (list): List of dictionaries containing existing start and end positions

    Returns:
        tuple: A tuple containing the start and end positions (start, end)
    """
    # Extract text from tuple
    text = entity_tuple[0] if isinstance(entity_tuple, tuple) else entity_tuple

    # Initialize variables
    current_pos = 0
    existing_positions = existing_positions or []

    while True:
        # Find the start position of the text in the section, starting from current_pos
        start_pos = section_text.find(text, current_pos)

        # If text is not found, return None
        if start_pos == -1:
            return None, None

        end_pos = start_pos + len(text)

        # Check for any type of overlap with existing positions
        has_overlap = False
        for pos in existing_positions:
            # Check all possible overlap scenarios:
            # 1. New position starts within an existing position
            # 2. New position ends within an existing position
            # 3. New position completely contains an existing position
            # 4. New position is completely contained within an existing position
            if (
                (start_pos >= pos["start_position"] and start_pos < pos["end_position"]) or  # Case 1
                (end_pos > pos["start_position"] and end_pos <= pos["end_position"]) or      # Case 2
                (start_pos <= pos["start_position"] and end_pos >= pos["end_position"]) or   # Case 3
                (start_pos >= pos["start_position"] and end_pos <= pos["end_position"])      # Case 4
            ):
                has_overlap = True
                break

        # If no overlap found, return the position
        if not has_overlap:
            return start_pos, end_pos

        # Move to search for next occurrence
        current_pos = start_pos + 1

def detect_dates(text):
    """
    Detect and process dates in text, handling both solo dates and date ranges.

    Args:
        text (str): Text to search for dates

    Returns:
        list: List of dictionaries containing date information
    """
    dates = []

    # Pattern for single date (mm/yyyy)
    solo_date_pattern = r'\b(0[1-9]|1[0-2])/([12][0-9]{3})\b'

    # Patterns for date ranges
    date_range_patterns = [
        r'(0[1-9]|1[0-2])/([12][0-9]{3})\s*[-–—‒−]\s*(0[1-9]|1[0-2])/([12][0-9]{3})',  # mm/yyyy with various dash types
        r'(0[1-9]|1[0-2])/([12][0-9]{3})\s*to\s*(0[1-9]|1[0-2])/([12][0-9]{3})',  # mm/yyyy to mm/yyyy
        r'(0[1-9]|1[0-2])/([12][0-9]{3})\s+(0[1-9]|1[0-2])/([12][0-9]{3})',  # mm/yyyy mm/yyyy
    ]

    # Function to convert date string to datetime object
    def to_datetime(date_str):
        return datetime.strptime(date_str, '%m/%Y')

    # Check if tama ang order ng start and end date, if mali, switch places.
    for pattern in date_range_patterns:
        for match in re.finditer(pattern, text):
            full_match = match.group(0)
            # Extract start and end dates
            dates_in_range = re.findall(solo_date_pattern, full_match)
            if len(dates_in_range) == 2:
                start_date = f"{dates_in_range[0][0]}/{dates_in_range[0][1]}"
                end_date = f"{dates_in_range[1][0]}/{dates_in_range[1][1]}"

                # Verify chronological order
                start_dt = to_datetime(start_date)
                end_dt = to_datetime(end_date)

                # Swap dates if start is newer than end
                if start_dt > end_dt:
                    start_date, end_date = end_date, start_date

                # Standardize format
                standardized_range = f"{start_date}-{end_date}"

                dates.append({
                    "type": "range",
                    "full_date": standardized_range,
                    "start_date": start_date,
                    "end_date": end_date,
                    "start_position": match.start(),
                    "end_position": match.end()
                })

    # Process solo dates
    # Exclude dates that are part of already detected ranges
    for match in re.finditer(solo_date_pattern, text):
        # Check if this date is part of any range we found
        is_in_range = any(
            date_dict["start_position"] <= match.start() <= date_dict["end_position"]
            for date_dict in dates
        )

        if not is_in_range:
            full_date = match.group(0)
            dates.append({
                "type": "solo",
                "full_date": full_date,
                "start_date": None,
                "end_date": full_date,
                "start_position": match.start(),
                "end_position": match.end()
            })

    return dates

def find_first_nearest_entity(target_position, entities_list, next_job_pos=None):
    """
    Find the nearest entity in both directions for first job title analysis.

    Args:
        target_position (int): Position to compare against
        entities_list (list): List of entities with their positions
        next_boundary (int): Position of the next job title (if any)

    Returns:
        dict: Nearest entity information or None if not found
    """
    nearest_entity = None
    min_distance = float('inf')

    for entity in entities_list:
        entity_pos = (entity['start_position'] + entity['end_position']) // 2

        # Skip entities that are past the next job title
        if next_job_pos and entity_pos > next_job_pos:
            continue

        distance = abs(entity_pos - target_position)

        if distance < min_distance:
            min_distance = distance
            nearest_entity = entity

    return nearest_entity

def find_nearest_entity_directional(target_position, entities_list, direction, next_job_pos=None):
    """
    Find the nearest entity based on position and specified direction.

    Args:
        target_position (int): Position to compare against
        entities_list (list): List of entities with their positions
        direction (str): Direction to look for entities ('left' or 'right')
        next_job_pos (int, optional): Position of next job title to check bounds

    Returns:
        dict: Nearest entity information or None if not found
    """
    nearest_entity = None
    min_distance = float('inf')

    # Iterate through the list of entities to find the nearest one in the specified direction.
    for entity in entities_list:
        entity_pos = (entity['start_position'] + entity['end_position']) // 2   # Calculate the midpoint of the entity's start and end positions

        # Skip entities not in the correct direction
        if direction == 'right' and entity_pos <= target_position:
            continue
        if direction == 'left' and entity_pos >= target_position:
            continue

        # Skip na yung entity na lagpas na sa next job_title.
        if next_job_pos and entity_pos > next_job_pos:
            continue

        # Calculate the distance between the current entity's position and the target position.
        distance = abs(entity_pos - target_position)
        if distance < min_distance:
            min_distance = distance
            nearest_entity = entity

    return nearest_entity

def get_section_entities(section_text, ner_function):
    """
    Generic function to process any section and extract entities with their positions.
    Handles tuple returns from NER functions.

    Args:
        section_text (str): The text content of the section
        ner_function (function): The NER function to use (either ner_experience or ner_education)

    Returns:
        tuple: Three dictionaries containing primary entities, secondary entities, and dates with their positions
        primary_entities = Job Title, Course, Certification
        secondary_entities = Company, School, Certification Providers
    """
    # Use the provided NER function to extract entities
    primary_entities, secondary_entities = ner_function(section_text)
    #print("\nRaw NER results:")
    #print("Primary entities:", primary_entities)
    #print("Secondary entities:", secondary_entities)

    # Normalize section_text
    def normalize_text(text):
        """
        Helper function to normalize text by standardizing hyphens and whitespace
        """
        # Replace newlines and multiple spaces with a single space
        text = re.sub(r'\s+', ' ', text)
        # Remove spaces around punctuation marks
        text = re.sub(r'\s*([,.!?;:\/\-_–—()\'"])\s*', r'\1', text)
        return text.strip()

    # Normalize section text
    normalized_section_text = normalize_text(section_text)

    # Normalize entities
    normalized_primary_entities = []
    for entity in primary_entities:
        if isinstance(entity, tuple):
            normalized_primary_entities.append((normalize_text(entity[0]), entity[1]))
        else:
            normalized_primary_entities.append(normalize_text(entity))

    normalized_secondary_entities = []
    for entity in secondary_entities:
        if isinstance(entity, tuple):
            normalized_secondary_entities.append((normalize_text(entity[0]), entity[1]))
        else:
            normalized_secondary_entities.append(normalize_text(entity))

    #print("\nNormalized Section Text: ", normalized_section_text)
    #print("Normalized Primary Entities: ", normalized_primary_entities)
    #print("Normalized Secondary Entities: ", normalized_secondary_entities)

    # Initialize dictionaries to store entities with positions
    primary_entity_dictionary = []
    secondary_entity_dictionary = []
    all_positions = []  # Track all positions across both entities

    # Process primary entities (job titles, courses, or certifications)
    for entity in normalized_primary_entities:
        # Get unique start and end positions
        start_pos, end_pos = calculate_position(normalized_section_text, entity, all_positions)

        if start_pos is not None:
            entity_text = entity[0] if isinstance(entity, tuple) else entity
            entity_text = clean_entity_text(entity_text)
            entry = {
                "entity": entity_text,
                "start_position": start_pos,
                "end_position": end_pos
            }
            primary_entity_dictionary.append(entry)
            all_positions.append(entry)

    # Process secondary entities (companies, schools, or providers)
    for entity in normalized_secondary_entities:
        start_pos, end_pos = calculate_position(normalized_section_text, entity, all_positions)

        if start_pos is not None:
            entity_text = entity[0] if isinstance(entity, tuple) else entity
            entity_text = clean_entity_text(entity_text)
            entry = {
                "entity": entity_text,
                "start_position": start_pos,
                "end_position": end_pos
            }
            secondary_entity_dictionary.append(entry)
            all_positions.append(entry)

    # Detect and process dates
    dates_dictionary = detect_dates(normalized_section_text)

    return primary_entity_dictionary, secondary_entity_dictionary, dates_dictionary, normalized_section_text


def determine_entity_directions(primary_entities, secondary_entities, dates):
    """
    Determine the direction of secondary entities and dates relative to primary entities
    by analyzing the positions of the first recognized entities in each list.

    Args:
        primary_entities (list): List of primary entities (e.g., job titles, courses)
        secondary_entities (list): List of secondary entities (e.g., companies, schools)
        dates (list): List of date entities

    Returns:
        tuple: (secondary_direction, date_direction, first_valid_index, first_secondary, first_date)
    """
    # Return None values if any essential list is empty
    if not primary_entities or not secondary_entities:
        return None, None, None, None, None

    # Get the first entities from each list
    first_primary = primary_entities[0]
    first_secondary = secondary_entities[0]

    # Calculate midpoint positions
    primary_pos = (first_primary['start_position'] + first_primary['end_position']) // 2
    secondary_pos = (first_secondary['start_position'] + first_secondary['end_position']) // 2

    # Determine secondary entity direction based on first entities
    secondary_direction = 'right' if secondary_pos > primary_pos else 'left'

    # Find nearest date to first primary entity
    nearest_date = find_first_nearest_entity(primary_pos, dates)

    if nearest_date:
        date_pos = (nearest_date['start_position'] + nearest_date['end_position']) // 2
        date_direction = 'right' if date_pos > primary_pos else 'left'
    else:
        date_direction = None

    return secondary_direction, date_direction, 0, first_secondary, nearest_date


def clean_entity_text(text):
    """
    Clean entity text by removing trailing dashes, em dashes, and hyphens.

    Args:
        text (str): The entity text to clean

    Returns:
        str: Cleaned entity text
    """
    # Replace all dashes, em dashes, and hyphens with spaces
    cleaned_text = re.sub(r'[-—–]+', ' ', text)
    # Trim any extra whitespace
    cleaned_text = cleaned_text.strip()
    return cleaned_text

def parse_section(section_text, primary_entities, secondary_entities, dates, section_type):
    """
    Generic parser to match primary entities with secondary entities and dates.
    Updated to use the first entities pattern matching approach.

    Args:
        section_text (str): Section text
        primary_entities (list): List of primary entities (job titles, courses, certifications)
        secondary_entities (list): List of secondary entities (companies, schools, providers)
        dates (list): List of date entities
        section_type (str): Type of section ('experience', 'education', 'certification')

    Returns:
        list: List of parsed entries with matched entities
    """
    parsed_entries = []

    # Sort entities by position
    primary_entities = sorted(primary_entities, key=lambda x: x['start_position'])
    secondary_entities = sorted(secondary_entities, key=lambda x: x['start_position'])

    if not primary_entities or not secondary_entities:
        return parsed_entries

    # Determine directions based on first entities
    secondary_direction, date_direction, _, _, _ = determine_entity_directions(
        primary_entities, secondary_entities, dates
    )

    if secondary_direction is None:
        return parsed_entries

    # Process each primary entity
    for i, primary in enumerate(primary_entities):
        primary_center = (primary['start_position'] + primary['end_position']) // 2
        next_primary_pos = primary_entities[i + 1]['start_position'] if i < len(primary_entities) - 1 else None

        # Find nearest secondary entity based on established direction pattern
        nearest_secondary = find_nearest_entity_directional(
            primary_center,
            secondary_entities,
            secondary_direction,
            next_primary_pos
        )

        # Find nearest date
        if date_direction:
            # Try to find date range first
            nearest_date_range = find_nearest_entity_directional(
                primary_center,
                [d for d in dates if d['type'] == 'range'],
                date_direction,
                next_primary_pos
            )

            # Fall back to solo date if no range found
            if not nearest_date_range:
                nearest_date = find_nearest_entity_directional(
                    primary_center,
                    [d for d in dates if d['type'] == 'solo'],
                    date_direction,
                    next_primary_pos
                )
            else:
                nearest_date = nearest_date_range
        else:
            nearest_date = None

        # Create entry if primary entity exists
        if primary:
            entry = {
                "primary_entity": primary.get('entity', None),
                "secondary_entity": nearest_secondary.get('entity', None) if nearest_secondary else None,
                "start_date": nearest_date.get('start_date', None) if nearest_date and nearest_date[
                    'type'] == 'range' else None,
                "end_date": nearest_date.get('end_date', None) if nearest_date else None,
                "verification_status": "none",
            }

            # Apply section-specific validation and key mapping
            if section_type == 'experience':
                if all([entry['primary_entity'], entry['secondary_entity']]):
                    entry['job_title'] = entry.pop('primary_entity')
                    entry['company'] = entry.pop('secondary_entity')
                    parsed_entries.append(entry)

            elif section_type == 'education':
                if all([entry['primary_entity'], entry['secondary_entity']]):
                    entry['course'] = entry.pop('primary_entity')
                    entry['school'] = entry.pop('secondary_entity')
                    parsed_entries.append(entry)

            elif section_type == 'certification':
                if entry['primary_entity']:
                    entry['certification'] = entry.pop('primary_entity')
                    entry['provider'] = entry.pop('secondary_entity')
                    parsed_entries.append(entry)

    return parsed_entries

def parse_resume(resume_text, skills_preferences):
    """
    Main function to parse resume and extract entities from both experience and education sections.
    """

    # Initialize variables with default empty values
    experiences = []
    education = []
    certifications = []
    skills = {}

    # Extract + Clean + Standardize Dates
    # resume_text = extract_document()
    print("\n==================RESUME TEXT=======================:\n", resume_text)

    # Divide into sections
    divided_sections = divide_section(resume_text)
    #print("\nAFTER DIVIDE SECTIONS: ", divided_sections)

    # Print divided sections
    print("\n================== RESUME SECTIONS =========================")
    for section, content in divided_sections.items():
        print(f"\n{section}:\n{content}\n{'=' * 30}")


    # Process Experience Section
    if 'Experience' in divided_sections:
        #print("\n=== EXTRACTED ENTITIES FROM EXPERIENCE SECTION ===")
        job_titles_dict, companies_dict, dates_dict, divided_sections['Experience'] = get_section_entities(
            divided_sections['Experience'],
            ner_experience
        )

        '''
        # Print extracted experience entities
        print("\nExtracted Job Titles with Positions:")
        for item in job_titles_dict:
            print(f"Entity: {item['entity']}")
            print(f"Position: {item['start_position']} to {item['end_position']}")

        print("\nExtracted Companies with Positions:")
        for item in companies_dict:
            print(f"Entity: {item['entity']}")
            print(f"Position: {item['start_position']} to {item['end_position']}")
        '''

        # Parse experiences
        experiences = parse_section(
            divided_sections['Experience'],
            job_titles_dict,
            companies_dict,
            dates_dict,
            'experience'
        )

        # Print parsed experiences
        print("\n============================= PARSED EXPERIENCES ========================================")
        for exp in experiences:
            print(f"\nJob Title: {exp['job_title']}")
            print(f"Company: {exp['company']}")
            print(f"Period: {exp['start_date']} to {exp['end_date']}")
            print(f"Verification Status: {exp['verification_status']}")

    # Process Education Section
    if 'Education' in divided_sections:
        #print("\n=== EXTRACTED ENTITIES FROM EDUCATION SECTION ===")
        courses_dict, schools_dict, dates_dict, divided_sections['Education'] = get_section_entities(
            divided_sections['Education'],
            ner_education
        )

        '''
        # Print extracted education entities
        print("\nExtracted Courses with Positions:")
        for item in courses_dict:
            print(f"Entity: {item['entity']}")
            print(f"Position: {item['start_position']} to {item['end_position']}")

        print("\nExtracted Schools with Positions:")
        for item in schools_dict:
            print(f"Entity: {item['entity']}")
            print(f"Position: {item['start_position']} to {item['end_position']}")
        '''

        # Parse education
        education = parse_section(
            divided_sections['Education'],
            courses_dict,
            schools_dict,
            dates_dict,
            'education'
        )

        # Print parsed education
        print("\n================================== PARSED EDUCATION ======================================")
        for edu in education:
            print(f"\nCourse: {edu['course']}")
            print(f"School: {edu['school']}")
            print(f"Period: {edu['start_date']} to {edu['end_date']}")
            print(f"Verification Status: {edu['verification_status']}")

    # Process Certification Section
    if 'Certification' in divided_sections:
        #print("\n=== EXTRACTED ENTITIES FROM CERTIFICATION SECTION ===")
        certifications_dict, providers_dict, dates_dict, divided_sections['Certification'] = get_section_entities(
            divided_sections['Certification'],
            ner_certification
        )

        '''
        # Print extracted certification entities
        print("\nExtracted Certifications with Positions:")
        for item in certifications_dict:
            print(f"Entity: {item['entity']}")
            print(f"Position: {item['start_position']} to {item['end_position']}")

        print("\nExtracted Providers with Positions:")
        for item in providers_dict:
            print(f"Entity: {item['entity']}")
            print(f"Position: {item['start_position']} to {item['end_position']}")
        '''

        # Parse certifications
        certifications = parse_section(
            divided_sections['Certification'],
            certifications_dict,
            providers_dict,
            dates_dict,
            'certification'
        )

        # Print parsed certifications
        print("\n============================= PARSED CERTIFICATIONS ===========================")
        for cert in certifications:
            print(f"\nCertification: {cert['certification']}")
            #print(f"Provider: {cert['provider']}")
            print(f"Period: {cert['start_date']} to {cert['end_date']}")
            print(f"Verification Status: {cert['verification_status']}")

    # Parse Skills
    skills = parse_skills(skills_preferences, resume_text)
    # Print parsed Skills

    print("\n=================================== PARSED SKILLS ===========================================")
    for skill_category, skill_list in skills.items():
        print(f"{skill_category}:")
        for skill, count in skill_list.items():
            print(f"  {skill}: {count}")

    return experiences, education, certifications, skills


if __name__ == "__main__":
    # Sample resume text for an IT applicant
    resume_text = """
    JOHN DOE
    Software Engineer
    Email: john.doe@email.com
    Phone: (123) 456-7890

    PROFESSIONAL EXPERIENCE
    Senior Software Engineer
    Acme Technologies
    03/2020-12/2023
    - Led development of microservices architecture
    - Managed team of 5 developers
    - Developed applications using Python and Java
    - Implemented AWS cloud solutions

    Software Developer
    TechCorp Solutions
    06/2017-02/2020
    - Developed web applications using React and Node.js
    - Implemented CI/CD pipelines
    - Managed MySQL and MongoDB databases
    - Used Docker and Kubernetes for containerization

    EDUCATION
    Bachelor of Science in Computer Science
    University of Technology
    08/2013-05/2017
    - Major in Software Engineering
    - Minor in Data Science

    CERTIFICATIONS
    AWS Certified Solutions Architect- Professional — August 2022
    Google Cloud Professional Cloud Architect — November 2021
    Certified Kubernetes Administrator (CKA) — April 2021

    SKILLS
    - Programming Languages: Python, Java, JavaScript
    - Web Technologies: React, Node.js, Angular
    - Databases: MySQL, MongoDB, PostgreSQL
    - Cloud: AWS, Google Cloud, Azure
    - Tools: Docker, Kubernetes, Jenkins, Git
    - Methodologies: Agile, Scrum, DevOps
    """

    # Sample skills preferences dictionary with sets
    skills_preferences = {
        "primary_skills": {
            "Python", "Java", "JavaScript", "AWS", "Docker", "Kubernetes",
            "React", "Node.js", "MySQL", "MongoDB"
        },
        "secondary_skills": {
            "Angular", "PostgreSQL", "Google Cloud", "Azure", "Jenkins",
            "Git", "CI/CD", "Microservices"
        },
        "additional_skills": {
            "Agile", "Scrum", "DevOps", "REST API", "HTML", "CSS",
            "Linux", "Shell Scripting"
        }
    }

    # Call parse_resume function with the sample data
    experiences, education, certifications, skills = parse_resume(resume_text, skills_preferences)

    # Print the results
    print("\nPARSED RESULTS:")

    print("\nEXPERIENCE:")
    for exp in experiences:
        print(f"\nJob Title: {exp['job_title']}")
        print(f"Company: {exp['company']}")
        print(f"Duration: {exp['start_date']} to {exp['end_date']}")
        print(f"Verification Status: {exp['verification_status']}")

    print("\nEDUCATION:")
    for edu in education:
        print(f"\nCourse: {edu['course']}")
        print(f"School: {edu['school']}")
        print(f"Duration: {edu['start_date']} to {edu['end_date']}")
        print(f"Verification Status: {edu['verification_status']}")

    print("\nCERTIFICATIONS:")
    for cert in certifications:
        print(f"\nCertification: {cert['certification']}")
        print(f"Provider: {cert['provider']}")
        print(f"Date: {cert['start_date']} to {cert['end_date']}")
        print(f"Verification Status: {cert['verification_status']}")

    print("\nPARSED SKILLS")
    for category, skills_dict in skills.items():
        print(f"\n{category.upper()}:")
        for skill, count in skills_dict.items():
            print(f"  {skill}: {count}")
