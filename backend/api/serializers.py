from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import Appointment, User, TherapistProfile, ClientProfile


class AppointmentSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(
        source="client.user.display_name", read_only=True
    )
    therapist_name = serializers.CharField(
        source="therapist.user.display_name", read_only=True
    )

    class Meta:
        model = Appointment
        fields = [
            'id',
            'therapist', 'therapist_name',
            'client', 'client_name',
            'start_time', 'end_time',
            'status', 'created_at',
        ]
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

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    phone_number = serializers.CharField(max_length=20)
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError(
                {"password_confirm": "Passwords do not match."}
            )

        try:
            validate_password(attrs["password"])
        except DjangoValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})

        therapist = TherapistProfile.objects.first()
        if therapist is None:
            raise serializers.ValidationError(
                "The practice is not currently accepting new clients. "
                "Please contact us directly."
            )
        attrs["_therapist"] = therapist
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        validated_data.pop("password_confirm")
        therapist = validated_data.pop("_therapist")
        phone_number = validated_data.pop("phone_number")

        user = User.objects.create_user(
            role=User.Role.CLIENT,
            password=password,
            **validated_data,
        )
        ClientProfile.objects.create(
            user=user,
            therapist=therapist,
            phone_number=phone_number,
        )
        return user