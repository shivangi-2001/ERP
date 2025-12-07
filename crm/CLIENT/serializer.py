from rest_framework import serializers
from .models import ClientDetail, ClientAddress, ClientTeam, ClientAssessmentType

class ClientAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientAddress
        fields = '__all__'
        
class ClientTeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientTeam
        fields = '__all__'
    

class ClientDetailSerializer(serializers.ModelSerializer):
    address = ClientAddressSerializer()
    teams = ClientTeamSerializer(many=True, read_only=True)
    class Meta:
        model = ClientDetail
        fields = '__all__'

    def create(self, validated_data):
        address_data = validated_data.pop('address')
        address_instance = ClientAddress.objects.create(**address_data)
        company_detail = ClientDetail.objects.create(address=address_instance, **validated_data)
        return company_detail

    def update(self, instance, validated_data):
        if 'address' in validated_data:
            address_data = validated_data.pop('address')
            address_instance = instance.address

            for attr, value in address_data.items():
                setattr(address_instance, attr, value)
            address_instance.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance
    
class ClientAssessmentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientAssessmentType
        fields = '__all__'
        
