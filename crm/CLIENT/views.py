from django.shortcuts import render
from rest_framework import generics
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import ClientDetail, ClientAddress, ClientTeam, ClientAssessmentType, UrlMapping, Finding
from .serializer import ClientDetailSerializer, ClientAddressSerializer, ClientTeamSerializer, ClientAssessmentTypeSerializer, UrlMappingSerializer, FindingSerializer
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
        assessment_type = self.request.query_params.get("assessment_type")
        
        if client_id is not None:
            queryset = queryset.filter(client_id=client_id)
        if assessment_type is not None and assessment_type not in ["" , "null" ,"undefined"]:
            queryset = queryset.filter(assessment_type__name=assessment_type)
            
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
    
class InProgresViews(generics.ListAPIView):
    queryset = UrlMapping.objects.filter(start_date__isnull=False, end_date__isnull=False, qa_date__isnull=False, compliance__isnull=False, tester__isnull=False).select_related('client_assessment', 'tester', 'compliance').all()
    serializer_class = UrlMappingSerializer
    pagination_class = LargeResultsSetPagination
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = UrlMapping.objects.filter(start_date__isnull=False, end_date__isnull=False, qa_date__isnull=False, compliance__isnull=False, tester_id=user.id).select_related('client_assessment', 'tester', 'compliance').all()
        return queryset
    
    
class FindingViewset(ModelViewSet):
    queryset =  Finding.objects.select_related('url', 'vulnerability').all()
    serializer_class = FindingSerializer
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        queryset = Finding.objects.select_related('url', 'vulnerability').all()
        
        project_id = self.request.query_params.get('project_id') 
        
        if project_id is not None:
            queryset = queryset.filter(url__id=project_id)
            
        return queryset
    
    

