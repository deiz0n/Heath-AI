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

export function assignListenersModal() {
    const btnClose = document.querySelector('#modal-tipo-imagem-container i');
    const btnStart = document.querySelector('#main-btn');
    if (btnClose) {
        btnClose.removeEventListener('click', closeModalAnalysisType);
        btnClose.addEventListener('click', closeModalAnalysisType);
    }
    if (btnStart) {
        btnStart.removeEventListener('click', openModalAnalysisType);
        btnStart.addEventListener('click', openModalAnalysisType);
    }
}

document.addEventListener('DOMContentLoaded', assignListenersModal);
document.body.addEventListener('htmx:afterSwap', assignListenersModal);
