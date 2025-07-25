from django.contrib.auth.decorators import login_required
from django.shortcuts import render

@login_required(login_url='/login/')
def render_contact(request):
    return render(
        request,
        'web/pages/contact.html',
        {'current_page': 'contact'},
        status=200
    )