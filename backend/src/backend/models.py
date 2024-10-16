from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    created_at = models.DateTimeField(_("created at"), auto_now_add=True)
    modified_at = models.DateTimeField(_("modified at"), auto_now=True)

    class Meta:
        db_table = "users"
        verbose_name = _("user")
        verbose_name_plural = _("users")

    def __str__(self):
        return self.email if self.email else self.username
    
class EnvironmentData(models.Model):
    datetime = models.DateTimeField(_("Datetime"), primary_key=True)  
    temperature = models.FloatField(_("Temperature"))  
    humidity = models.FloatField(_("Humidity")) 

    class Meta:
        db_table = "environment" 
        managed = False 
        verbose_name = _("Environment Data")
        verbose_name_plural = _("Environment Data")
        

    def __str__(self):
        return f"Datetime: {self.datetime}, Temp: {self.temperature}, Humidity: {self.humidity}"

class StatusData(models.Model):
    datetime = models.DateTimeField(_("Datetime"), primary_key=True)  
    crying = models.CharField(_("Crying"))  

    class Meta:
        db_table = "status" 
        managed = False 
        verbose_name = _("Status Data")
        verbose_name_plural = _("Status Data")

    def __str__(self):
        return f"Datetime: {self.datetime}, Crying: {self.crying}"
    
class MovingStatusData(models.Model):
    datetime = models.DateTimeField(_("Datetime"), primary_key=True)  
    state = models.CharField(_("State"))  

    class Meta:
        db_table = "sleeping" 
        managed = False 
        verbose_name = _("Moving Status Data")
        verbose_name_plural = _("Moving Status Data")

    def __str__(self):
        return f"Datetime: {self.datetime}, Crying: {self.state}"
