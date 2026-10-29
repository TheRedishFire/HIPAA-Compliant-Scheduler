from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, ValidationError

from .models import Appointment, User
from .serializers import AppointmentSerializer, RegisterSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.throttling import AnonRateThrottle
from rest_framework.exceptions import MethodNotAllowed
from django.conf import settings

class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    def destroy(self, request, *args, **kwargs):
        raise MethodNotAllowed(
        "DELETE",
        detail="Appointments cannot be deleted. Use status=CANCELED to cancel, "
               "or contact the practice to archive completed sessions."
    )

    def get_queryset(self):
        user = self.request.user
        base = Appointment.objects.select_related(
        "client__user", "therapist__user"
        )
        if user.role == User.Role.THERAPIST:
            return Appointment.objects.filter(therapist__user=user)
        if user.role == User.Role.CLIENT:
            return Appointment.objects.filter(client__user=user)
        return base.none()

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

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "role": user.role,
            "first_name": user.first_name,
            "last_name": user.last_name,
        })

class RegisterRateThrottle(AnonRateThrottle):
    scope = "register"


class RegisterView(APIView):
    permission_classes = []
    authentication_classes = []
    throttle_classes = [RegisterRateThrottle]

    def post(self, request):
        if not settings.REGISTRATION_ENABLED:
            raise PermissionDenied(
                "Registration is currently by invitation. "
                "Please contact the practice to be added as a client."
            )
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)

        return Response(
            {
                "token": token.key,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "role": user.role,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                },
            },
            status=status.HTTP_201_CREATED,
        )