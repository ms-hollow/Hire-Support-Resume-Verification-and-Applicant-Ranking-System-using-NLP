import threading
import logging
from django.db import close_old_connections

import os
import shutil
from django.db import close_old_connections

logger = logging.getLogger(__name__)

def process_application_async(job_application_id):
    """Process a job application asynchronously"""
    import shutil
    
    # Import here to avoid circular imports
    from .models import JobApplication
    from main_model.utils.file_processors import extract_hiring_settings, extract_application_data
    from main_model.hire_support import process_application
    
    temp_dir = None
    
    try:
        # Always close connections when running in a separate thread
        close_old_connections()
        
        # Get the application
        job_application = JobApplication.objects.get(job_application_id=job_application_id)
        
        # Set status to processing
        job_application.application_status = 'processing'
        job_application.save()
        
        print(f"Starting async processing for application ID: {job_application_id}")
        
        # Extract data
        hiring_settings = extract_hiring_settings(job_application.job_hiring)
        application_data = extract_application_data(job_application)
        
        # Save temp dir for cleanup
        if '_temp_dir' in application_data:
            temp_dir = application_data.pop('_temp_dir')
        
        # Process application
        scores, verification_result = process_application(hiring_settings, application_data)
        
        # Update with results
        job_application.scores = scores
        job_application.verification_result = verification_result
        job_application.application_status = 'processed'
        job_application.save()
        
        print(f"Async processing completed for application ID: {job_application_id}")
        
    except Exception as e:
        print(f"Error in async processing for ID {job_application_id}: {str(e)}")
        
        # Try to update status if possible
        try:
            job_application = JobApplication.objects.get(job_application_id=job_application_id)
            job_application.application_status = 'error'
            job_application.save()
        except Exception:
            pass
    
    finally:
        # Clean up temporary directory if it exists
        if temp_dir and os.path.exists(temp_dir):
            try:
                shutil.rmtree(temp_dir)
            except Exception as e:
                print(f"Error cleaning up temporary directory: {str(e)}")

def run_in_background(job_application_id):
    """Start background processing in a separate thread"""
    thread = threading.Thread(target=process_application_async, args=(job_application_id,))
    thread.daemon = True  # Thread will die when main process exits
    thread.start()
    return thread