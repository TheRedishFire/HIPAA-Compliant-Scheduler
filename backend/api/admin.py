from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, TherapistProfile, ClientProfile, Appointment

admin.site.register(User, UserAdmin)
admin.site.register(TherapistProfile)
admin.site.register(ClientProfile)
admin.site.register(Appointment)