import { startModalRaioX } from "./modal-raiox.js";
import { startModalRessonancia } from "./modal-ressonancia.js";
import { startModalAmbos } from "./modal-ambos.js";

const btn2D = document.querySelector('#btn-2d');
const btnStartRaioX = document.querySelectorAll('.btn-modal-raiox');
const btnStartRessonancia = document.querySelectorAll('.btn-modal-ressonancia');
const btnStartAmbos = document.querySelector('#btn-modal-ambos');

if (btnStartRaioX) btnStartRaioX.forEach(btn => btn.addEventListener('click', startModalRaioX));
if (btnStartRessonancia) btnStartRessonancia.forEach(btn => btn.addEventListener('click', startModalRessonancia));
if (btnStartAmbos) btnStartAmbos.addEventListener('click', startModalAmbos);

const initModalOpcoes2D = (typeModal) => {
    const modal = document.querySelector('#modal-opcoes-2d-container');
    modal.style.display = 'block';
    closeCurrentModal(typeModal);
}

btn2D.addEventListener('click', () => initModalOpcoes2D('tipo-imagem'));

export const initModalProntuario = (typeModal) => {
    const modalProntuario = document.querySelector('#modal-prontuario-container');

    modalProntuario.style.display = 'block';
    closeCurrentModal(typeModal)
}

export function closeCurrentModal(modalId) {
    const modal = document.querySelector(`#${modalId}`);
    modal.style.display = 'none';
}
