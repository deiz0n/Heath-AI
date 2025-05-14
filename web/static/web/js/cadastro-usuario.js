const linkLogin = document.querySelector('#link-login span');

if (linkLogin)
    linkLogin.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.replace(e.target.href);
    })