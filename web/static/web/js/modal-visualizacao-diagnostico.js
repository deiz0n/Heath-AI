import { closeCurrentModal } from "./script.js";

function initializeModalViewDiagnostics() {
    const btnOpenModalViewDiagnostics = document.querySelector('#modal-info-btn-diagnostic');
    const btnsCloseModalViewImages = document.querySelectorAll(
        '#modal-visualizacao-diagnostic-container i, #btn-close-botton-modal-view-diagnostic'
    );

    const modalViewDiagnostics = document.querySelector(
        '#modal-visualizacao-diagnostic-container'
    );
    const modalInfoExam = document.querySelector('#modal-info-exam-container');
    const backgroundModal = document.querySelector('#modal-backdrop');

    if (btnOpenModalViewDiagnostics) {
        btnOpenModalViewDiagnostics.removeEventListener('click', openModalViewDiagnostics);
        btnOpenModalViewDiagnostics.addEventListener('click', openModalViewDiagnostics);
    }

    if (btnsCloseModalViewImages?.length) {
        btnsCloseModalViewImages.forEach(
            btn => btn.removeEventListener('click', closeModalViewDiagnostics)
        );
        btnsCloseModalViewImages.forEach(
            btn => btn.addEventListener('click', closeModalViewDiagnostics)
        );
    }

    function openModalViewDiagnostics() {
        setDataPatient();
        modalViewDiagnostics.style.display = 'block';
        closeCurrentModal(modalInfoExam.id);
    }

    function closeModalViewDiagnostics() {
        modalViewDiagnostics.style.display = 'none';
        backgroundModal.classList.remove('show');
    }

    function setDataPatient() {
        const resultExamData = document.querySelector('.patient-data');

        const patientName = modalInfoExam.querySelector('#patient-name');
        const examType = modalInfoExam.querySelector('#exam-type');

        const diagnosticContainerText = document.querySelector('#diagnostic-container-text');
        diagnosticContainerText.querySelector('#exam-type-diagnostic').textContent = examType.textContent;
        diagnosticContainerText.querySelector('#patient-name-diagnostic').textContent = patientName.textContent;
        diagnosticContainerText.querySelector('#result-diagnostic').textContent = resultExamData.getAttribute('data-exam-diagnostic');
    }

}

document.addEventListener('DOMContentLoaded', initializeModalViewDiagnostics);
document.body.addEventListener('htmx:afterSwap', initializeModalViewDiagnostics);