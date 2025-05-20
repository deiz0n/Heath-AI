const btnStart = document.querySelector('#main-btn');
const backgroundModal = document.querySelector('#modal-backdrop-tipo-analise');
const modalAnalysisType = document.querySelector('#modal-tipo-imagem-container');

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