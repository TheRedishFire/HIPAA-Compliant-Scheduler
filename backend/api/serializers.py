from rest_framework import serializers
from .models import Appointment, User


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['id', 'therapist', 'client', 'start_time', 'end_time',
                  'status', 'created_at']
        read_only_fields = ['created_at']
        extra_kwargs = {
            'therapist': {'required': False},
            'client': {'required': False},
            'status': {'required': False},
        }

    def _resolve_therapist(self, attrs):
        """Figure out which therapist this appointment will end up on."""
        if self.instance is not None:                     # PATCH
            return self.instance.therapist
        request = self.context.get('request')
        if request is None:
            return None
        user = request.user
        if user.role == User.Role.CLIENT:
            profile = getattr(user, 'client_profile', None)
            return profile.therapist if profile else None
        if user.role == User.Role.THERAPIST:
            return attrs.get('therapist') or user.therapist_profile
        return None

    def validate(self, attrs):
        start = attrs.get('start_time', getattr(self.instance, 'start_time', None))
        end   = attrs.get('end_time',   getattr(self.instance, 'end_time',   None))

        if start and end and start >= end:
            raise serializers.ValidationError("end_time must be after start_time.")

        if start and end:
            therapist = self._resolve_therapist(attrs)
            if therapist:
                overlapping = Appointment.objects.filter(
                    therapist=therapist,
                    start_time__lt=end,       # existing starts before new ends
                    end_time__gt=start,       # existing ends after new starts
                )
                if self.instance is not None:
                    overlapping = overlapping.exclude(pk=self.instance.pk)
                if overlapping.exists():
                    raise serializers.ValidationError(
                        "This time slot overlaps an existing appointment."
                    )
        return attrs