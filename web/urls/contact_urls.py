from django.urls import path
from web.views.contact_views import render_contact

urlpatterns = [
    path('', render_contact, name='contact'),
]
