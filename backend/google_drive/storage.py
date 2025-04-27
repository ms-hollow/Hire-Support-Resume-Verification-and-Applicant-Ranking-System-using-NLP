# google_drive/storage.py
from django.core.files.storage import Storage
from django.conf import settings
from .utils import authenticate_service_account, create_folder_path, upload_file_to_folder
import os
import tempfile
import mimetypes
from io import BytesIO
from django.utils.deconstruct import deconstructible

@deconstructible
class GoogleDriveStorage(Storage):
    def __init__(self, root_folder_id=None):
        self.root_folder_id = root_folder_id or getattr(settings, 'GDRIVE_ROOT_FOLDER_ID', None)
        # Don't initialize the service here - do it lazily when needed
        self._service = None
        
    @property
    def service(self):
        if self._service is None:
            self._service = authenticate_service_account()
        return self._service
        
    def _save(self, name, content):
        # Convert absolute paths to relative paths if needed
        if os.path.isabs(name):
            # Strip leading slash to make it relative
            name = name.lstrip('/')

        # Parse the path to create appropriate folder structure
        path_parts = os.path.normpath(name).split(os.path.sep)
        file_name = path_parts[-1]
        folder_path = os.path.sep.join(path_parts[:-1])
        
        # Create folder structure and get the final folder ID
        folder_id = create_folder_path(self.service, folder_path, self.root_folder_id)
        
        # Create a temporary file
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            content.seek(0)
            temp_file.write(content.read())
            temp_path = temp_file.name
        
        try:
            # Determine mimetype
            mimetype, _ = mimetypes.guess_type(file_name)
            if mimetype is None:
                mimetype = 'application/octet-stream'
            
            # Upload the file to Google Drive
            file_id = upload_file_to_folder(self.service, temp_path, file_name, mimetype, folder_id)
            
            # Store the Google Drive ID
            setattr(content, 'google_drive_id', file_id)
            
            # Print debug info
            print(f"Uploaded file to Google Drive: {name}, ID: {file_id}")
            
            return name
        finally:
            # Clean up the temporary file
            os.remove(temp_path)
    
    def _open(self, name, mode='rb'):
        # This would be used to retrieve files
        # Implementation needed if you want to read files
        raise NotImplementedError("Reading files is not implemented yet")
    
    def exists(self, name):
        # For now, always return False to force uploading
        # In a complete implementation, you'd check if the file exists in Google Drive
        return False
    
    def url(self, name):
        # Return a URL that points to the Google Drive file
        # This requires retrieving or storing file IDs
        # For now, just return a placeholder
        return f"https://drive.google.com/file/d/{name}"