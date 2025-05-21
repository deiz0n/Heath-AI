const btnStart = document.querySelector('#main-btn');

export const modalAnalysisType = document.querySelector('#modal-tipo-imagem-container');
export const backgroundModal = document.querySelector('#modal-backdrop');

document.addEventListener('DOMContentLoaded', () => {
    assignListenersModal();
    if (btnStart) btnStart.addEventListener('click', openModalAnalysisType);
})

function openModalAnalysisType() {
    modalAnalysisType.style.display = 'block';
    backgroundModal.classList.add('show')
}

function closeModalAnalysisType() {
    backgroundModal.classList.remove('show');
    modalAnalysisType.style.display = 'none';
}

function assignListenersModal() {
    const btnClose = document.querySelector('#modal-tipo-imagem-container i');
    if (btnClose) btnClose.addEventListener('click', closeModalAnalysisType);
}