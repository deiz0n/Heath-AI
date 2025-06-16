import {closeCurrentModal} from "./script.js";

function openModalAnalysisType() {
    const modalAnalysisType = document.querySelector('#modal-tipo-imagem-container');
    const backgroundModal = document.querySelector('#modal-backdrop');
    const modalInfoExam = document.querySelector('#modal-info-exam-container');

    if (modalAnalysisType && backgroundModal) {
        modalAnalysisType.style.display = 'block';
        backgroundModal.classList.add('show');
    }

    if (modalInfoExam) closeCurrentModal(modalInfoExam.id)
}

function closeModalAnalysisType() {
    const modalAnalysisType = document.querySelector('#modal-tipo-imagem-container');
    const backgroundModal = document.querySelector('#modal-backdrop');
    if (modalAnalysisType && backgroundModal) {
        backgroundModal.classList.remove('show');
        modalAnalysisType.style.display = 'none';
    }
}

function updateTitleModalAnalysisType() {
    const titleModalAnalysisType = document.querySelector('#modal-tipo-imagem-container .modal-titulo');
    titleModalAnalysisType.textContent = 'Selecione uma das opções para visualização:';
}

export function assignListenersModal() {
    const btnClose = document.querySelector('#modal-tipo-imagem-container i');
    const btnOpenModalAnalysisType = document.querySelector('#main-btn');
    const btnOpenModalTypeShowView = document.querySelector('#modal-info-btn-show-images');

    if (btnClose) {
        btnClose.removeEventListener('click', closeModalAnalysisType);
        btnClose.addEventListener('click', closeModalAnalysisType);
    }
    if (btnOpenModalAnalysisType) {
        btnOpenModalAnalysisType.removeEventListener('click', openModalAnalysisType);
        btnOpenModalAnalysisType.addEventListener('click', openModalAnalysisType);
    }
    if (btnOpenModalTypeShowView) {
        updateTitleModalAnalysisType();
        btnOpenModalTypeShowView.removeEventListener('click', openModalAnalysisType);
        btnOpenModalTypeShowView.addEventListener('click', openModalAnalysisType);
    }
}

document.addEventListener('DOMContentLoaded', assignListenersModal);
document.body.addEventListener('htmx:afterSwap', assignListenersModal);
