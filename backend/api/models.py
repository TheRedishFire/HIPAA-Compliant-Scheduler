from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class User(AbstractUser):
    class Role(models.TextChoices):
        THERAPIST = 'THERAPIST', 'Therapist'
        CLIENT = 'CLIENT', 'Client'

    
    role = models.CharField(
        max_length=20, 
        choices=Role.choices, 
        default=Role.CLIENT
    )

class TherapistProfile(models.Model):
    # Linking to auth user
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='therapist_profile'
    )
    professional_title = models.CharField(max_length=100)
    contact_phone = models.CharField(max_length=20)
    def __str__(self):
        return f"Therapist: {self.user.username}"

class ClientProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='client_profile'
    )

    therapist = models.ForeignKey(
        TherapistProfile, 
        on_delete=models.CASCADE, 
        related_name='clients'
    )
    date_of_birth = models.DateField(null=True, blank=True)
    phone_number = models.CharField(max_length=20)

    # will add the encrypted PHI fields here in weeks 10-12

    def __str__(self):
        return f"Client: {self.user.username}"

class Appointment(models.Model):
    class Status(models.TextChoices):
        REQUESTED = 'REQUESTED', 'Requested'
        CONFIRMED = 'CONFIRMED', 'Confirmed'
        CANCELED = 'CANCELED', 'Canceled'
        COMPLETED = 'COMPLETED', 'Completed'

    therapist = models.ForeignKey(
        TherapistProfile,
        on_delete=models.CASCADE,
        related_name='appointments'
    )

    client = models.ForeignKey(
        ClientProfile,
        on_delete=models.CASCADE,
        related_name='appointments'
    )

    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.REQUESTED
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.client.user.username} with {self.therapist.user.username} at {self.start_time}"