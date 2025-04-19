
# For PymuPDF
import fitz  # PymuPDF
from docx import Document  # for document files
import os # for manipulating file paths
import re # for regex
#from fontTools.ufoLib import pngSignature
from multi_column import column_boxes # imports 'multi_column' module which detects columns

#For Pytesseract
import pytesseract
import textseg as ts
from PyPDF2 import PdfReader
from pdf2image import convert_from_path
import cv2
import json
import pandas as pd
from docx2pdf import convert
from PIL import Image
import glob
import os
import re
from collections import defaultdict
import spacy

from date_standardizer import date_standardizer


# Classes for extracting Resume (Pymu and Pytesseract)

class PymuExtractor:
    def __init__(self):
        pass

    # Determine the file format and call the corresponding extractor
    def _extract_text(self, file_path):
        file_extension = os.path.splitext(file_path)[1].lower()

        if file_extension == '.pdf':
            return self._extract_from_pdf(file_path)
        elif file_extension in ['.docx', '.doc']:
            return self._extract_from_docx(file_path)
        else:
            raise ValueError(f"Unsupported file format: {file_extension}")

    # Extract text from PDF, recognizing columns dynamically.
    def _extract_from_pdf(self, pdf_path, visualize=False):
        doc = fitz.open(pdf_path)
        extracted_text = {}

        for page in doc:
            # Get the column boxes for this page
            bboxes = column_boxes(page, footer_margin=30, header_margin=30, no_image_text=True, left_margin=5)

            if visualize:
                # Draw rectangles for each detected column
                for rect in bboxes:
                    page.draw_rect(rect, color=(1, 0, 0), width=2)  # Red rectangle

            page_text = []
            for rect in bboxes:
                column_text = page.get_text(clip=rect, sort=True)
                page_text.append(column_text.strip())
            extracted_text[f"Page {page.number + 1}"] = "\n".join(page_text)

        if visualize:
            # Save the modified PDF with visualized columns
            output_path = pdf_path.replace('.pdf', '_visualized.pdf')
            doc.save(output_path, garbage=4)
            doc.close()
            print(f"Visualized PDF saved as: {output_path}")

        return extracted_text

    # Extract text from Word document.
    def _extract_from_docx(self, docx_path):
        doc = Document(docx_path)
        text = ""

        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"

        # Return a dictionary format to match PDF extraction
        return {"Page 1": text.strip()}

    def _validate_resume(self, resume_text):
        if len(resume_text) >= 800 and any(
                keyword in resume_text.lower() for keyword in
                ["contacts", "details", "profile", "skills", "experiences", "experience", "education", "projects", "trainings", "workshop", "seminar", "employment", "work history", "certifications", "references", "internships", "employment history", "history", "courses", "accomplishments", "achievements", "certificates", "hobbies", "interests"]):
            print("Extraction successful with PyMuPDF.")
            return True
        else:
            print("Pymu Extraction insufficient, using OCR.")
            return False

class PytesseractExtractor:

    def __init__(self, document_path):
        # Load spaCy model
        nlp = spacy.load("en_core_web_sm")

        # Define resume path (now accepting multiple file types)
        self.resumes = glob.glob(document_path)

        # Define the path to write output files: picture ng resume with bounding box
        self.path_to_write = r'backend/main_model/Output/'

        # Initialize data structures to store results
        self.data = pd.DataFrame()
        self.final_name_list = []  # Stores the names of the resumes being processed
        self.final_text_opencv = []  # Stores the list of dictionaries of text regions extracted from each page of the resume.
        self.final_text_tesseract = []  # Stores the text extracted using Tesseract OCR

    # Converts the document to image/s
    def _convert_to_images(self, file_path):
        file_extension = os.path.splitext(file_path)[1].lower()
        images = []

        # Handle different file types
        if file_extension == '.pdf':
            images = convert_from_path(file_path)
        elif file_extension in ['.jpg', '.jpeg', '.png']:
            images = [Image.open(file_path)]
        else:
            print(f"Unsupported file format: {file_extension}")
            return []

        # Ensure all images are in RGB format (convert if needed)
        for i in range(len(images)):
            if images[i].mode == "RGBA":
                images[i] = images[i].convert("RGB")

        return images

    # Function that converts a document to an image, and extract its text using Tesseract OCR
    def _extract_document(self):
        for resume_path in self.resumes:
            # Extracts the file name from the resume path
            fname = os.path.basename(resume_path)
            print(f"Processing: {fname}")

            # Convert document to images
            images = self._convert_to_images(resume_path)
            if not images:
                print("file not supported.\n")
                continue

            resumes_img = []
            # Save each page as a separate JPEG image
            for j, image in enumerate(images):
                    image_path = os.path.join(self.path_to_write, f"{os.path.splitext(fname)[0]}_{j}.jpg")
                    image.save(image_path, 'JPEG')
                    resumes_img.append(image_path)

            # Initialize variables for current document
            name_list = f"{os.path.splitext(fname)[0]}_.jpg"
            text_opencv = []
            text_tesseract = []

            # Process each page image
            for img_path in resumes_img:
                frame = cv2.imread(img_path)
                os.remove(img_path)
                img = os.path.basename(img_path)

                output_img, label, dilate, c_dict, df1, split_img = ts.get_text_seg(frame, img)
                cv2.imwrite(os.path.join(self.path_to_write, f"{os.path.splitext(img)[0]}.png"), output_img)

                # print the visualization
                for i, split in enumerate(split_img):
                    if i == '0' and not '00':
                        cv2.imwrite(os.path.join(self.path_to_write, f"{os.path.splitext(img)[0]}{i}.png"), split)
                        break

                text_opencv.append(c_dict)              # Store OpenCV text extraction results

            # Join all extracted text with proper spacing
            tesseract_str = '\n\n'.join(filter(None, text_tesseract))

            # Store results for current document
            self.final_name_list.append(name_list)
            self.final_text_opencv.append(text_opencv)
            self.final_text_tesseract.append(tesseract_str)

        # Convert the OpenCV text to string format while preserving structure
        for i, text_opencv in enumerate(self.final_text_opencv):
            text_parts = []
            for page_dict in text_opencv:
                if isinstance(page_dict, str):
                    text_parts.append(page_dict)
                else:
                    # Join text regions with newlines
                    text_parts.append('\n'.join(page_dict.values()))
            self.final_text_opencv[i] = '\n\n'.join(text_parts)

        return self.final_text_opencv

def perform_pymu(document_path):
    extractor1 = PymuExtractor()
    file_extension = os.path.splitext(document_path)[1].lower()

    extracted_text = extractor1._extract_text(document_path)
    cleaned_text = '\n'.join(extracted_text.values())

    cleaned_text = clean_text(cleaned_text)

    if not extractor1._validate_resume(cleaned_text) and file_extension not in ['.docx', '.doc']:
        cleaned_text = perform_pytesseract(document_path)

    return cleaned_text

def perform_pytesseract(document_path):
    extractor2 = PytesseractExtractor(document_path)
    extracted_text = extractor2._extract_document()

    # Join all extracted text with newlines and clean it as a whole
    cleaned_text = '\n'.join(extracted_text)
    cleaned_text = clean_text(cleaned_text)

    return cleaned_text

def expand_abbreviations(cleaned_text, abbreviations):
    def replace_func(match):
        matched_text = match.group(0)
        if matched_text.isupper():  # Replace only if matched text is fully uppercase
            return abbreviations[match.re.pattern]
        return matched_text

    for abbr, expansion in abbreviations.items():
        pattern = re.compile(abbr, flags=re.IGNORECASE)
        cleaned_text = pattern.sub(replace_func, cleaned_text)
    return cleaned_text

def clean_text(text):
    stopwords = {
        'my', 'myself', 'we', 'ours', 'us',  # Generic Pronouns
        'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being',  # Weak Verbs and Auxiliary Words
        'have', 'has', 'had', 'do', 'does', 'did',
        'but', 'or', 'as', 'that', 'which', 'who', 'whom',  # Conjunction and Connecting Words
        'able', 'various', 'using',  # Generic Descriptors
        'responsible', 'involved', 'worked'  # Generic Professional Terms
    }

    abbreviations = {
        r'\bBS\b': 'Bachelor of Science',
        r'\bBA\b': 'Bachelor of Arts',
        r'\bAB\b': 'Bachelor of Arts',
        r'\bMS\b': 'Master of Science',
        r'\bMA\b': 'Master of Arts',
        r'\bPhD\b': 'Doctor of Philosophy',
        r'\bHUMSS\b': 'Humanities and Social Sciences',
        r'\bSTEM\b': 'Science Technology and Mathematics',
        r'\bABM\b': 'Accountancy and Business Management',
        r'\bTVL\b': 'Technical Vocational Livelihood',
        r'\bGAS\b': 'General Academic Strand'

    }

    special_chars = {'¢', '©', '*', '●', '○', '◦', '▪', '▫', '→'}

    # Split the text into lines while preserving empty lines
    lines = text.splitlines()
    cleaned_lines = []

    for line in lines:
        if not line.strip():  # Preserve empty lines
            cleaned_lines.append('')
            continue

        # Remove extra spaces within the line
        cleaned_text = ' '.join(line.split())

        # Remove double or more spaces
        cleaned_text = re.sub(r'\s{2,}', ' ', cleaned_text)

        # Replace commas inside words with spaces
        cleaned_text = re.sub(r'(\w+),(\w+)', r'\1 \2', cleaned_text)

        # Expand abbreviations
        cleaned_text = expand_abbreviations(cleaned_text, abbreviations)

        # Remove single letters separated by spaces
        cleaned_text = re.sub(r'(?:(?:\b[A-Za-z]\b\s+)+[A-Za-z]\b)', '', cleaned_text)

        # Convert all-uppercase words to title case
        cleaned_text = ' '.join(
            word.capitalize() if word.isupper() and len(word) >= 5 else word
            for word in cleaned_text.split()
        )

        cleaned_text = re.sub(r'\s+e\s+', ' , ', cleaned_text)

        # Remove punctuations including all types of apostrophes
        cleaned_text = re.sub(r'[.!?"\'‘’‛`´′‵(){}\[\]@%^*$|]', '', cleaned_text)

        # Remove special characters
        for char in special_chars:
            cleaned_text = cleaned_text.replace(char, '')

        # Remove stopwords while preserving case
        words = cleaned_text.split()
        cleaned_words = [
            word for word in words
            if word.lower() not in stopwords
        ]
        cleaned_text = ' '.join(cleaned_words)

        # Skip lines that only contain 1-2 characters/symbols after cleaning before appending the line
        cleaned_text = cleaned_text.strip()
        if cleaned_text and len(cleaned_text.replace(' ', '')) > 2:
            cleaned_lines.append(cleaned_text)

    # Join lines and handle multiple newlines
    joined_text = '\n'.join(cleaned_lines)

    # Replace multiple newlines with a single newline
    cleaned_text = re.sub(r'\n\s*\n', '\n', joined_text)

    return cleaned_text

def extract_documents(resume, experience_documents, educational_documents, certification_documents):
    """
    Extract text from multiple document types and store in separate lists

    Args:
        resume (str): Path to single resume file
        experience_documents (list): List of paths to experience documents
        educational_documents (list): List of paths to education documents
        certification_documents (list): List of paths to certification documents
    """

    # Initialize the dictionary
    extracted_data = {
        "resume": None,        # Store the resume text as a single string
        "experiences": [],      # List for experience document texts
        "education": [],       # List for educational document texts
        "certifications": []   # List for certification document texts
    }

    # Process and store the resume
    if resume.endswith(('.jpeg', '.jpg', '.png')):
        extracted_data["resume"] = date_standardizer(perform_pytesseract(resume))
    elif resume.endswith(('.pdf', '.docx', '.doc')):
        extracted_data["resume"] = date_standardizer(perform_pymu(resume))
    else:
        print(f"Invalid resume format: {resume}")
        extracted_data["resume"] = ""

    # Helper function to process documents
    def process_documents(document_list, key):
        """
        Process a list of documents and store their text in the corresponding dictionary key.
        Args:
            document_list (list): List of document paths to process.
            key (str): Key in the dictionary to store extracted text.
        """
        for doc_path in document_list:
            if doc_path.endswith(('.jpeg', '.jpg', '.png', '.pdf', '.docx', '.doc')):
                text = date_standardizer(perform_pytesseract(doc_path))
                extracted_data[key].append(text)  # Append text to the appropriate key's list
            else:
                print(f"Invalid format: {doc_path}")

    # Process and store texts for each category
    process_documents(experience_documents, "experiences")
    process_documents(educational_documents, "education")
    process_documents(certification_documents, "certifications")

    # Return the dictionary
    return extracted_data

if __name__ == "__main__":
    import os
    from pathlib import Path

    # Ask the user if the input is a single document or a folder
    input_type = input(
        "Is the input a single document or a folder? (Enter 'D' for document or 'F' for folder): ").strip().upper()

    # Ask the user if the files are resumes or supporting documents
    file_type = input("Are the files Resumes ('R') or Supporting Documents ('S')? (Enter 'R' or 'S'): ").strip().upper()

    # Get the input path
    input_path = input("Enter the path to the document or folder: ").strip()

    # Get the output path
    output_path = input("Enter the output folder path: ").strip()

    # Ensure the output directory exists
    os.makedirs(output_path, exist_ok=True)

    # Initialize a list to store paths of documents to process
    documents = []

    # Process the input based on type
    if input_type == 'D':  # Single document
        documents = [input_path]
    elif input_type == 'F':  # Folder
        for root, _, files in os.walk(input_path):
            for file in files:
                # Add each file's full path to the list
                documents.append(os.path.join(root, file))
    else:
        print("Invalid input type. Please enter 'D' for document or 'F' for folder.")
        exit()

    # Iterate through each document in the list
    for doc_path in documents:
        final_cleaned_text = ''

        # Process based on file type and file extension
        if file_type == 'R' and doc_path.endswith(('.jpeg', '.jpg', '.png')):
            final_cleaned_text = perform_pytesseract(doc_path)
        elif file_type == 'R' and doc_path.endswith(('.pdf', '.docx', '.doc')):
            final_cleaned_text = perform_pymu(doc_path)
        elif file_type == 'S' and doc_path.endswith(('.pdf', '.docx', '.doc', '.jpeg', '.jpg', '.png')):
            final_cleaned_text = perform_pytesseract(doc_path)
            print(final_cleaned_text)
        else:
            print(f"Invalid format: {doc_path}")
            continue

        final_cleaned_text = date_standardizer(final_cleaned_text)

        # Get the name of the file without the extension
        file_name = Path(doc_path).stem
        # Generate the output file name with "_extracted" appended
        output_file = os.path.join(output_path, f"{file_name}_extracted.txt")

        # Save the processed text to the output file
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(final_cleaned_text)
        print(f"Processed text saved to: {output_file}")

        print(final_cleaned_text)

    print("Processing complete!")

''' FOR ONE DOCUMENT ONLY:
if __name__ == "__main__":
    document = r['Resume Sample/Appcon Resume/Alcantara, John Paulo C. - Resume.pdf']
    type = "R" #'R'- Resume ; 'S'- Supporting

    final_cleaned_text = ''

    # Iterate through each document in the list
    for doc_path in document:
        # Check if the document is of a valid image format (jpeg or png)
        if doc_path.endswith(('.jpeg', '.jpg', '.png')) and type == 'R':
            final_cleaned_text = perform_pytesseract(doc_path)

        # Check if the document is of a valid document format (pdf, docx, or doc)
        elif doc_path.endswith(('.pdf', '.docx', '.doc')) and type == 'R':
            final_cleaned_text = perform_pymu(doc_path)

        # Check if valid document format and a supporting document
        elif doc_path.endswith(('.pdf', '.docx', '.doc', '.jpeg', '.jpg', '.png')) and type == 'S':
            final_cleaned_text = perform_pytesseract(doc_path)

        else:
            print(f"Invalid format: {doc_path}")

    print("Cleaned text: ", final_cleaned_text)

    final_cleaned_text = date_standardizer(final_cleaned_text)
'''