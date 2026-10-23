from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.throttling import AnonRateThrottle

# rate limiter
class AuthRateThrottle(AnonRateThrottle):
    scope = "auth"


class ThrottledObtainAuthToken(ObtainAuthToken):
    throttle_classes = [AuthRateThrottle]