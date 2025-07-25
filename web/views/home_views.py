from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect


@login_required(login_url='/login/', redirect_field_name='next')
def render_home(request):
    if request.headers.get('Target') == 'teste':
        return redirect('find-patients')

    return render(
        request,
        'web/pages/pagina-inicial.html',
        {'current_page': 'home', 'title_page': 'Página inicial'},
        status=200
    )
