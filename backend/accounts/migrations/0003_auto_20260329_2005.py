from django.db import migrations

def create_admin_user(apps, schema_editor):
    # Use historical User model for migrations
    User = apps.get_model("auth", "User")
    if not User.objects.filter(username="admin").exists():
        User.objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="YourStrongPassword123"
        )

class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_customerprofile_sellerprofile'),  # latest valid migration
        ('auth', '0012_alter_user_first_name_max_length'),    # auth dependency
    ]

    operations = [
        migrations.RunPython(create_admin_user),
    ]