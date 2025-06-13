import { closeCurrentModal } from "./script.js";

function initializeEventListeners() {
    const btnOpenModalViewImages = document.querySelector('#btn-x-ray');
    const btnCloseModalViewImages = document.querySelector('#modal-visualizacao-imagens-container i');
    const btnCloseModalViewImagesBottom = document.querySelector('#btn-close-view-images');

    const modalViewImages = document.querySelector('#modal-visualizacao-imagens-container');
    const backGround = document.querySelector('#modal-backdrop');
    const modalTypeImageView = document.querySelector('#modal-tipo-visualizacao-imagens');

    if (btnOpenModalViewImages) {
        btnOpenModalViewImages.removeEventListener('click', openModalViewImages);
        btnOpenModalViewImages.addEventListener('click',  openModalViewImages);
    }

    if (btnCloseModalViewImages) {
        btnCloseModalViewImages.removeEventListener('click', closeModalViewImages);
        btnCloseModalViewImages.addEventListener('click', closeModalViewImages);
    }

    if (btnCloseModalViewImagesBottom) {
        btnCloseModalViewImagesBottom.removeEventListener('click', closeModalViewImages);
        btnCloseModalViewImagesBottom.addEventListener('click', closeModalViewImages);
    }

    function openModalViewImages() {
        closeCurrentModal(modalTypeImageView.id);
        modalViewImages.style.display = 'block';
    }

    function closeModalViewImages() {
        modalViewImages.style.display = 'none';
        backGround.classList.remove('show');
    }
}

document.addEventListener('DOMContentLoaded', initializeEventListeners);
document.body.addEventListener('htmx:afterSwap', initializeEventListeners);