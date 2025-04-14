import { startModalRaioX } from "./modal-raiox.js";
import { startModalRessonancia } from "./modal-ressonancia.js";
import { startModalAmbos } from "./modal-ambos.js";

const btnIniciar = document.querySelector('#main-btn');
const btn2D = document.querySelector('#btn-2d');
const btn3D = document.querySelector('#btn-3d');
const btnStartRaioX = document.querySelectorAll('.btn-modal-raiox');
const btnStartRessonancia = document.querySelectorAll('.btn-modal-ressonancia');
const btnStartAmbos = document.querySelector('#btn-modal-ambos');
// const btnStartProntuario = document.querySelector('#next-step');
// const formComponent = document.querySelector('.form');

// const modalRaioX = document.querySelector('#modal-raiox-container');

const initModalTipoVisualizacao = () => {
    const modal = document.querySelector('#modal-tipo-imagem-container');
    modal.style.display = 'block';
}

const initModalOpcoes3D = (typeModal) => {
    const modal = document.querySelector('#modal-opcoes-container');
    modal.style.display = 'block';
    closeCurrentModal(typeModal);
}

const initModalOpcoes2D = (typeModal) => {
    const modal = document.querySelector('#modal-opcoes-2d-container');
    modal.style.display = 'block';
    closeCurrentModal(typeModal);
}

const initModalRessonancia = (typeModal) => {
    const modal = document.querySelector('#modal-ressonancia-container');
    modal.style.display = 'block';
    closeCurrentModal(typeModal);
}

// const initModalAmbos = () => {
//     const typeModal = 'ambos'
//     startModal(typeModal);
// }

export const initModalProntuario = (typeModal) => {
    const modalProntuario = document.querySelector('#modal-prontuario-container');
    modalProntuario.style.display = 'block';
    closeCurrentModal(typeModal)
}

btnIniciar.addEventListener('click', initModalTipoVisualizacao);

btn3D.addEventListener('click', () => initModalOpcoes3D('tipo-imagem'));

btn2D.addEventListener('click', () => initModalOpcoes2D('tipo-imagem'));

btnStartRaioX.forEach(btn => btn.addEventListener('click', startModalRaioX));

btnStartRessonancia.forEach(btn => btn.addEventListener('click', startModalRessonancia));

btnStartAmbos.addEventListener('click', startModalAmbos);

function closeCurrentModal(typeModal) {
    const modal = document.querySelector(`#modal-${typeModal}-container`);
    modal.style.display = 'none';
}
