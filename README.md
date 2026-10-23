# Valentine Counseling API

Backend API for a therapy practice — therapists manage their client panel
and appointments; clients request sessions with their assigned therapist.

## Stack
- Django 5 + Django REST Framework
- Token authentication
- SQLite (dev) — Postgres-ready
- Custom user model with role-based access (therapist / client)

## Features
- Role-based data isolation — therapists only see their own clients'
  appointments; clients only see their own
- Appointment lifecycle: requested → confirmed → completed / canceled
- Server-side enforcement of ownership (clients cannot self-confirm,
  reassign appointments, or change times on confirmed sessions)
- Time-range and double-booking validation
- Django admin for staff

## API
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api-token-auth/` | Exchange credentials for a token |
| GET/POST | `/api/appointments/` | List / create appointments (filtered by role) |
| GET/PATCH/DELETE | `/api/appointments/{id}/` | Retrieve / update / delete |

## Setup
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver