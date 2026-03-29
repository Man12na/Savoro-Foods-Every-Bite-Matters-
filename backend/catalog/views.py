from django.shortcuts import render
from rest_framework import permissions, viewsets
from .models import Product, Category, ProductImage
from .serializers import ProductSerializer, CategorySerializer
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

# Create your views here.

class IsSellerOrReadOnly(permissions.BasePermission):
  #for particular single object wants to get, head, options true otherwise remaining modification to the particular object then must has to be the object seller the requeted user same
  def has_object_permission(self, request, view, obj):
    if request.method in permissions.SAFE_METHODS:
      return True
    return obj.seller == request.user
    
  # this is overal view only the reusted user shold be log in and that person be a is seller true then only can post remainin get can any one can be 
 # def has_permission(self, request,view):
  #  if request.method == "POST":
    #  return request.user.is_authenticated and request.user.profile.is_seller 

  #  return True
  
  def has_permission(self, request, view):

    # Anyone can read products
    if request.method in permissions.SAFE_METHODS:
        return True

    # Only authenticated sellers can create products
    if request.method == "POST":
        if not request.user.is_authenticated:
            return False

        profile = getattr(request.user, "profile", None)
        return profile and profile.is_seller

    return True
    
  
#from rest_framework.parsers import MultiPartParser, FormParser

#class ProductViewset(viewsets.ModelViewSet):
 #   queryset = Product.objects.all().order_by("id")
 #   serializer_class = ProductSerializer
  #  permission_classes = [IsSellerOrReadOnly]
   # permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    #parser_classes = [MultiPartParser, FormParser, JSONParser]
class ProductViewset(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by("id")
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsSellerOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    def perform_create(self, serializer):
        product = serializer.save(seller=self.request.user)

        # 👇 THIS is the key fix
        images = self.request.FILES.getlist('images_files')
        for image in images:
            ProductImage.objects.create(product=product, image=image)
            
    def perform_update(self, serializer):
      product = serializer.save()

      images = self.request.FILES.getlist('images_files')
      if images:
        product.images.all().delete()   # optional: remove old images

        for image in images:
            ProductImage.objects.create(product=product, image=image)
  
class CategoryViewset(viewsets.ReadOnlyModelViewSet):
  queryset=Category.objects.all()
  serializer_class = CategorySerializer
  permission_classes = [permissions.AllowAny]


