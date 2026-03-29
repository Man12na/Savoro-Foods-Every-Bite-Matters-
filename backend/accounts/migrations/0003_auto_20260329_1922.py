from django.db import migrations
from django.contrib.auth.models import User

def create_admin_user(apps, schema_editor):
    # Only create if admin does not already exist
    if not User.objects.filter(username="admin").exists():
        User.objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="YourStrongPassword123"
        )

class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_auto_20260329_1920'),  # replace with the previous migration of accounts
    ]

    operations = [
        migrations.RunPython(create_admin_user),
    ]