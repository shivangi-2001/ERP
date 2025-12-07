from django.db import models
from django.utils.translation import gettext_lazy as _
from core.models import AssessmentType

class ClientAddress(models.Model):
    address = models.CharField(max_length=300)
    city = models.CharField(max_length=255)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20) 
    country = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.city}, {self.country}"
    
class ClientDetail(models.Model):
    name = models.CharField(max_length=400)
    email = models.EmailField(unique=True)
    phone_code = models.CharField(max_length=5)
    phone = models.CharField(max_length=15)
    profile = models.ImageField(upload_to='client_company_profiles/', null=True)
    address = models.OneToOneField(ClientAddress, on_delete=models.CASCADE)
    date_joined = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class ClientTeam(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True, help_text=_("Choose email wisely, it can not be changed."))
    designation = models.CharField(max_length=255)
    mobile_code = models.CharField(max_length=10)
    mobile = models.CharField(max_length=15)
    company = models.ForeignKey(
        ClientDetail, 
        on_delete=models.CASCADE, 
        related_name='teams'
    )
    
    class Meta:
        unique_together = ('company', 'email')
    
    def __str__(self):
        return self.name
    
class ClientAssessmentType(models.Model):
    assesment_type = models.ForeignKey(AssessmentType, on_delete=models.CASCADE, related_name='client_assessment_type')
    client = models.ForeignKey(ClientDetail, on_delete=models.CASCADE, related_name='client_assessement')
    
    class Meta:
        unique_together = ('assesment_type', 'client')