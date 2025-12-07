from django.urls import path, include

from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import TeamViewset, RegisterView, ProfileView, UserViewset, AssessmentViewSet, VulnerabilityViewSet, CompilanceViewSet

router = DefaultRouter()
router.register(r'compliance', CompilanceViewSet)
router.register(r'assessments', AssessmentViewSet)
router.register(r'vulnerabilities', VulnerabilityViewSet)
router.register(r'teams', TeamViewset)
router.register(r'users', UserViewset)

urlpatterns = [
    path('', include(router.urls)),        
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path("auth/token/", TokenObtainPairView.as_view(), name="login"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="refresh_access_token")
]

urlpatterns = urlpatterns
