from django.shortcuts import redirect
from django.urls import path, include

urlpatterns = [
    path('', lambda request: redirect('auth'), name='redirect_login'),

    path('auth/', include('web.urls.auth_urls')),
    path('exam/', include('web.urls.exam_urls')),
    path('patients/', include('web.urls.patient_urls')),
    path('dashboard/', include('web.urls.dashboard_urls')),
    path('home/', include('web.urls.home_urls')),
    path('about/', include('web.urls.about_urls')),
    path('contact/', include('web.urls.contact_urls')),
    path('upload/', include('web.urls.upload_urls')),
]