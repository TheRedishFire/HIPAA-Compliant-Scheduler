from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, ValidationError

from .models import Appointment, User
from .serializers import AppointmentSerializer


class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == User.Role.THERAPIST:
            return Appointment.objects.filter(therapist__user=user)
        if user.role == User.Role.CLIENT:
            return Appointment.objects.filter(client__user=user)
        return Appointment.objects.none()

    def perform_create(self, serializer):
        user = self.request.user

        if user.role == User.Role.CLIENT:
            serializer.save(
                client=user.client_profile,
                therapist=user.client_profile.therapist,
                status=Appointment.Status.REQUESTED,
            )
            return

        if user.role == User.Role.THERAPIST:
            client_profile = serializer.validated_data.get('client')
            if client_profile is None:
                raise ValidationError({'client': 'This field is required for therapists.'})
            if client_profile.therapist.user != user:
                raise PermissionDenied("You can only schedule appointments for your own clients.")
            serializer.save(
                therapist=user.therapist_profile,
                status=Appointment.Status.REQUESTED,
            )
            return

        raise PermissionDenied("Unknown role.")

    def perform_update(self, serializer):
        user = self.request.user
        instance = serializer.instance

        if user.role == User.Role.CLIENT:
            new_status = serializer.validated_data.get('status')
            if new_status and new_status not in (
                Appointment.Status.REQUESTED,
                Appointment.Status.CANCELED,
            ):
                raise PermissionDenied(
                    "Clients cannot confirm or complete their own appointments."
                )

            # Bug 8 fix: time is locked once the appointment is confirmed
            if instance.status != Appointment.Status.REQUESTED and (
                'start_time' in serializer.validated_data
                or 'end_time' in serializer.validated_data
            ):
                raise PermissionDenied(
                    "Cannot change appointment time once it has been confirmed."
                )

            serializer.save(
                client=instance.client,
                therapist=instance.therapist,
            )
            return

        if user.role == User.Role.THERAPIST:
            new_client = serializer.validated_data.get('client')
            if new_client is not None and new_client.therapist.user != user:
                raise PermissionDenied(
                    "You can only schedule appointments for your own clients."
                )
            serializer.save(therapist=instance.therapist)
            return

        raise PermissionDenied("Unknown role.")