from django.contrib import admin
from .models import Profile, SellerProfile, CustomerProfile
from django.contrib.auth import get_user_model

# Register your models here.
User=get_user_model()

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user','is_seller')

@admin.register(SellerProfile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user','phone')
    
@admin.register(CustomerProfile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user','phone')
