from django.urls import path
from web.views.dashboard_views import render_dashboard

urlpatterns = [
    path('', render_dashboard, name='dashboard'),
]
