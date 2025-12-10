from django.contrib.auth import authenticate
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import CompilanceType, AssessmentType, Vulnerabilities, TeamsManagement, User

class CompilanceSerializer(ModelSerializer):
    class Meta:
        model = CompilanceType
        fields = '__all__'

class AssessmentSerializer(ModelSerializer):
    class Meta:
        model = AssessmentType
        fields = '__all__'
        
class VulnerabilitySerializer(ModelSerializer):
    category_of_testing = AssessmentSerializer(read_only=True)
    category_of_testing_id = serializers.PrimaryKeyRelatedField(source="category_of_testing", queryset=AssessmentType.objects.all(), write_only=True)
    
    class Meta:
        model = Vulnerabilities
        fields = ['id', 'name', 'description', 'remediations', 'impact', 'reference', 'cvss','category_of_testing_id', 'category_of_testing']
        
    
class TeamsManagementSerializer(ModelSerializer):
    class Meta:
        model = TeamsManagement
        fields = '__all__' 

class RegisterUserSerializer(serializers.ModelSerializer):
    team_id = serializers.PrimaryKeyRelatedField(source="team", queryset=TeamsManagement.objects.all(), write_only=True)
    
    class Meta:
        model = User
        fields = [
            "email", "password", "first_name", "last_name",
            "contact_number", "designation", "team_id"
        ]
        
    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
    

class ProfileSerializer(serializers.ModelSerializer):
    team = TeamsManagementSerializer(read_only=True)
    team_id = serializers.PrimaryKeyRelatedField(
        source="team",
        queryset=TeamsManagement.objects.all(),
        write_only=True
    )

    class Meta:
        model = User
        fields = [
            "id", "email", "first_name", "last_name",
            "contact_number", "designation", "password",
            "team", "team_id", "is_active", "is_staff", "date_joined"
        ]
        read_only_fields = ["email", "is_active", "is_staff", "date_joined"]
        extra_kwargs = {
            "password": {"write_only": True}
        }
    
    def update(self, instance, validated_data):
        validated_data.pop("email", None)
        password = validated_data.pop("password", None)
        if password:
            instance.set_password(password)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class UserSerializer(serializers.ModelSerializer):
    team = TeamsManagementSerializer(read_only=True)
    team_id = serializers.PrimaryKeyRelatedField(
        source="team",
        queryset=TeamsManagement.objects.all(),
        write_only=True
    )

    class Meta:
        model = User
        fields = [
            "id", "email", "first_name", "last_name", 'password',
            "contact_number", "designation",
            "team", "team_id", "is_active", "is_staff", "date_joined"
        ]
        read_only_fields = ["date_joined"]
        extra_kwargs = {
            "password": {"write_only": True},
        }
        
    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
    
    def update(self, instance, validated_data):
        validated_data.pop("email", None)
        password = validated_data.pop("password", None)
        if password:
            instance.set_password(password)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
            

