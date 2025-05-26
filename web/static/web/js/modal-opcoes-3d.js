import { closeCurrentModal } from "./script.js";

const backgroundModal = document.querySelector('#modal-backdrop');
const modalAnalysisType = document.querySelector('#modal-tipo-imagem-container');

const btn3d = document.querySelector('#btn-3d');
const btnClose = document.querySelector('#modal-opcoes-3d-container i');
export const modalOptions3D = document.querySelector('#modal-opcoes-3d-container');

if (btn3d) btn3d.addEventListener('click', openModalOptions3D);
if (btnClose) btnClose.addEventListener('click', closeModalOptions3D);

function openModalOptions3D() {
    closeCurrentModal(modalAnalysisType.id)
    modalOptions3D.style.display = 'block';
}

function closeModalOptions3D() {
    modalOptions3D.style.display = 'none';
    backgroundModal.classList.remove('show');
}