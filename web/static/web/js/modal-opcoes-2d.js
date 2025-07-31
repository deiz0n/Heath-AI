import { closeCurrentModal } from "./script.js";

function openModalOptions2D() {
    const modalOptions2D = document.querySelector('#modal-opcoes-2d-container');
    const modalAnalysisType = document.querySelector('#modal-tipo-imagem-container');
    const backgroundModal = document.querySelector('#modal-backdrop');

    if (modalOptions2D && modalAnalysisType && backgroundModal) {
        closeCurrentModal(modalAnalysisType.id);
        modalOptions2D.style.display = 'block';
        backgroundModal.classList.add('show');
    }
}

function closeModalOptions2D() {
    const modalOptions2D = document.querySelector('#modal-opcoes-2d-container');
    const backgroundModal = document.querySelector('#modal-backdrop');

    if (modalOptions2D && backgroundModal) {
        modalOptions2D.style.display = 'none';
        backgroundModal.classList.remove('show');
    }
}

function assignListenersModalOptions2D() {
    const btn2D = document.querySelector('#btn-2d');
    const btnClose = document.querySelector('#modal-opcoes-2d-container i');

    if (btn2D) {
        btn2D.removeEventListener('click', openModalOptions2D);
        btn2D.addEventListener('click', openModalOptions2D);
    }

    if (btnClose) {
        btnClose.removeEventListener('click', closeModalOptions2D);
        btnClose.addEventListener('click', closeModalOptions2D);
    }
}

document.addEventListener('DOMContentLoaded', assignListenersModalOptions2D);
document.body.addEventListener('htmx:afterSwap', assignListenersModalOptions2D);