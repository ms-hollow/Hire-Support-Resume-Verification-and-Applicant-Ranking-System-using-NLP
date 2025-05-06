from django.apps import AppConfig


class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'

    def ready(self):
        # Import here to avoid side effects during migrations
        from main_model.model_downloader import download_all_models
        download_all_models()