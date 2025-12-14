from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from rest_framework import generics
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import ClientDetail, ClientAddress, ClientTeam
from .serializer import ClientDetailSerializer, ClientAddressSerializer, ClientTeamSerializer
from .pagination import GroupedResultsSetPagination, StandardResultsSetPagination

class ClientAddressViewset(ModelViewSet):
    queryset = ClientAddress.objects.all()
    serializer_class = ClientAddressSerializer
    
class ClientDetailViewset(ModelViewSet):
    queryset = ClientDetail.objects.select_related('address').all()
    serializer_class = ClientDetailSerializer
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        queryset = ClientDetail.objects.select_related('address').all()
        name = self.request.query_params.get('name')
        if name is not None:
            queryset = queryset.filter(name__icontains=name)
        return queryset
    
class ClientTeamViewset(ModelViewSet):
    queryset = ClientTeam.objects.select_related('client').all()
    serializer_class = ClientTeamSerializer
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        queryset = ClientTeam.objects.select_related('client').all()
        client_id = self.request.query_params.get('client_id')
        if client_id is not None:
            queryset = queryset.filter(client_id=client_id)
        return queryset