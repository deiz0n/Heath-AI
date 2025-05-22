const patientDataContainer = document.querySelectorAll('.patient-data');
const modalInfoExam = document.querySelector('#modal-info-exam-container');
const btnClose = document.querySelector('#modal-info-exam-container i');

if (patientDataContainer)
    patientDataContainer.forEach(patientData => {
        patientData.addEventListener('click', openModalInfoExam);
    })

if (btnClose) btnClose.addEventListener('click', closeModalInfoExam);

function openModalInfoExam() {
    modalInfoExam.style.display = 'block'
}

function closeModalInfoExam() {
    modalInfoExam.style.display = 'none'
}
