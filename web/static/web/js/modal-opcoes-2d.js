import { backgroundModal, modalAnalysisType } from "./modal-tipo-analise.js";
import { closeCurrentModal } from "./script.js";

const btn2D = document.querySelector('#btn-2d');
const btnClose = document.querySelector('#modal-opcoes-2d-container i');
export const modalOptions2D = document.querySelector('#modal-opcoes-2d-container');

if (btn2D) btn2D.addEventListener('click', openModalOptions2D);
if (btnClose) btnClose.addEventListener('click', closeModalOptions2D);

function openModalOptions2D() {
    closeCurrentModal(modalAnalysisType.id);
    modalOptions2D.style.display = 'block';
}

function closeModalOptions2D() {
    modalOptions2D.style.display = 'none';
    backgroundModal.classList.remove('show');
}

