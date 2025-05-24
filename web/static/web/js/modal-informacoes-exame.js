function initializeEventListeners() {
    const patientDataContainer = document.querySelectorAll('.patient-data');
    const modalInfoExam = document.querySelector('#modal-info-exam-container');
    const btnClose = document.querySelector('#modal-info-exam-container i');
    const backgroundModal = document.querySelector('#modal-backdrop');

    function openModalInfoExam() {
        modalInfoExam.style.display = 'block';
        backgroundModal.classList.add('show');
    }

    function closeModalInfoExam() {
        modalInfoExam.style.display = 'none';
        backgroundModal.classList.remove('show');
    }

    if (patientDataContainer) {
        patientDataContainer.forEach(patientData => {
            patientData.removeEventListener('click', openModalInfoExam);
            patientData.addEventListener('click', openModalInfoExam);
        });
    }

    if (btnClose) {
        btnClose.removeEventListener('click', closeModalInfoExam);
        btnClose.addEventListener('click', closeModalInfoExam);
    }
}

document.addEventListener('DOMContentLoaded', initializeEventListeners);
document.body.addEventListener('htmx:afterSwap', initializeEventListeners);