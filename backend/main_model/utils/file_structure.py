# utils/file_structure.py

import os
import json
from django.conf import settings

def ensure_directory_exists(path):
    """Create directory if it doesn't exist"""
    os.makedirs(path, exist_ok=True)
    return path

def get_job_hiring_dir(job_hiring_id):
    """Get the job hiring directory path and ensure it exists"""
    dir_path = os.path.join(settings.MEDIA_ROOT, 'job_hirings', f'job_hiring_{job_hiring_id}')
    return ensure_directory_exists(dir_path)

def get_applications_dir(job_hiring_id):
    """Get the applications directory path and ensure it exists"""
    dir_path = os.path.join(get_job_hiring_dir(job_hiring_id), 'applications')
    return ensure_directory_exists(dir_path)

def get_applicant_dir(job_hiring_id, applicant_id):
    """Get the applicant directory path and ensure it exists"""
    dir_path = os.path.join(get_applications_dir(job_hiring_id), f'applicant_{applicant_id}')
    return ensure_directory_exists(dir_path)

def get_document_type_dir(job_hiring_id, applicant_id, document_type):
    """Get document type directory path and ensure it exists"""
    document_type = document_type.lower()
    dir_path = os.path.join(get_applicant_dir(job_hiring_id, applicant_id), 'documents', document_type)
    return ensure_directory_exists(dir_path)