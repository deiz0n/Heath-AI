import { startModalRaioX } from "./modal-raiox.js";

import { startModalAmbos } from "./modal-ambos.js";

const btnStartRaioX = document.querySelectorAll('.btn-modal-raiox');
const btnStartAmbos = document.querySelector('#btn-modal-ambos');

if (btnStartRaioX) btnStartRaioX.forEach(btn => btn.addEventListener('click', startModalRaioX));
if (btnStartAmbos) btnStartAmbos.addEventListener('click', startModalAmbos);

export function closeCurrentModal(modalId) {
    const modal = document.querySelector(`#${modalId}`);
    modal.style.display = 'none';
}
