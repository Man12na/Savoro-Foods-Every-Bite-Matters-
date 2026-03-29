from rest_framework import serializers
from .models import Profile, SellerProfile, CustomerProfile
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from catalog.serializers import ProductSerializer

User=get_user_model()

class UserSeializer(serializers.ModelSerializer):
  class Meta:
    model=User
    fields=['id', 'username', 'email', 'first_name', 'last_name']

class ProfileSerializer(serializers.ModelSerializer):
  class Meta:
    model= Profile
    fields=['id', 'user', 'is_seller', 'bio', 'avatar']

class SellerProfileSerializer(serializers.ModelSerializer):
    products = ProductSerializer(source="user.products", many=True, read_only=True)
    username = serializers.CharField(source="user.username")
    email = serializers.EmailField(source="user.email")

    class Meta:
        model = SellerProfile
        fields = [
            "id",
            "store_name",
            "phone",
            "address",
            "username",
            "email",
            "products"
        ]
  
class CustomerProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username")
    email = serializers.EmailField(source="user.email")

    class Meta:
        model = CustomerProfile
        fields = ['id', 'username', 'email', 'phone', 'address']



class MyTokenObtainSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        # You could also add is_seller here, but better in response
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Add extra responses here
        data['username'] = self.user.username
        # Access related Profile to get is_seller
        profile = getattr(self.user, 'profile', None)
        data['is_seller'] = profile.is_seller if profile else False
        return data

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    is_seller = serializers.BooleanField(required=False, default=False)
    phone = serializers.CharField(required=False)
    address = serializers.CharField(required=False)
    store_name = serializers.CharField(required=False)


    class Meta:
        model = User
        fields = [
            'id','username','email','first_name','last_name',
            'password','is_seller','phone','address','store_name'
        ]

    def create(self, validated_data):

        is_seller = validated_data.pop('is_seller')
        phone = validated_data.pop('phone', None)
        address = validated_data.pop('address', None)
        store_name = validated_data.pop('store_name', None)

        user = User(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )

        user.set_password(validated_data['password'])
        user.save()

        # create profile
        Profile.objects.create(user=user, is_seller=is_seller)

        if is_seller:
            SellerProfile.objects.create(
                user=user,
                store_name=store_name,
                phone=phone,
                address=address
            )
        else:
            CustomerProfile.objects.create(
                user=user,
                phone=phone,
                address=address
            )

        return user