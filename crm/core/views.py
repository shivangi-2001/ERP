from rest_framework import viewsets
from rest_framework import generics
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from .models import User, TeamsManagement, Vulnerabilities, AssessmentType, CompilanceType
from .serializer import UserSerializer, TeamsManagementSerializer, RegisterUserSerializer, ProfileSerializer, AssessmentSerializer, \
    VulnerabilitySerializer, CompilanceSerializer
from .pagination import StandardResultsSetPagination, GroupedResultsSetPagination

class CompilanceViewSet(viewsets.ModelViewSet):
    queryset = CompilanceType.objects.all()
    serializer_class = CompilanceSerializer
    pagination_class = StandardResultsSetPagination
    
class AssessmentViewSet(viewsets.ModelViewSet):
    queryset = AssessmentType.objects.all()
    serializer_class = AssessmentSerializer
    pagination_class = StandardResultsSetPagination

class VulnerabilityViewSet(viewsets.ModelViewSet):
    queryset = Vulnerabilities.objects.select_related("category_of_testing").all()
    serializer_class = VulnerabilitySerializer
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        queryset = Vulnerabilities.objects.select_related('category_of_testing').all()
        
        name = self.request.query_params.get('name')
        
        assessment_type = self.request.query_params.get('assessment_type')
        
        if assessment_type is not None:
            queryset = queryset.filter(category_of_testing__name=assessment_type)
            
        if name is not None:
            queryset = queryset.filter(name__icontains=name)
            
        return queryset

class TeamViewset(viewsets.ModelViewSet):
    queryset =  TeamsManagement.objects.all()
    serializer_class = TeamsManagementSerializer
    pagination_class = GroupedResultsSetPagination
  
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.select_related('team').all()
    permission_classes = [IsAdminUser]
    serializer_class = RegisterUserSerializer
        
class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
class UserViewset(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination