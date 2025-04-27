import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from threading import Lock
from googleapiclient.http import MediaIoBaseDownload

SERVICE_ACCOUNT_FILE = 'hiresupport-3da67b24496a.json'
SCOPES = ['https://www.googleapis.com/auth/drive']
folder_creation_lock = Lock()  # Lock to prevent concurrent folder creation

# Authenticate the service account
def authenticate_service_account():
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    service = build('drive', 'v3', credentials=credentials)
    return service

# Retrieve the list of files saved on the drive
def list_google_drive_files():
    service = authenticate_service_account()

    # Call the Drive API to list files
    results = service.files().list(pageSize=10, fields="files(id, name)").execute()
    files = results.get('files', [])

    if not files:
        return {"files": []}
    else:
        return {
            "files": [{"name": file["name"], "id": file["id"]} for file in files]
        }

# Helper function to create Applicant folder
def create_applicant_folder(applicant_name, parent_folder_id):
    """
    :param applicant_name: Name of the applicant
    :param parent_folder_id: ID of the top-level folder
    :return: the folder ID of the applicant's folder
    """
    normalized_name = applicant_name.strip()  
    service = authenticate_service_account()

    with folder_creation_lock:  # Prevent concurrent folder creation
        query = f"'{parent_folder_id}' in parents and name = '{normalized_name}' and mimeType = 'application/vnd.google-apps.folder'"
        results = service.files().list(q=query, fields="files(id, name)").execute()
        folders = results.get('files', [])

        if folders:
            print(f"Existing folder found: {folders[0]['name']} (ID: {folders[0]['id']})")
            return folders[0]['id']

        print(f"Creating new folder for applicant: {normalized_name}")
        folder_metadata = {
            "name": normalized_name,
            "mimeType": "application/vnd.google-apps.folder",
            "parents": [parent_folder_id]
        }
        folder = service.files().create(body=folder_metadata, fields="id").execute()

        return folder.get("id")

# Upload a file to the applicant's folder in Google Drive
def upload_file_to_applicant_folder(file_path, file_name, mimetype, parent_folder_id):
    """
    :param file_path: The local path of the file to upload
    :param file_name: The name of the file in Google Drive
    :param mimetype: The MIME type of the file
    :param parent_folder_id: The folder ID where the file should be uploaded
    :return: The ID of the uploaded file
    """
    service = authenticate_service_account()

    file_metadata = {
        "name": file_name,
        "parents": [parent_folder_id]
    }

    media = MediaFileUpload(file_path, mimetype=mimetype)
    upload_file = service.files().create(
        body=file_metadata,
        media_body=media,
        fields="id"
    ).execute()

    return upload_file.get("id")

def delete_drive_item(file_id):
    """
    Delete a file or folder from Google Drive.
    :param file_id: The ID of the file or folder to delete.
    :return: A message indicating success or failure.
    """
    service = authenticate_service_account()

    try:
        service.files().delete(fileId=file_id).execute()
        return f"File or folder with ID {file_id} has been deleted successfully."
    except Exception as e:
        return f"An error occurred: {e}"


def create_folder_path(service, folder_path, parent_id):
    """
    Create a nested folder structure in Google Drive.
    
    Args:
        service: Google Drive API service instance
        folder_path: Path string like 'job_hirings/job_hiring_1/applications/applicant_1/documents/certifications'
        parent_id: The ID of the root parent folder
        
    Returns:
        The ID of the deepest folder created or found
    """
    if not folder_path:
        return parent_id
        
    path_parts = folder_path.split(os.path.sep)
    current_parent_id = parent_id
    
    for folder_name in path_parts:
        if not folder_name:  # Skip empty folder names
            continue
            
        # Check if folder exists
        query = f"'{current_parent_id}' in parents and name = '{folder_name}' and mimeType = 'application/vnd.google-apps.folder'"
        results = service.files().list(q=query, fields="files(id, name)").execute()
        folders = results.get('files', [])
        
        if folders:
            # Folder exists
            current_parent_id = folders[0]['id']
        else:
            # Create folder
            folder_metadata = {
                "name": folder_name,
                "mimeType": "application/vnd.google-apps.folder",
                "parents": [current_parent_id]
            }
            folder = service.files().create(body=folder_metadata, fields="id").execute()
            current_parent_id = folder.get("id")
    
    return current_parent_id

def upload_file_to_folder(service, file_path, file_name, mimetype, parent_folder_id):
    """
    Upload a file to a specific folder in Google Drive.
    
    Args:
        service: Google Drive API service instance
        file_path: Local path to the file
        file_name: Name to give the file in Google Drive
        mimetype: MIME type of the file
        parent_folder_id: ID of the folder to upload to
        
    Returns:
        The ID of the uploaded file
    """
    from googleapiclient.http import MediaFileUpload
    
    file_metadata = {
        "name": file_name,
        "parents": [parent_folder_id]
    }
    
    media = MediaFileUpload(file_path, mimetype=mimetype)
    file = service.files().create(
        body=file_metadata,
        media_body=media,
        fields="id"
    ).execute()
    
    return file.get("id")

def get_file_by_path(service, file_path, root_folder_id):
    """
    Retrieve a file by its path.
    
    Args:
        service: Google Drive API service instance
        file_path: Path string like 'job_hirings/job_hiring_1/applications/applicant_1/resume.pdf'
        root_folder_id: The ID of the root folder
        
    Returns:
        The file object if found, None otherwise
    """
    path_parts = file_path.split(os.path.sep)
    file_name = path_parts[-1]
    folder_path = os.path.sep.join(path_parts[:-1])
    
    # Navigate to the folder
    current_folder_id = root_folder_id
    for folder_name in folder_path.split(os.path.sep):
        if not folder_name:
            continue
            
        query = f"'{current_folder_id}' in parents and name = '{folder_name}' and mimeType = 'application/vnd.google-apps.folder'"
        results = service.files().list(q=query, fields="files(id, name)").execute()
        folders = results.get('files', [])
        
        if not folders:
            return None  # Folder not found
            
        current_folder_id = folders[0]['id']
    
    # Search for the file in the final folder
    query = f"'{current_folder_id}' in parents and name = '{file_name}'"
    results = service.files().list(q=query, fields="files(id, name)").execute()
    files = results.get('files', [])
    
    return files[0] if files else None

def cleanup_failed_upload(file_id=None, path=None):
    """
    Clean up after a failed upload.
    
    Args:
        file_id: Google Drive file ID to delete
        path: Local file path to delete
    """
    service = authenticate_service_account()
    
    if file_id:
        try:
            service.files().delete(fileId=file_id).execute()
        except Exception as e:
            print(f"Failed to delete Google Drive file {file_id}: {e}")
    
    if path and os.path.exists(path):
        try:
            os.remove(path)
        except Exception as e:
            print(f"Failed to delete local file {path}: {e}")

def download_file_from_drive(service, file_id, local_path):
    """Download a file from Google Drive by ID to a local path"""
    request = service.files().get_media(fileId=file_id)
    
    with open(local_path, 'wb') as f:
        # Stream the file content to disk
        downloader = MediaIoBaseDownload(f, request)
        done = False
        while not done:
            status, done = downloader.next_chunk()