from rest_framework import serializers
from .models import ClientDetail, ClientAddress, ClientTeam, ClientAssessmentType, UrlMapping, Finding
from core.serializer import CompilanceSerializer, UserSerializer, VulnerabilitySerializer
from core.models import CompilanceType, User, Vulnerabilities

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
    client_name = serializers.CharField(source="client.name", read_only=True)
    assessment_type_name = serializers.CharField(source="assessment_type.name", read_only=True)
    class Meta:
        model = ClientAssessmentType
        fields = ['id', 'client', 'client_name', 'assessment_type', 'assessment_type_name']
        
class UrlMappingSerializer(serializers.ModelSerializer):
    client_assessment = ClientAssessmentTypeSerializer(read_only=True)
    client_assessment_id = serializers.PrimaryKeyRelatedField(source="client_assessment", queryset=ClientAssessmentType.objects.all(), write_only=True)
    
    compliance = CompilanceSerializer(read_only=True)
    compliance_id = serializers.PrimaryKeyRelatedField(source="compliance", queryset=CompilanceType.objects.all(), write_only=True, allow_null=True,required=False)
    
    tester = UserSerializer(read_only=True)
    tester_id = serializers.PrimaryKeyRelatedField(source="tester", queryset=User.objects.all(), write_only=True, allow_null=True, required=False)
    
    class Meta:
        model = UrlMapping
        fields = ["id", "start_date", "end_date", "qa_date", "url", 
            "client_assessment", "client_assessment_id", "tester","tester_id", 
            "compliance", "compliance_id", "is_completed"]


class FindingSerializer(serializers.ModelSerializer):
    url = UrlMappingSerializer(read_only=True)
    url_id = serializers.PrimaryKeyRelatedField(source="url", queryset=UrlMapping.objects.all(), write_only=True)
    
    vulnerability = VulnerabilitySerializer(read_only=True)
    vulnerability_id = serializers.PrimaryKeyRelatedField(source="vulnerability", queryset=Vulnerabilities.objects.all(), write_only=True)
    
    class Meta:
        model = Finding
        fields = ['id', 'url', 'url_id', 'vulnerability', 'vulnerability_id']
        
    def validate(self, data):
        url_instance = data.get('url_id')
        vul_instance = data.get('vulnerability_id')
        
        print(vul_instance, url_instance)
        
        if url_instance and vul_instance:
            assessment_name = url_instance.client_assessment.assessment_type.name
            vuln_category = vul_instance.category_of_testing.name

            if assessment_name != vuln_category:
                raise serializers.ValidationError(
                    f"Mismatch: URL Assessment is '{assessment_name}', "
                    f"but Vulnerability Category is '{vuln_category}'."
                )

        return data