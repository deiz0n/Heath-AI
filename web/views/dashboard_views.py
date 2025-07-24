from django.contrib.auth.decorators import login_required
from django.shortcuts import render

@login_required(login_url='/login/')
def render_dashboard(request):
    return render(
        request,
        'web/pages/dashboard.html',
        {'current_page': 'dashboard'},
        status=200
    )
