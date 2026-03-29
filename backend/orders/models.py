from django.db import models
from django.contrib.auth import get_user_model
from catalog.models import Product

# Create your models here.
User=get_user_model()
class Order(models.Model):
  STATUS_CHOICES=[
    ('pending', 'Pending'),
    ('paid', 'Paid'),
    ('shipped', 'Shipped'),
    ('completed', 'Completed')
    ]
  user=models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
  total_amount=models.DecimalField(max_digits=10, decimal_places=2, default=0)
  status=models.CharField(max_length=50, choices=STATUS_CHOICES, default= 'pending')
  created_at=models.DateTimeField(auto_now_add=True)
  
  def __str__(self):
    return f"Order#{self.id} by {self.user.username}"
    

class OrderItem(models.Model):
  order=models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
  product=models.ForeignKey(Product, on_delete=models.PROTECT)
  quantity=models.PositiveIntegerField(default=1)
  unit_price=models.DecimalField(max_digits=10, decimal_places=2)
  
  def __str__(self):
    return f"{self.quantity} × {self.product.title}"