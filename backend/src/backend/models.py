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
    
class TemperatureHumidityData(models.Model):
    SOUND_STATE_CHOICES = [
        ('happiness', _("Happiness")),
        ('sadness', _("Sadness")),
        ('hungry', _("Hungry")),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="temperature_humidity_data")
    temperature = models.FloatField(_("Temperature"))
    humidity = models.FloatField(_("Humidity"))
    sound_state = models.CharField(_("Sound State"), max_length=10, choices=SOUND_STATE_CHOICES, default='quiet')
    timestamp = models.DateTimeField(_("Timestamp"), auto_now_add=True)

    class Meta:
        db_table = "temperature_humidity_data"
        verbose_name = _("Temperature, Humidity, and Sound Data")
        verbose_name_plural = _("Temperature, Humidity, and Sound Data")

    def __str__(self):
        return f"{self.user.email if self.user.email else self.user.username} - {self.timestamp} - Temp: {self.temperature}, Humidity: {self.humidity}, Sound: {self.get_sound_state_display()}"