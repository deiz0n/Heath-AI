import { closeCurrentModal } from "./script.js";

function initializeEventListeners() {
    const btnOpenModalViewImages = document.querySelector('#modal-info-btn-show-images');
    const btnCloseModalViewImages = document.querySelector('#modal-tipo-visualizacao-imagens i');
    const btnGetImagesXRay = document.querySelector('#btn-x-ray');

    const modalTypeViewImages = document.querySelector('#modal-tipo-visualizacao-imagens');
    const backGround = document.querySelector('#modal-backdrop');
    const modalInfoExam = document.querySelector('#modal-info-exam-container');

    if (btnOpenModalViewImages) {
        btnOpenModalViewImages.removeEventListener('click', openModalViewImages);
        btnOpenModalViewImages.addEventListener('click', openModalViewImages)
    }

    if (btnCloseModalViewImages) {
        btnCloseModalViewImages.removeEventListener('click', closeModalViewImages);
        btnCloseModalViewImages.addEventListener('click', closeModalViewImages);
    }

    function openModalViewImages() {
        closeCurrentModal(modalInfoExam.id);
        console.log(btnGetImagesXRay.getAttribute('hx-get'));
        modalTypeViewImages.style.display = 'block';
    }

    function closeModalViewImages() {
        modalTypeViewImages.style.display = 'none';
        backGround.classList.remove('show');
    }
}

document.addEventListener('DOMContentLoaded', initializeEventListeners);
document.body.addEventListener('htmx:afterSwap', initializeEventListeners);