import { closeCurrentModal } from "./script.js";

function openModalOptions3D() {
    const modalOptions3D = document.querySelector('#modal-opcoes-3d-container');
    const modalAnalysisType = document.querySelector('#modal-tipo-imagem-container');
    const backgroundModal = document.querySelector('#modal-backdrop');

    if (modalOptions3D && modalAnalysisType && backgroundModal) {
        closeCurrentModal(modalAnalysisType.id);
        modalOptions3D.style.display = 'block';
        backgroundModal.classList.add('show');
    }
}

function closeModalOptions3D() {
    const modalOptions3D = document.querySelector('#modal-opcoes-3d-container');
    const backgroundModal = document.querySelector('#modal-backdrop');

    if (modalOptions3D && backgroundModal) {
        modalOptions3D.style.display = 'none';
        backgroundModal.classList.remove('show');
    }
}

function assignListenersModalOptions3D() {
    const btnOpen = document.querySelector('#btn-3d');
    const btnClose = document.querySelector('#modal-opcoes-3d-container i');

    if (btnOpen) {
        btnOpen.removeEventListener('click', openModalOptions3D);
        btnOpen.addEventListener('click', openModalOptions3D);
    }

    if (btnClose) {
        btnClose.removeEventListener('click', closeModalOptions3D);
        btnClose.addEventListener('click', closeModalOptions3D);
    }
}

document.addEventListener('DOMContentLoaded', assignListenersModalOptions3D);
document.body.addEventListener('htmx:afterSwap', assignListenersModalOptions3D);