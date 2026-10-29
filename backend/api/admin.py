from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, TherapistProfile, ClientProfile, Appointment, PHIAccessLog


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    # added role for admin
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Role", {"fields": ("role",)}),
    )

    # Add "role" to the Add-user form (after username + passwords)
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ("Role", {"fields": ("role",)}),
    )

    # Show role in the list + make it filterable
    list_display = ("username", "email", "role", "is_staff", "is_superuser")
    list_filter = BaseUserAdmin.list_filter + ("role",)


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