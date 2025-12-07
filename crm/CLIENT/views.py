from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import ClientDetail, ClientAddress, ClientTeam, ClientAssessmentType
from .serializer import ClientDetailSerializer, ClientAddressSerializer, ClientTeamSerializer, ClientAssessmentTypeSerializer
from .pagination import GroupedResultsSetPagination, StandardResultsSetPagination, LargeResultsSetPagination

class ClientAddressViewset(ModelViewSet):
    queryset = ClientAddress.objects.all()
    serializer_class = ClientAddressSerializer
    
class ClientDetailViewset(ModelViewSet):
    queryset = ClientDetail.objects.select_related('address').all()
    serializer_class = ClientDetailSerializer
    pagination_class = StandardResultsSetPagination
    
class ClientTeamViewset(ModelViewSet):
    queryset = ClientTeam.objects.all()
    serializer_class = ClientTeamSerializer
    pagination_class = GroupedResultsSetPagination
    
class ClientAssessmentTypeViewSet(ModelViewSet):
    queryset = ClientAssessmentType.objects.select_related('assesment_type', 'client').all()
    serializer_class = ClientAssessmentTypeSerializer
    pagination_class = LargeResultsSetPagination

