const inputSenha = document.querySelector('#senha');
const checkboxMostrarSenha = document.querySelector('#mostrar-senha');
const linkCadastro = document.querySelector('#link-cadastro span');


if (checkboxMostrarSenha)
    checkboxMostrarSenha.addEventListener('change', () => {
        if (inputSenha.type === 'password') inputSenha.type = 'text';
        else inputSenha.type = 'password';
    });

if (linkCadastro)
    linkCadastro.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.replace(e.target.href);
    })