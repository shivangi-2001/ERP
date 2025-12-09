from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import ClientDetailViewset, ClientAddressViewset, ClientTeamViewset, \
ClientAssessmentTypeViewSet, UrlMappingViewset, InProgresViews, FindingViewset

router = DefaultRouter()
router.register(r'details', ClientDetailViewset)
router.register(r'address', ClientAddressViewset)
router.register(r'teams', ClientTeamViewset)
router.register(r'assessment', ClientAssessmentTypeViewSet)
router.register(r'url', UrlMappingViewset)
router.register(r'findings', FindingViewset)

urlpatterns = [
    path('', include(router.urls)),        
    path('in-progress/', InProgresViews.as_view(), name='in-progress-project'),
    # path('profile/', ProfileView.as_view(), name='profile'),
]

urlpatterns = urlpatterns