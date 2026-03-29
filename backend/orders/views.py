from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import OrderSerializer
from .models import Order, OrderItem

# Custom permission: only owner or admin can access
#class IsOwnerOrAdmin(permissions.BasePermission):
 #   def has_object_permission(self, request, view, obj):
  #      if request.user.is_staff:
 #           return True
  #      return request.user == obj.user
  
class IsOwnerSellerOrAdmin(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):

        # Admin can access
        if request.user.is_staff:
            return True

        # Customer can access their own order
        if obj.user == request.user:
            return True

        # Seller can access if order contains their product
        if getattr(request.user, "is_seller", False):
            return obj.items.filter(product__seller=request.user).exists()

        return False


class OrderViewset(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerSellerOrAdmin]

    def get_queryset(self):
      user = self.request.user

    # seller view
      if hasattr(user, "profile") and user.profile.is_seller:
        return Order.objects.filter(
            items__product__seller=user
        ).select_related("user").prefetch_related("items__product").distinct().order_by("-created_at")

    # customer view
      return Order.objects.filter(
        user=user
      ).prefetch_related("items__product").order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        # TODO: Notify seller that a new order has been placed

    # Seller: Mark order as completed
    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAuthenticated])
    def mark_complete(self, request, pk=None):
        order = self.get_object()
        user = request.user

        # Only allow sellers of products in this order
        seller_products = order.items.filter(product__seller=user)
        if not seller_products.exists():
            return Response(
                {"error": "You are not authorized to update this order"},
                status=status.HTTP_403_FORBIDDEN
            )

        order.status = "completed"
        order.save()
        # TODO: Notify customer about completion
        return Response({"status": "completed"}, status=status.HTTP_200_OK)

    # Customer: Cancel order (only if pending)
    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAuthenticated])
    def cancel(self, request, pk=None):
        order = self.get_object()
        user = request.user

        if order.user != user:
            return Response(
                {"error": "Only the customer can cancel this order"},
                status=status.HTTP_403_FORBIDDEN
            )

        if order.status != "pending":
            return Response(
                {"error": "Cannot cancel order that is not pending"},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = "cancelled"
        order.save()
        # TODO: Notify seller about cancellation
        return Response({"status": "cancelled"}, status=status.HTTP_200_OK)