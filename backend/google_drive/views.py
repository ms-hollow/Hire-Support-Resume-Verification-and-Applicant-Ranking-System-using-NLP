from django.http import JsonResponse
from .utils import list_google_drive_files, create_applicant_folder, upload_file_to_applicant_folder
import os
import tempfile

FOLDER_ID = '17eN9CdIVu7nGhZ8n1aUFxr3PTxUK0BOE'

# View to list all Google Drive files
def drive_files_view(request):
    files = list_google_drive_files()
    return JsonResponse(files)  # Return structured JSON response

# View to upload a file to the applicant's folder
def upload_file(request):
    if request.method == "POST" and request.FILES.get("file"):
        user_file = request.FILES["file"]
        applicant_name = request.POST.get("applicant_name")
        
        if not applicant_name:
            return JsonResponse({"error": "Applicant name is required"}, status=400)

        # Use tempfile to create a temporary file
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            temp_path = temp_file.name
            for chunk in user_file.chunks():
                temp_file.write(chunk)

        try:
            # Create the applicant's folder in Google Drive (if not exists)
            folder_id = create_applicant_folder(applicant_name, FOLDER_ID)

            # Upload the file to the applicant's folder
            file_id = upload_file_to_applicant_folder(temp_path, user_file.name, user_file.content_type, folder_id)

            # Clean up the temporary file
            os.remove(temp_path)

            return JsonResponse({
                "message": "File uploaded successfully",
                "folder_id": folder_id,
                "file_id": file_id
            })
        
        except Exception as e:
            os.remove(temp_path)
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "No file provided"}, status=400)
