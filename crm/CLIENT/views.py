from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import ClientDetail, ClientAddress, ClientTeam, ClientAssessmentType, UrlMapping
from .serializer import ClientDetailSerializer, ClientAddressSerializer, ClientTeamSerializer, ClientAssessmentTypeSerializer, UrlMappingSerializer
from .pagination import GroupedResultsSetPagination, StandardResultsSetPagination, LargeResultsSetPagination

class ClientAddressViewset(ModelViewSet):
    queryset = ClientAddress.objects.all()
    serializer_class = ClientAddressSerializer
    
class ClientDetailViewset(ModelViewSet):
    queryset = ClientDetail.objects.select_related('address').all()
    serializer_class = ClientDetailSerializer
    pagination_class = StandardResultsSetPagination
    
class ClientTeamViewset(ModelViewSet):
    queryset = ClientTeam.objects.select_related('client').all()
    serializer_class = ClientTeamSerializer
    pagination_class = GroupedResultsSetPagination
    
    def get_queryset(self):
        queryset = ClientTeam.objects.select_related('client').all()
        client_id = self.request.query_params.get('client_id')
        if client_id is not None:
            queryset = queryset.filter(client_id=client_id)
        return queryset
    
class ClientAssessmentTypeViewSet(ModelViewSet):
    queryset = ClientAssessmentType.objects.select_related('assessment_type', 'client').all()
    serializer_class = ClientAssessmentTypeSerializer
    pagination_class = LargeResultsSetPagination
    
    def get_queryset(self):
        queryset = ClientAssessmentType.objects.select_related('assessment_type', 'client').all()
        client_id = self.request.query_params.get('client')
        if client_id is not None:
            queryset = queryset.filter(client_id=client_id)
        return queryset
    
class UrlMappingViewset(ModelViewSet):
    queryset = UrlMapping.objects.select_related("tester", "client_assessment", "compliance").all()
    serializer_class = UrlMappingSerializer
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        queryset = UrlMapping.objects.select_related("tester", "compliance", "client_assessment", "client_assessment__client", "client_assessment__assessment_type").all()
        
        client_detail_id = self.request.query_params.get('client_id') 
        
        assessment_name = self.request.query_params.get('assessment_type') 
        
        if client_detail_id is not None:
            queryset = queryset.filter(client_assessment__client=client_detail_id)
            
        if assessment_name is not None:
            queryset = queryset.filter(client_assessment__assessment_type__name=assessment_name)
            
            
        return queryset
    

