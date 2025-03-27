import { startModal } from "./modal-utils.js";

const btnStartRaioX = document.querySelector('#btn-modal-raiox');
const btnStartRessonancia = document.querySelector('#open-modal-ressonancia');
const btnStartAmbos = document.querySelector('#open-modal-ambos');
const btnStartProntuario = document.querySelector('#next-step');
const formComponent = document.querySelector('.form');

const modalRaioX = document.querySelector('#modal-raiox-container');

const initModalRaioX = () => {
    const tipoModal = 'raiox'
    startModal(tipoModal);
}

const initModalRessonancia = () => {
    const typeContent = 'content-ressonancia';
    const typeModal = 'ressonancia'

    renderTemplate(startModalRessonancia(), typeContent);
    startModal(typeModal);
}

const initModalAmbos = () => {
    const typeContent = 'content-ambos';
    const typeModal = 'ambos'

    renderTemplate(startModalAmbos(), typeContent);
    startModal(typeModal);
}

export const initModalProntuario = (typeModal) => {
    const modalProntuario = document.querySelector('#modal-prontuario-container');
    modalProntuario.style.display = 'block';
    closeCurrentModal(typeModal)
}

btnStartRaioX.addEventListener('click', () => {
    console.log('alo')
    initModalRaioX();
});

function closeCurrentModal(typeModal) {
    const modal = document.querySelector(`#modal-${typeModal}-container`);
    modal.style.display = 'none';
}

// btnStartRessonancia.addEventListener('click', initModalRessonancia);

// btnStartAmbos.addEventListener('click', initModalAmbos);

