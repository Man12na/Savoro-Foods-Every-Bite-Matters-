from rest_framework import serializers
from .models import Product, ProductImage, Category

class ProductImageSerializer(serializers.ModelSerializer):
  class Meta:
    model = ProductImage
    fields = ['id', 'image', 'is_primary']
    

class ProductSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'slug', 'price',
            'description', 'stock', 'category', 'images'
        ]

    def get_images(self, obj):
        return [img.image.url for img in obj.images.all()]


class CategorySerializer(serializers.ModelSerializer):
  class Meta:
    model = Category
    fields=['id', 'name', 'slug']