from django.contrib.auth.decorators import login_required
from django.shortcuts import render

@login_required(login_url='/login/')
def render_about(request):
    return render(
        request,
        'web/pages/about.html',
        {'current_page': 'about'},
        status=200
    )