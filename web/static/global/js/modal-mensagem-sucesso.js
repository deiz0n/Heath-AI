document.addEventListener('DOMContentLoaded', atribuirListenersModal);
document.addEventListener('htmx:afterSwap', atribuirListenersModal);

function fecharModal() {
    const bdMsgSucesso = document.querySelector('#modal-backdrop-msg-sucesso');
    bdMsgSucesso?.classList.remove('show');
}

function atribuirListenersModal() {
    const btnSair = document.querySelector('#modal-msg-sucesso-container i');
    const btnOk = document.querySelector('#btn-msg-sucesso');
    if (btnSair) btnSair.addEventListener('click', fecharModal);
    if (btnOk) btnOk.addEventListener('click', fecharModal);
}