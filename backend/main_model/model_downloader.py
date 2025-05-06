# main_model/model_downloader.py
import os
import requests

# Define file IDs for each model
model_ids = {
    "certification_ner_model.pt": "1ZkJXpxz-oXAnEmK97j9EjrceUA-oN8q1",
    "education_ner_model.pt": "1_j6glktNKvvfphQwSIq6udJcmxLbSijp",
    "experience_ner_model.pt": "146LYew_KSdo45DmCkg47qU2AwcK3yOXx",
    "frozen_east_text_detection.pb": "1NzqjNwojNaGQtx31OIsjkXNGpURVqNER"
}

def download_model(file_name, file_id):
    """Download a model file from Google Drive."""
    url = f"https://drive.google.com/git uc?export=download&id={file_id}"
    model_path = os.path.join("main_model", "models", file_name)

    if not os.path.exists(model_path):
        print(f"Downloading {file_name} from Google Drive...")
        os.makedirs(os.path.dirname(model_path), exist_ok=True)
        response = requests.get(url)
        with open(model_path, 'wb') as f:
            f.write(response.content)
        print(f"{file_name} download complete.")
    else:
        print(f"{file_name} already exists.")

def download_all_models():
    """Download all models."""
    for file_name, file_id in model_ids.items():
        download_model(file_name, file_id)
