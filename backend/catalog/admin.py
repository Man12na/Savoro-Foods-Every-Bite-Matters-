from django.contrib import admin
from .models import Category, Product, ProductImage

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
  prepopulated_fields={'slug':('name',)}
  
#@admin.register(SellerUser)
#class SellerAdmin(admin.ModelAdmin):
  #  list_display = ('name','is_seller')
    
    
class ProductImageInline(admin.TabularInline):
  model=ProductImage
  extra=1
  
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
  list_display = ('title','seller','price','stock','created_at')
  prepopulated_fields={'slug':('title',)}
  inlines=[ProductImageInline]

