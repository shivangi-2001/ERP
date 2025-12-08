from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import ClientDetailViewset, ClientAddressViewset, ClientTeamViewset, ClientAssessmentTypeViewSet, UrlMappingViewset

router = DefaultRouter()
router.register(r'details', ClientDetailViewset)
router.register(r'address', ClientAddressViewset)
router.register(r'teams', ClientTeamViewset)
router.register(r'assessment', ClientAssessmentTypeViewSet)
router.register(r'url', UrlMappingViewset)

urlpatterns = [
    path('', include(router.urls)),        
    # path('register/', RegisterView.as_view(), name='register'),
    # path('profile/', ProfileView.as_view(), name='profile'),
]

urlpatterns = urlpatterns