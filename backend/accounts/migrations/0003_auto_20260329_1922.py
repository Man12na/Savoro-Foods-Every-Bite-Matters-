from django.db import migrations

def create_admin_user(apps, schema_editor):
    User = apps.get_model("auth", "User")  # use historical model
    if not User.objects.filter(username="admin").exists():
        User.objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="YourStrongPassword123"
        )

class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_auto_20260329_1920'),  # previous migration
        ('auth', '0012_alter_user_first_name_max_length'),  # make sure auth migrations are applied first
    ]

    operations = [
        migrations.RunPython(create_admin_user),
    ]