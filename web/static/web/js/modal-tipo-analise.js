function openModalAnalysisType() {
    const modalAnalysisType = document.querySelector('#modal-tipo-imagem-container');
    const backgroundModal = document.querySelector('#modal-backdrop');
    if (modalAnalysisType && backgroundModal) {
        modalAnalysisType.style.display = 'block';
        backgroundModal.classList.add('show');
    }
}

function closeModalAnalysisType() {
    const modalAnalysisType = document.querySelector('#modal-tipo-imagem-container');
    const backgroundModal = document.querySelector('#modal-backdrop');
    if (modalAnalysisType && backgroundModal) {
        backgroundModal.classList.remove('show');
        modalAnalysisType.style.display = 'none';
    }
}

function assignListenersModalTypeAnalysis() {
    const btnClose = document.querySelector('#modal-tipo-imagem-container i');
    const btnOpenModalAnalysisType = document.querySelector('#main-btn');

    if (btnClose) {
        btnClose.removeEventListener('click', closeModalAnalysisType);
        btnClose.addEventListener('click', closeModalAnalysisType);
    }
    if (btnOpenModalAnalysisType) {
        btnOpenModalAnalysisType.removeEventListener('click', openModalAnalysisType);
        btnOpenModalAnalysisType.addEventListener('click', openModalAnalysisType);
    }
}

document.addEventListener('DOMContentLoaded', assignListenersModalTypeAnalysis);
document.body.addEventListener('htmx:afterSwap', assignListenersModalTypeAnalysis);
