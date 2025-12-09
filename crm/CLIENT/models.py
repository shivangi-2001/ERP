from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from core.models import AssessmentType, CompilanceType, Vulnerabilities

TESTER = get_user_model()

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
    client = models.ForeignKey(
        ClientDetail, 
        on_delete=models.CASCADE, 
        related_name='teams'
    )
    
    class Meta:
        unique_together = ('client', 'email')
    
    def __str__(self):
        return self.name
    
class ClientAssessmentType(models.Model):
    assessment_type = models.ForeignKey(AssessmentType, on_delete=models.CASCADE, related_name='client_assessment_type')
    client = models.ForeignKey(ClientDetail, on_delete=models.CASCADE, related_name='client_assessement')
    
    class Meta:
        unique_together = ('assessment_type', 'client')
        
    def __str__(self):
        return f"{self.client.name} - {self.assessment_type.name}"
        
class UrlMapping(models.Model):
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    qa_date = models.DateTimeField(null=True, blank=True)
    url = models.CharField(max_length=2000)
    client_assessment = models.ForeignKey(ClientAssessmentType, on_delete=models.CASCADE, related_name='urls')
    tester = models.ForeignKey(TESTER, on_delete=models.DO_NOTHING, null=True, blank=True)
    compliance = models.ForeignKey(CompilanceType, on_delete=models.CASCADE, null=True, blank=True)
    is_completed=models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.client_assessment.assessment_type}-{self.url})"
    
    
class Finding(models.Model):
    url = models.ForeignKey(UrlMapping, related_name="findings", on_delete=models.CASCADE)
    vulnerability = models.ForeignKey(Vulnerabilities, on_delete=models.SET_NULL, null=True)
    cvss_score = models.CharField(max_length=255, null=False)
    
    class Meta:
        unique_together = ('url', 'vulnerability', 'cvss_score')
        
    
    
        