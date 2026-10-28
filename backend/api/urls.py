from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AppointmentViewSet, MeView, RegisterView


router = DefaultRouter()
router.register(r'appointments', AppointmentViewSet, basename='appointment')

urlpatterns = [
    path('', include(router.urls)),
    path('me/', MeView.as_view()),  
    path('register/', RegisterView.as_view()),
]