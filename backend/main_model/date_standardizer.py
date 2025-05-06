from datetime import datetime
import re

class DateStandardizer:
    def __init__(self):
        self.month_names = {
            'january': '01', 'jan': '01',
            'february': '02', 'feb': '02',
            'march': '03', 'mar': '03',
            'april': '04', 'apr': '04',
            'may': '05',
            'june': '06', 'jun': '06',
            'july': '07', 'jul': '07',
            'august': '08', 'aug': '08',
            'september': '09', 'sep': '09',
            'october': '10', 'oct': '10',
            'november': '11', 'nov': '11',
            'december': '12', 'dec': '12'
        }

        self.ordinal_suffixes = r'(?:st|nd|rd|th)'

        self.patterns = [
            # Existing mm/yyyy format - this will be preserved
            r'\b(?P<preserve>(?:0[1-9]|1[0-2])/\d{4})\b',

            # Full month name + year, optional day (e.g., "January 2021", "25 January 2021")
            r'\b(?P<month>(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?))[-\s]*(?:(?P<day>\d{1,2})[-\s,]*)?(?P<year>\d{2,4})\b',

            # Numeric date formats (e.g., "12/-25/-2021", "2021/-12/-25")
            r'\b(?P<month>\d{1,2})(?:[-/](?P<day>\d{1,2}))?(?:[-/])(?P<year>\d{2,4})\b',
            r'\b(?P<year>\d{4})[-/](?P<month>\d{1,2})(?:[-/](?P<day>\d{1,2}))?\b',

            # Day Month Year (e.g., "25 Dec 2021", "8 Sep 2020")
            r'\b(?P<day>\d{1,2})\s+(?P<month>(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?))\s+(?P<year>\d{2,4})\b',

            # Day-Month-Year with hyphen (e.g., "25-Dec-2021")
            r'\b(?P<day>\d{1,2})-(?P<month>(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))-(?P<year>\d{2,4})\b',

            # Month Day, Year (e.g., "December 25, 2021", or with or without space or comma)
            r'\b(?P<month>(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?))\s*(?P<day>\d{1,2})[,\s]*(?P<year>\d{2,4})\b',

            # ISO 8601 Date Format (e.g., "2021-12-25")
            r'\b(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})\b',

            # Month-Year (e.g., "December-2020", "May-2019")
            r'\b(?P<month>(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))-(?P<year>\d{4})\b',

            # Just Year (e.g., "2021")
            r'\b(?P<year>\d{4})\b'

        ]

    def _standardize_date(self, match):
        """Convert a regex match to standardized date format."""
        groups = match.groupdict()

        # If the match is already in mm/yyyy format, return it as is
        if groups.get('preserve'):
            return groups['preserve']

        year = groups.get('year')

        # Convert 2-digit year to 4-digit format
        if year and len(year) == 2:
            year = f"20{year}"

        # Get current year for validation
        current_year = datetime.now().year

        # Check if the match is just a year and validate the year
        if year:
            year = int(year)  # Convert year to integer for comparison
            if year < 1900 or year > current_year:
                return ""

        # Converts textual months to digits, if no month, default to '01'
        month = groups.get('month', '01')
        if month.lower() in self.month_names:
            month = self.month_names[month.lower()]
        month = month.zfill(2)

        # If the match already has the format mm/yyyy, return it without modification
        if groups.get('day') is None:
            return f"{month}/{year}"

        # If the year was valid or only year was given, return standardized date
        return f"{month}/{year}"

    def _process_text(self, text):
        """Process text to standardize dates while preserving original text structure."""
        if not text:
            return text

        processed_text = text
        positions = []  # Store positions and replacements

        # Handle "present" case first
        if any(keyword in text.lower() for keyword in
               ["present", "current", "ongoing", "on going", "till date", "to date"]):
            current_date = datetime.now()
            formatted_current = f"{current_date.month:02d}/{current_date.year}"
            # Replace all keywords with the formatted current date
            processed_text = re.sub(
                r'\b(present|current|ongoing|on going|till date|to date)\b',
                formatted_current,
                processed_text,
                flags=re.IGNORECASE
            )

        # Process each pattern
        for pattern in self.patterns:
            matches = list(re.finditer(pattern, text, re.IGNORECASE))
            for match in matches:
                start, end = match.span()
                groups = match.groupdict()  # Get the groups from the match

                # Check if this position overlaps with any previous matches
                overlap = False
                for pos in positions:
                    if start < pos[1] and end > pos[0]:
                        overlap = True
                        break

                if not overlap:
                    original_date = match.group()
                    standardized_date = self._standardize_date(match)

                    # Only process if we have a valid standardized date and it's not already preserved
                    if standardized_date and not groups.get('preserve'):
                        positions.append((start, end, standardized_date))

        # Apply replacements in reverse order to maintain correct positions
        for start, end, replacement in sorted(positions, reverse=True):
            processed_text = processed_text[:start] + replacement + processed_text[end:]

        return processed_text

def extract_dates(text):
    # Regex pattern for 'mm/yyyy' format only
    date_pattern = r'\b\d{2}/\d{4}\b'

    # Find all dates in the text
    dates = re.findall(date_pattern, text)

    result = []
    for date in dates:
            result.append(date)

    return result

def process_and_save_results(text):
    standardizer = DateStandardizer()
    results = []

    #print("\nDate Standardization Results:")
   # print("=" * 40)

    # Process each line
    processed_text = standardizer._process_text(text)
    results.append(processed_text)

    return results


def read_text_file(file_path):
    """Read text from file and return list of non-empty lines."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return [line.strip() for line in file if line.strip()]
    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found.")
        return []
    except Exception as e:
        print(f"Error reading file: {str(e)}")
        return []


def date_standardizer(text_input):
    results = process_and_save_results(text_input)

    if results:
        # for result in results:
            # print(result)

        dates = []
        for processed_text in results:
            dates.extend(extract_dates(processed_text))
        #print(dates)

    return results[0] if results else ""