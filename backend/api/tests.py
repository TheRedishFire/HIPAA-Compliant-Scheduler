from django.test import TestCase

"""
Test suite for the appointments API.

One test per security or integrity bug found during development.
Run with:  python manage.py test backend.api
"""

from datetime import timedelta

from django.core.cache import cache
from django.test import TestCase
from django.utils import timezone
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from .models import Appointment, ClientProfile, User, TherapistProfile


class BaseAPITestCase(TestCase):
    """
    Shared fixture:
      - 2 therapists (t1, t2)
      - t1 has 2 clients (c1, c2)
      - t2 has 1 client (c3)
      - 1 CONFIRMED appointment for c1 with t1, next week
    """

    def setUp(self):
        cache.clear()  # reset throttle counters between tests

        self.t1_user = User.objects.create_user(
            username="t1", password="pass12345", role=User.Role.THERAPIST
        )
        self.t1 = TherapistProfile.objects.create(
            user=self.t1_user, professional_title="LCSW", contact_phone="555-0001"
        )

        self.t2_user = User.objects.create_user(
            username="t2", password="pass12345", role=User.Role.THERAPIST
        )
        self.t2 = TherapistProfile.objects.create(
            user=self.t2_user, professional_title="PhD", contact_phone="555-0002"
        )

        self.c1_user = User.objects.create_user(
            username="c1", password="pass12345", role=User.Role.CLIENT,
            first_name="Alice", last_name="A",
        )
        self.c1 = ClientProfile.objects.create(
            user=self.c1_user, therapist=self.t1, phone_number="555-1001"
        )

        self.c2_user = User.objects.create_user(
            username="c2", password="pass12345", role=User.Role.CLIENT
        )
        self.c2 = ClientProfile.objects.create(
            user=self.c2_user, therapist=self.t1, phone_number="555-1002"
        )

        self.c3_user = User.objects.create_user(
            username="c3", password="pass12345", role=User.Role.CLIENT
        )
        self.c3 = ClientProfile.objects.create(
            user=self.c3_user, therapist=self.t2, phone_number="555-1003"
        )

        self.token_c1 = Token.objects.create(user=self.c1_user)
        self.token_c2 = Token.objects.create(user=self.c2_user)
        self.token_t1 = Token.objects.create(user=self.t1_user)
        self.token_t2 = Token.objects.create(user=self.t2_user)

        self.api = APIClient()

        self.start = timezone.now() + timedelta(days=7)
        self.end = self.start + timedelta(hours=1)
        self.appt = Appointment.objects.create(
            therapist=self.t1,
            client=self.c1,
            start_time=self.start,
            end_time=self.end,
            status=Appointment.Status.CONFIRMED,
        )

    def auth(self, token):
        return {"HTTP_AUTHORIZATION": f"Token {token.key}"}


# -------------------------------------------------------------
# Authentication
# -------------------------------------------------------------


class AuthenticationTests(BaseAPITestCase):
    def test_anonymous_gets_401(self):
        """Unauthenticated requests are rejected everywhere."""
        r = self.api.get("/api/appointments/")
        self.assertEqual(r.status_code, 401)

    def test_valid_token_gets_200(self):
        r = self.api.get("/api/appointments/", **self.auth(self.token_c1))
        self.assertEqual(r.status_code, 200)


# -------------------------------------------------------------
# Role-based isolation
# -------------------------------------------------------------


class RoleFilteringTests(BaseAPITestCase):
    def test_client_sees_only_own_appointments(self):
        """c2 shouldn't see c1's appointment in the list."""
        r = self.api.get("/api/appointments/", **self.auth(self.token_c2))
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json(), [])

    def test_client_cannot_retrieve_others_appointment(self):
        """c2 GETs c1's appt id → 404 (not in queryset)."""
        r = self.api.get(
            f"/api/appointments/{self.appt.id}/", **self.auth(self.token_c2)
        )
        self.assertEqual(r.status_code, 404)

    def test_therapist_sees_own_panel_only(self):
        r = self.api.get("/api/appointments/", **self.auth(self.token_t1))
        self.assertEqual(r.status_code, 200)
        ids = [a["id"] for a in r.json()]
        self.assertIn(self.appt.id, ids)

    def test_other_therapist_sees_nothing(self):
        """t2 has no appointments → empty list."""
        r = self.api.get("/api/appointments/", **self.auth(self.token_t2))
        self.assertEqual(r.json(), [])


# -------------------------------------------------------------
# Bug 1 — Client create can't spoof client/therapist/status
# -------------------------------------------------------------


class CreateSecurityTests(BaseAPITestCase):
    def test_client_create_forces_own_identity(self):
        """
        Bug 1 (create): c1 sends a *valid* client/therapist id belonging to
        someone else → server overrides them with c1's own profile.
        (Invalid ids like 9999 are already rejected at field validation —
        see test_invalid_pk_rejected_at_validation below.)
        """
        payload = {
            "start_time": (timezone.now() + timedelta(days=20)).isoformat(),
            "end_time": (timezone.now() + timedelta(days=20, hours=1)).isoformat(),
            "client": self.c2.id,        # valid PK, but wrong client
            "therapist": self.t2.id,     # valid PK, but wrong therapist
            "status": "CONFIRMED",       # tried to self-confirm
        }
        r = self.api.post(
            "/api/appointments/",
            payload,
            format="json",
            **self.auth(self.token_c1),
        )
        self.assertEqual(r.status_code, 201)
        body = r.json()
        self.assertEqual(body["client"], self.c1.id)          # forced
        self.assertEqual(body["therapist"], self.t1.id)       # forced
        self.assertEqual(body["status"], "REQUESTED")         # forced        # forced

    def test_therapist_create_without_client_fails_cleanly(self):
        """Bug 3: therapist POST with no client → 400, not 500."""
        payload = {
            "start_time": (timezone.now() + timedelta(days=30)).isoformat(),
            "end_time": (timezone.now() + timedelta(days=30, hours=1)).isoformat(),
        }
        r = self.api.post(
            "/api/appointments/",
            payload,
            format="json",
            **self.auth(self.token_t1),
        )
        self.assertEqual(r.status_code, 400)

    def test_therapist_cannot_book_other_therapists_client(self):
        """Bug 1b on create: t1 tries to book c3 (belongs to t2) → 403."""
        payload = {
            "client": self.c3.id,
            "start_time": (timezone.now() + timedelta(days=31)).isoformat(),
            "end_time": (timezone.now() + timedelta(days=31, hours=1)).isoformat(),
        }
        r = self.api.post(
            "/api/appointments/",
            payload,
            format="json",
            **self.auth(self.token_t1),
        )
        self.assertEqual(r.status_code, 403)
        
    def test_invalid_pk_rejected_at_validation(self):
        """
        Sending nonexistent ids (9999) is caught by the serializer's
        PrimaryKeyRelatedField, before perform_create runs.
        """
        payload = {
            "start_time": (timezone.now() + timedelta(days=21)).isoformat(),
            "end_time": (timezone.now() + timedelta(days=21, hours=1)).isoformat(),
            "client": 9999,
            "therapist": 9999,
        }
        r = self.api.post(
            "/api/appointments/",
            payload,
            format="json",
            **self.auth(self.token_c1),
        )
        self.assertEqual(r.status_code, 400)
        body = r.json()
        self.assertIn("client", body)
        self.assertIn("therapist", body)


# -------------------------------------------------------------
# Bug 1b + Bug 8 — Update security
# -------------------------------------------------------------


class UpdateSecurityTests(BaseAPITestCase):
    def test_client_patch_cannot_change_client_field(self):
        """Bug 1: client tries to reassign appt to another client → ignored."""
        r = self.api.patch(
            f"/api/appointments/{self.appt.id}/",
            {"client": self.c2.id},
            format="json",
            **self.auth(self.token_c1),
        )
        self.assertEqual(r.status_code, 200)
        self.appt.refresh_from_db()
        self.assertEqual(self.appt.client_id, self.c1.id)  # unchanged

    def test_client_cannot_confirm_own_appointment(self):
        """Bug 5/7: client PATCH status=CONFIRMED on REQUESTED appt → 403."""
        appt = Appointment.objects.create(
            therapist=self.t1,
            client=self.c1,
            start_time=timezone.now() + timedelta(days=40),
            end_time=timezone.now() + timedelta(days=40, hours=1),
            status=Appointment.Status.REQUESTED,
        )
        r = self.api.patch(
            f"/api/appointments/{appt.id}/",
            {"status": "CONFIRMED"},
            format="json",
            **self.auth(self.token_c1),
        )
        self.assertEqual(r.status_code, 403)

    def test_client_cannot_change_time_on_confirmed(self):
        """Bug 8: client tries to move a CONFIRMED appointment → 403."""
        r = self.api.patch(
            f"/api/appointments/{self.appt.id}/",
            {
                "start_time": (timezone.now() + timedelta(days=50)).isoformat(),
                "end_time": (timezone.now() + timedelta(days=50, hours=1)).isoformat(),
            },
            format="json",
            **self.auth(self.token_c1),
        )
        self.assertEqual(r.status_code, 403)

    def test_client_can_cancel_confirmed(self):
        """Bug 8 doesn't over-lock — cancel is still allowed."""
        r = self.api.patch(
            f"/api/appointments/{self.appt.id}/",
            {"status": "CANCELED"},
            format="json",
            **self.auth(self.token_c1),
        )
        self.assertEqual(r.status_code, 200)
        self.appt.refresh_from_db()
        self.assertEqual(self.appt.status, Appointment.Status.CANCELED)


# -------------------------------------------------------------
# Bug 5 + 6 — Time validation and double-booking
# -------------------------------------------------------------


class TimeValidationTests(BaseAPITestCase):
    def test_end_before_start_rejected(self):
        """Bug 5: end_time <= start_time → 400."""
        start = timezone.now() + timedelta(days=60)
        payload = {
            "start_time": start.isoformat(),
            "end_time": (start - timedelta(hours=1)).isoformat(),
        }
        r = self.api.post(
            "/api/appointments/", payload, format="json", **self.auth(self.token_c1)
        )
        self.assertEqual(r.status_code, 400)

    def test_overlap_rejected(self):
        """Bug 6: overlapping time slot → 400."""
        payload = {
            "start_time": (self.start + timedelta(minutes=30)).isoformat(),
            "end_time": (self.end + timedelta(minutes=30)).isoformat(),
        }
        r = self.api.post(
            "/api/appointments/", payload, format="json", **self.auth(self.token_c1)
        )
        self.assertEqual(r.status_code, 400)

    def test_adjacent_slot_allowed(self):
        """Bug 6: exact-adjacent (end == next start) is fine."""
        payload = {
            "start_time": self.end.isoformat(),
            "end_time": (self.end + timedelta(hours=1)).isoformat(),
        }
        r = self.api.post(
            "/api/appointments/", payload, format="json", **self.auth(self.token_c1)
        )
        self.assertEqual(r.status_code, 201)


# -------------------------------------------------------------
# DELETE is disabled (HIPAA record retention)
# -------------------------------------------------------------


class DeleteDisabledTests(BaseAPITestCase):
    def test_delete_returns_405(self):
        r = self.api.delete(
            f"/api/appointments/{self.appt.id}/", **self.auth(self.token_c1)
        )
        self.assertEqual(r.status_code, 405)

    def test_appointment_survives_delete_attempt(self):
        self.api.delete(
            f"/api/appointments/{self.appt.id}/", **self.auth(self.token_c1)
        )
        self.assertTrue(
            Appointment.objects.filter(id=self.appt.id).exists(),
            "Appointment must not be deleted by a DELETE request.",
        )


# -------------------------------------------------------------
# Registration
# -------------------------------------------------------------


class RegisterTests(BaseAPITestCase):
    def test_register_creates_client_and_returns_token(self):
        r = self.api.post(
            "/api/register/",
            {
                "username": "newbie",
                "email": "newbie@example.com",
                "first_name": "New",
                "last_name": "Bie",
                "phone_number": "555-9999",
                "password": "SecurePass2025!",
                "password_confirm": "SecurePass2025!",
            },
            format="json",
        )
        self.assertEqual(r.status_code, 201)
        body = r.json()
        self.assertIn("token", body)
        self.assertEqual(body["user"]["role"], "CLIENT")
        # Profile auto-created and assigned to the first therapist (t1)
        new_user = User.objects.get(username="newbie")
        self.assertTrue(hasattr(new_user, "client_profile"))
        self.assertEqual(new_user.client_profile.therapist_id, self.t1.id)

    def test_register_rejects_duplicate_username(self):
        r = self.api.post(
            "/api/register/",
            {
                "username": "c1",  # already exists
                "email": "x@example.com",
                "phone_number": "555-0000",
                "password": "SecurePass2025!",
                "password_confirm": "SecurePass2025!",
            },
            format="json",
        )
        self.assertEqual(r.status_code, 400)
        self.assertIn("username", r.json())

    def test_register_rejects_weak_password(self):
        r = self.api.post(
            "/api/register/",
            {
                "username": "weakuser",
                "email": "w@example.com",
                "phone_number": "555-0000",
                "password": "123",
                "password_confirm": "123",
            },
            format="json",
        )
        self.assertEqual(r.status_code, 400)
        self.assertIn("password", r.json())

    def test_register_rejects_mismatched_passwords(self):
        r = self.api.post(
            "/api/register/",
            {
                "username": "mismatch",
                "email": "m@example.com",
                "phone_number": "555-0000",
                "password": "SecurePass2025!",
                "password_confirm": "DifferentPass2025!",
            },
            format="json",
        )
        self.assertEqual(r.status_code, 400)


# -------------------------------------------------------------
# Serializer output — display_name fallback + FK names
# -------------------------------------------------------------


class SerializerOutputTests(BaseAPITestCase):
    def test_full_name_used_when_available(self):
        r = self.api.get(
            f"/api/appointments/{self.appt.id}/", **self.auth(self.token_c1)
        )
        body = r.json()
        self.assertEqual(body["client_name"], "Alice A")  # first + last

    def test_username_fallback_when_name_missing(self):
        """c2 has no first/last name → falls back to username."""
        appt = Appointment.objects.create(
            therapist=self.t1,
            client=self.c2,
            start_time=timezone.now() + timedelta(days=70),
            end_time=timezone.now() + timedelta(days=70, hours=1),
            status=Appointment.Status.REQUESTED,
        )
        r = self.api.get(
            f"/api/appointments/{appt.id}/", **self.auth(self.token_c2)
        )
        self.assertEqual(r.json()["client_name"], "c2")
