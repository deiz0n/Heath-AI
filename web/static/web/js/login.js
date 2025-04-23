const inputSenha = document.querySelector('#senha');
const checkboxMostrarSenha = document.querySelector('#mostrar-senha');

if (checkboxMostrarSenha)
    checkboxMostrarSenha.addEventListener('change', () => {
        if (inputSenha.type == 'password') inputSenha.type = 'text';
        else inputSenha.type = 'password';
    });