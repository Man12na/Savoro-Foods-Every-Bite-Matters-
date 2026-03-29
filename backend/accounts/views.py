from django.shortcuts import render
from rest_framework import viewsets, permissions, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializer import MyTokenObtainSerializer, UserSeializer, ProfileSerializer, RegisterSerializer, SellerProfileSerializer, CustomerProfileSerializer
from .models import Profile
from rest_framework import status

# Create your views here.
User=get_user_model()
#class MyTokenObtainPairView(TokenObtainPairView):
  #serializer= MyTokenObtainSerializer
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainSerializer
    
class UserViewset(viewsets. ReadOnlyModelViewSet):
  queryset=User.objects.all()
  serializer_class=UserSeializer
  permission_classes=[permissions.IsAuthenticatedOrReadOnly]
  #user=User.objects.get(id=3)
  #print(user.is_active)
  
  ##@action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
 ## def me(self, request):
   ## serializer= self.get_serializer(request.user)
    ##return Response(serializer.data)

  @action(detail=False, methods=['get','patch'], permission_classes=[permissions.IsAuthenticated])
  def me(self, request):

    user = request.user

    if user.profile.is_seller:
        profile = user.seller_profile
        serializer_class = SellerProfileSerializer
    else:
        profile = user.customer_profile
        serializer_class = CustomerProfileSerializer

    if request.method == "GET":
        serializer = serializer_class(profile)
        return Response(serializer.data)

    if request.method == "PATCH":
        serializer = serializer_class(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    

class RegisterView(generics.CreateAPIView):
  queryset=User.objects.all()
  serializer_class=RegisterSerializer
  permission_classes=[permissions.AllowAny]
  
  