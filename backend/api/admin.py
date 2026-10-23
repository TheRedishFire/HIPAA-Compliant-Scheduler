from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, TherapistProfile, ClientProfile, Appointment, PHIAccessLog


admin.site.register(User, UserAdmin)
admin.site.register(TherapistProfile)
admin.site.register(ClientProfile)
admin.site.register(Appointment)


@admin.register(PHIAccessLog)
class PHIAccessLogAdmin(admin.ModelAdmin):
    list_display = ("timestamp", "user", "method", "path", "status_code", "ip")
    list_filter = ("method", "status_code")
    search_fields = ("user__username", "path", "ip")
    date_hierarchy = "timestamp"
    readonly_fields = ("user", "timestamp", "method", "path", "status_code", "ip")

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False