import logging

logger = logging.getLogger(__name__)

# Anything under these prefixes is considered PHI-bearing and gets logged.
# Narrow list > broad list — you want to know exactly what's covered.
PHI_PATH_PREFIXES = (
    "/api/",          # all DRF endpoints
    "/admin/api/",    # admin views of User / ClientProfile / Appointment / etc.
)

PHI_METHODS = frozenset({"GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"})


def _client_ip(request):
    """Get the real client IP, handling a reverse proxy (X-Forwarded-For)."""
    xff = request.META.get("HTTP_X_FORWARDED_FOR")
    if xff:
        return xff.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR") or None


class PHIAccessLogMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if not self._is_phi_request(request):
            return self.get_response(request)

        try:
            response = self.get_response(request)
            status = response.status_code
        except Exception:
            # View raised — Django will turn this into a 500 response.
            # Log it as 500 before letting the exception propagate.
            self._write_log(request, 500)
            raise

        self._write_log(request, status)
        return response

    def _is_phi_request(self, request):
        return (
            request.method in PHI_METHODS
            and request.path.startswith(PHI_PATH_PREFIXES)
        )

    def _write_log(self, request, status_code):
        try:
            # Imported here to avoid AppRegistryNotReady during startup
            from .models import PHIAccessLog

            user = getattr(request, "user", None)
            if not getattr(user, "is_authenticated", False):
                user = None

            PHIAccessLog.objects.create(
                user=user,
                method=request.method,
                path=request.path[:500],
                status_code=status_code,
                ip=_client_ip(request),
            )
        except Exception:
            # Never let audit logging break the actual request/response cycle
            logger.exception("Failed to write PHIAccessLog")