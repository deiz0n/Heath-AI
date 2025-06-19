import {closeCurrentModal} from "./script.js";

function initializeModalTypeView() {
   const btnOpenModalTypeView = document.querySelector('#modal-info-btn-show-images');
   const btnCloseModalTypeView = document.querySelector('#modal-tipo-visualizacao-container i');

   const modalTypeView = document.querySelector('#modal-tipo-visualizacao-container');
   const background = document.querySelector('#modal-backdrop');
   const modalInfoExam = document.querySelector('#modal-info-exam-container');

   if (btnOpenModalTypeView) {
       btnOpenModalTypeView.removeEventListener('click', openModalTypeView)
       btnOpenModalTypeView.addEventListener('click', openModalTypeView)
   }

   if (btnCloseModalTypeView) {
       btnCloseModalTypeView.removeEventListener('click', closeModalTypeView)
       btnCloseModalTypeView.addEventListener('click', closeModalTypeView)
   }

   function openModalTypeView() {
       closeCurrentModal(modalInfoExam.id);
       modalTypeView.style.display = 'block';
   }

   function closeModalTypeView() {
       modalTypeView.style.display = 'none';
       background.classList.remove('show');
   }
}

document.addEventListener('DOMContentLoaded', initializeModalTypeView);
document.body.addEventListener('htmx:afterSwap', initializeModalTypeView);