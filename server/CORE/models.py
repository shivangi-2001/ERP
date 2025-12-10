from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractUser, AbstractBaseUser, PermissionsMixin
from django.utils import timezone
from .manager import UserManager

class CompilanceType(models.Model):
    name = models.CharField(max_length=255, unique=True)
   
    def __str__(self):
        return self.name

class AssessmentType(models.Model):
    name = models.CharField(max_length=255, unique=True)
    
    def __str__(self):
        return f"{self.name}"

class Vulnerabilities(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    remediations = models.TextField()
    impact = models.TextField()
    reference=models.URLField()
    cvss=models.CharField(max_length=200, null=True, blank=True)
    category_of_testing = models.ForeignKey(AssessmentType, on_delete=models.DO_NOTHING, related_name="vulnerabilities")
    
    class Meta:
        db_table_comment = "Vulnerabilities list"
        
    def __str__(self):
        return f"{self.name} - {self.category_of_testing.name}"
        

class TeamsManagement(models.Model):
    team_name = models.CharField(max_length=255, unique=True)
    
    def __str__(self):
        return self.team_name
    
    
#  Employee User
class User(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(_("first name"), max_length=150, blank=True)
    last_name = models.CharField(_("last name"), max_length=150, blank=True)
    email = models.EmailField(unique=True, null=False, blank=False, help_text=_("Choose email wisely, it can not be changed."))
    contact_number = models.CharField(max_length=20, null=True, blank=True)
    designation = models.CharField(max_length=255, null=True, blank=True)
    team = models.ForeignKey(TeamsManagement, on_delete=models.DO_NOTHING, null=True, blank=True)
    is_staff = models.BooleanField(
        _("staff status"),
        default=False,
        help_text=_("Designates whether the user can log into this admin site."),
    )
    is_active = models.BooleanField(
        _("active"),
        default=True,
        help_text=_(
            "Designates whether this user should be treated as active. "
            "Unselect this instead of deleting accounts."
        ),
    )
    date_joined = models.DateTimeField(_("date joined"), default=timezone.now)

    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
       
        
    def __str__(self):
        return self.first_name + " " + self.last_name
    
    class Meta:
        db_table_comment = "Employee in your company"
        
