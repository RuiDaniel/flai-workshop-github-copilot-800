"""octofit_tracker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from rest_framework.routers import DefaultRouter
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .views import (
    UserViewSet, TeamViewSet, ActivityViewSet,
    LeaderboardViewSet, WorkoutViewSet
)
import os

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'teams', TeamViewSet, basename='team')
router.register(r'activities', ActivityViewSet, basename='activity')
router.register(r'leaderboard', LeaderboardViewSet, basename='leaderboard')
router.register(r'workouts', WorkoutViewSet, basename='workout')


@api_view(['GET'])
def api_root(request):
    """Custom API root view that returns codespace URLs"""
    codespace_name = os.environ.get('CODESPACE_NAME', '')
    
    if codespace_name:
        base_url = f"https://{codespace_name}-8000.app.github.dev/api"
    else:
        base_url = request.build_absolute_uri('/api')
    
    return Response({
        'activities': f"{base_url}/activities/",
        'leaderboard': f"{base_url}/leaderboard/",
        'teams': f"{base_url}/teams/",
        'users': f"{base_url}/users/",
        'workouts': f"{base_url}/workouts/",
    })


urlpatterns = [
    path('', RedirectView.as_view(url='/api/', permanent=False)),
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api_root'),
    path('api/', include(router.urls)),
]
