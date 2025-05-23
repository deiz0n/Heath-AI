import { closeCurrentModal } from "./script.js";
import { modalOptions2D } from "./modal-opcoes-2d.js";
import { modalOptions3D } from "./modal-opcoes-3d.js";
import { backgroundModal } from "./modal-tipo-analise.js";

const btnNextStep = document.querySelector('#btn-next-step-ressonancia');
const btnOpenModalResonance = document.querySelectorAll('.btn-modal-ressonancia');
const btnCloseModalResonance = document.querySelector('#modal-ressonancia-container i');

const modalResonance = document.querySelector('#modal-ressonancia-container');
const initModalProntuarioRessonancia = document.querySelector('#modal-prontuario-container-ressonancia');
const input = document.querySelector('#input-ressonancia');


if (input)
    input.addEventListener('change', (e) => {
        updateQuantityFiles(e.target.files.length);
    });

if (btnOpenModalResonance)
    btnOpenModalResonance
        .forEach(btn => btn.addEventListener('click', openModalResonance))

if (btnCloseModalResonance) btnCloseModalResonance.addEventListener('click', closeModalResonance);


if (btnNextStep) btnNextStep.addEventListener('click', initModalProntuario);

function openModalResonance() {
    if (modalOptions2D.style.display === 'block') closeCurrentModal(modalOptions2D.id);
    if (modalOptions3D.style.display === 'block') closeCurrentModal(modalOptions3D.id);

    modalResonance.style.display = 'block';
}

function closeModalResonance() {
    modalResonance.style.display = 'none';
    backgroundModal.classList.remove('show');
}

function updateQuantityFiles(quantity) {
    const quantityFiles = document.querySelector('#valor-input-ressonancia span');
    quantityFiles.innerText = `${quantity}`;
}

function initModalProntuario() {
    initModalProntuarioRessonancia.style.display = 'block';
    modalResonance.style.display = 'none';
}
