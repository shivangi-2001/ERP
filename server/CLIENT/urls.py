from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import ClientDetailViewset, ClientAddressViewset, ClientTeamViewset

router = DefaultRouter()
router.register(r'details', ClientDetailViewset)
router.register(r'address', ClientAddressViewset)
router.register(r'teams', ClientTeamViewset)

urlpatterns = [
    path('', include(router.urls)),        
]

urlpatterns = urlpatterns