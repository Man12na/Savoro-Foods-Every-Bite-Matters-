from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify

# Create your models here.
User=get_user_model()
class Category(models.Model):
  name=models.CharField(max_length=100)
  slug=models.SlugField(unique=True, blank=True)
  
  
  class Meta:
    verbose_name_plural='categories'
    
  def save(self, *args,**kwargs):
    if not self.slug:
      self.slug=slugify(self.name)
    super().save(*args, **kwargs)
      
  def __str__(self):
    return self.name
    
#class SellerUser(models.Model):
  #name=models.CharField(max_length=100)
  #email=models.EmailField()
 # is_seller=models.BooleanField(default=True)
  
class Product(models.Model):
  seller=models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')
  title=models.CharField(max_length=150)
  description=models.CharField(max_length=300)
  category=models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
  price=models.DecimalField(max_digits=10, decimal_places=2)
  slug=models.SlugField(unique=True, blank=True)
  stock=models.PositiveIntegerField(default=0)
  created_at= models.DateTimeField(auto_now_add=True)
  
  def save(self, *args,**kwargs):
    if not self.slug:
      base = slugify(self.title)[:40]
      slug = base
      count = 1
      while Product.objects.filter(slug=slug).exists():
        slug = f'{base}-{count}'
        count += 1
      self.slug=slug
    super().save(*args,**kwargs)
  def __str__(self):
    return self.title
    
class ProductImage(models.Model):
  product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
  image = models.ImageField(upload_to='products/')
  is_primary = models.BooleanField(default=False)
  
  def __str__(self):
    return f'image for {self.product.title}'
      
      
 


