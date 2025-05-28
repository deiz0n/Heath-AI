function initializeEventListeners() {
    const patientDataContainer = document.querySelectorAll('.patient-data');
    const modalInfoExam = document.querySelector('#modal-info-exam-container');
    const btnClose = document.querySelector('#modal-info-exam-container i');
    const backgroundModal = document.querySelector('#modal-backdrop');

    if (patientDataContainer.length) {
        patientDataContainer.forEach(patientData => {
            patientData.removeEventListener('click', openModalInfoExam);
            patientData.addEventListener('click', function () {
                setDataModalInfoExam(this);
                openModalInfoExam();
            });
        });
    }

    if (btnClose) {
        btnClose.removeEventListener('click', closeModalInfoExam);
        btnClose.addEventListener('click', closeModalInfoExam);
    }

    function openModalInfoExam() {
        modalInfoExam.style.display = 'block';
        backgroundModal.classList.add('show');
    }

    function closeModalInfoExam() {
        modalInfoExam.style.display = 'none';
        backgroundModal.classList.remove('show');
    }

    function setDataModalInfoExam(patientData) {
        const datasets = {
            patientName: patientData.dataset.patientName,
            patientCpf: patientData.dataset.patientCpf,
            patientAge: patientData.dataset.patientAge,
            patientAddress: patientData.dataset.patientAddress,
            clinicianName: patientData.dataset.clinicianName,
            clinicianCrm: patientData.dataset.clinicianCrm,
            examType: patientData.dataset.examType,
            examData: patientData.dataset.exam
        };

        document.querySelector(('#patient-name')).textContent = datasets.patientName;
        document.querySelector(('#patient-cpf')).textContent = datasets.patientCpf;
        document.querySelector(('#patient-age')).textContent = datasets.patientAge;
        document.querySelector(('#patient-address')).textContent = datasets.patientAddress;
        document.querySelector(('#clinician-name')).textContent = datasets.clinicianName;
        document.querySelector(('#clinician-crm')).textContent = datasets.clinicianCrm;
        document.querySelector(('#exam-type')).textContent = datasets.examType;
        document.querySelector(('#exam-data')).textContent = datasets.examData;
    }

}

document.addEventListener('DOMContentLoaded', initializeEventListeners);
document.body.addEventListener('htmx:afterSwap', initializeEventListeners);