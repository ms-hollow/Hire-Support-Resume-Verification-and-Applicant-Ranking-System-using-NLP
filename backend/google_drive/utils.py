import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from threading import Lock

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
