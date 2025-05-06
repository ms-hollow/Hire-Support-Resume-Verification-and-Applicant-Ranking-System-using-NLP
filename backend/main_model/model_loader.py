# main_model/model_loader.py
import torch
import tensorflow as tf
import os

def load_pt_model(model_path):
    """Load a PyTorch model from a .pt file."""
    if os.path.exists(model_path):
        model = torch.load(model_path, map_location=torch.device('cpu'))
        model.eval()
        return model
    else:
        raise FileNotFoundError(f"Model not found at {model_path}")

def load_pb_model(model_path):
    """Load a TensorFlow model from a .pb file."""
    if os.path.exists(model_path):
        model = tf.saved_model.load(model_path)
        return model
    else:
        raise FileNotFoundError(f"Model not found at {model_path}")

def load_all_models():
    """Load all your models after downloading."""
    base_path = os.path.join("main_model", "models")

    certification_model = load_pt_model(os.path.join(base_path, "certification_ner_model.pt"))
    education_model = load_pt_model(os.path.join(base_path, "education_ner_model.pt"))
    experience_model = load_pt_model(os.path.join(base_path, "experience_ner_model.pt"))
    
    # Note: frozen_east_text_detection.pb is not a SavedModel, so this is a placeholder.
    east_model_path = os.path.join(base_path, "frozen_east_text_detection.pb")

    # Return raw path for .pb since it will be loaded via OpenCV or TensorFlow session separately
    return {
        "certification": certification_model,
        "education": education_model,
        "experience": experience_model,
        "east_model_path": east_model_path
    }

