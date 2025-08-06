import { closeCurrentModal } from "../../web/js/script.js";

function openModalResonance(e) {
    const modalResonance = document.querySelector('.modal-send-images');
    const modalRegisterPatient = document.querySelector('#modal-register-patient-container');
    const backgroundModal = document.querySelector('#modal-backdrop');

    if (!e || !e.target) return;

    const target = e.target;

    if (target.id.includes('3d')) {
        closeCurrentModal('modal-opcoes-3d-container');
    } else if (target.id.includes('2d')) {
        closeCurrentModal('modal-opcoes-2d-container');
    }

    closeCurrentModal(modalRegisterPatient?.id);
    setInputPatientModalResonance();
    updateTitleModal(target);
    setValueInputHidden(target);
    setNameInputImages(target);

    if (modalResonance && backgroundModal) {
        modalResonance.style.display = 'block';
        backgroundModal.classList.add('show');
    }
}

function closeModalResonance() {
    const modalResonance = document.querySelector('.modal-send-images');
    const backgroundModal = document.querySelector('#modal-backdrop');

    if (modalResonance && backgroundModal) {
        modalResonance.style.display = 'none';
        backgroundModal.classList.remove('show');
    }
}

function initModalProntuario() {
    const modalResonance = document.querySelector('.modal-send-images');
    const initModalProntuarioRessonancia = document.querySelector('#modal-prontuario-container-ressonancia');

    if (initModalProntuarioRessonancia && modalResonance) {
        initModalProntuarioRessonancia.style.display = 'block';
        modalResonance.style.display = 'none';
    }
}

function updateQuantityFiles(quantity) {
    const quantityFiles = document.querySelector('#valor-input-ressonancia span');
    if (quantityFiles) {
        quantityFiles.innerText = `${quantity}`;
    }
}

function setInputPatientModalResonance() {
    const formRegisterPatient = document.querySelector('#form-register-patient');
    const inputPatient = document.querySelector('#input-patient-modal-resonance');

    if (formRegisterPatient && inputPatient) {
        inputPatient.value = formRegisterPatient.getAttribute('data-patient') || '';
    }
}

function updateTitleModal(target) {
    const titleModal = document.querySelector('.modal-send-images .modal-titulo span');

    if (titleModal) {
        if (target.id.includes('x-ray')) titleModal.innerText = 'Raio X';
        else if (target.id.includes('resonance')) titleModal.innerText = 'Ressonância';
    }
}

function assignListenersModalResonance() {
    const btnSubmitImages = document.querySelector('#btn-submit-images');
    const btnOpenModalResonance = document.querySelectorAll('#btn-modal-resonance-2d, #btn-modal-resonance-3d, #btn-modal-x-ray-2d, #btn-modal-x-ray-3d');
    const btnCloseModalResonance = document.querySelector('.modal-send-images i');
    const input = document.querySelector('.input-images');

    btnOpenModalResonance?.forEach(btn => {
        btn.removeEventListener('click', openModalResonance);
        btn.addEventListener('click', openModalResonance);
    });

    if (btnCloseModalResonance) {
        btnCloseModalResonance.removeEventListener('click', () => {
            closeModalResonance();
        });
        btnCloseModalResonance.addEventListener('click', closeModalResonance);
    }

    if (btnSubmitImages) {
        btnSubmitImages.removeEventListener('click', initModalProntuario);
        btnSubmitImages.addEventListener('click', initModalProntuario);
    }

    if (input) {
        input.removeEventListener('change', handleInputSubmitImages);
        input.addEventListener('change', handleInputSubmitImages);

        input.removeEventListener('change', handleInputChange);
        input.addEventListener('change', handleInputChange);
    }
}

function handleInputChange(e) {
    updateQuantityFiles(e.target.files.length);
}

function handleInputSubmitImages(e) {
    const btnSubmitImages = document.querySelector('#btn-submit-images');
    
    if (!btnSubmitImages) return;

    let quantityFiles = e.target.files.length;
    if (btnSubmitImages.offsetParent !== null) {
        btnSubmitImages.disabled = quantityFiles === 0;
    }
}

function setValueInputHidden(target) {
    const inputHidden = document.querySelector('#input-type-exam');

    if (target.id.includes('x-ray'))
        inputHidden.value = 'x-ray';
    else
        inputHidden.value = 'resonance'
}

function setNameInputImages(target) {
    const inputImages = document.querySelector('.input-images');

    if (target.id.includes('x-ray'))
        inputImages.name = 'images_xray'
    else 
        inputImages.name = 'images_resonance'
}

document.addEventListener('DOMContentLoaded', assignListenersModalResonance);
document.body.addEventListener('htmx:afterSwap', assignListenersModalResonance);