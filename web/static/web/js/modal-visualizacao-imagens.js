import {closeCurrentModal} from "./script.js";

function initializeModalViewImages() {
    const btnOpenModalViewImages3D = document.querySelector('#btn-3d-view');
    const btnOpenModalViewImages2D = document.querySelector('#btn-2d-view');
    const btnCloseModalViewImages = document.querySelector('#modal-visualizacao-imagens-container i');
    const btnCloseModalViewImagesBottom = document.querySelector('#btn-close-botton-modal-view-image');

    const modalViewImagesOptions = document.querySelector('#modal-tipo-visualizacao-container');
    const modalViewImages = document.querySelector('#modal-visualizacao-imagens-container');
    const backgroundModal = document.querySelector('#modal-backdrop');
    const containerImg = document.querySelector('.container-img');

    if (btnOpenModalViewImages2D) {
        btnOpenModalViewImages2D.removeEventListener('click', openModalViewImages);
        btnOpenModalViewImages2D.addEventListener('click', openModalViewImages);
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
        closeCurrentModal(modalViewImagesOptions.id);
        modalViewImages.style.display = 'block';
    }

    function closeModalViewImages() {
        modalViewImages.style.display = 'none';
        backgroundModal.classList.remove('show');

        if (containerImg) containerImg.innerHTML = '<p>Nenhum tipo de imagem foi selecionado</p>';
    }
}

document.addEventListener('DOMContentLoaded', initializeModalViewImages);
document.body.addEventListener('htmx:afterSwap', initializeModalViewImages);