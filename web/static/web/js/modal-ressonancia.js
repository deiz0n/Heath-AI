import { closeCurrentModal } from "./script.js";

const backgroundModal = document.querySelector('#modal-backdrop');

const btnNextStep = document.querySelector('#btn-next-step-ressonancia');
const btnOpenModalResonance = document.querySelector('#btn-submit-modal-register-patient');
const btnCloseModalResonance = document.querySelector('#modal-ressonancia-container i');

const modalResonance = document.querySelector('#modal-ressonancia-container');
const modalRegisterPatient = document.querySelector('#modal-register-patient-container');

const initModalProntuarioRessonancia = document.querySelector('#modal-prontuario-container-ressonancia');
const input = document.querySelector('#input-ressonancia');


input?.addEventListener('change', (e) => {
    updateQuantityFiles(e.target.files.length);
});
btnOpenModalResonance?.addEventListener('click', () => {
    const targetModal = btnOpenModalResonance.getAttribute('data-target-modal');
    if (targetModal === 'modal-resonance-2d' || targetModal === 'modal-resonance-3d')
        openModalResonance();
})
btnCloseModalResonance?.addEventListener('click', closeModalResonance);
btnNextStep?.addEventListener('click', initModalProntuario);


function openModalResonance() {
    closeCurrentModal(modalRegisterPatient.id);
    setInputPatientModalResonance();
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

function setInputPatientModalResonance() {
    const formRegisterPatient = document.querySelector('#form-register-patient');
    document.querySelector('#input-patient-modal-resonance').value = formRegisterPatient.getAttribute('data-patient')
}

function initModalProntuario() {
    initModalProntuarioRessonancia.style.display = 'block';
    modalResonance.style.display = 'none';
}
