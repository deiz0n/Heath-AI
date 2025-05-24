function initializeEventListeners() {
    const patientDataContainer = document.querySelectorAll('.patient-data');
    const modalInfoExam = document.querySelector('#modal-info-exam-container');
    const btnClose = document.querySelector('#modal-info-exam-container i');

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

    function openModalInfoExam() {
        modalInfoExam.style.display = 'block';
    }

    function closeModalInfoExam() {
        modalInfoExam.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', initializeEventListeners);
document.body.addEventListener('htmx:afterSwap', initializeEventListeners);