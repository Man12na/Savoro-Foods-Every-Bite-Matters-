from rest_framework import serializers
from .models import Order, OrderItem
from catalog.models import Product
from rest_framework.exceptions import ValidationError

class OrderItemSerializer(serializers.ModelSerializer):
  product=serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
  class Meta:
    model=OrderItem
    fields=['id','product','quantity', 'unit_price']
    read_only_fields=['id', 'unit_price']
    
class OrderSerializer(serializers.ModelSerializer):
  user = serializers.StringRelatedField()
  items=OrderItemSerializer(many=True)
  class Meta:
    model=Order
    fields=['id', 'status', 'created_at', 'total_amount', 'user', 'items']
    read_only_fields=['id','total_amount', 'created_at', 'user','status']
    
  def create(self, validated_data):
    items_data=validated_data.pop('items', [])
    order=Order.objects.create(**validated_data)
    total=0
    for item in items_data:
      product=item['product']
      qty=item.get('quantity')
      price=product.price
      
      OrderItem.objects.create(order=order, product=product, quantity=qty, unit_price=price)
      total += price * qty
    order.total_amount=total
    order.save()
    return order
  
  def update(self, instance, validated_data):

    # allow update only if order is pending
    if instance.status != "pending":
        raise ValidationError("Only pending orders can be updated.")

    items_data = validated_data.pop("items", None)

    if items_data is not None:
        instance.items.all().delete()

        total = 0

        for item in items_data:
            product = item["product"]
            qty = item["quantity"]
            price = product.price

            OrderItem.objects.create(
                order=instance,
                product=product,
                quantity=qty,
                unit_price=price
            )

            total += price * qty

        instance.total_amount = total

    instance.save()

    return instance
    