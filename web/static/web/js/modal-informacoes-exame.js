function initializeEventListeners() {
    const patientDataContainer = document.querySelectorAll('.patient-data');
    const modalInfoExam = document.querySelector('#modal-info-exam-container');
    const btnClose = document.querySelector('#modal-info-exam-container i');
    const backgroundModal = document.querySelector('#modal-backdrop');

    if (patientDataContainer.length) {
        patientDataContainer.forEach(patientData => {
            patientData.removeEventListener('click', function () {
                setUrlButtons(this);
                setDataModalInfoExam(this);
                openModalInfoExam();
            });
            patientData.addEventListener('click', function () {
                setUrlButtons(this);
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
        document.querySelector(('#patient-age')).textContent = `${datasets.patientAge} anos`;
        document.querySelector(('#patient-address')).textContent = datasets.patientAddress;
        document.querySelector(('#clinician-name')).textContent = datasets.clinicianName;
        document.querySelector(('#clinician-crm')).textContent = datasets.clinicianCrm;
        document.querySelector(('#exam-type')).textContent = datasets.examType;
        document.querySelector(('#exam-data')).textContent = datasets.examData;
    }

    function setUrlButtons(patientData) {
        const examId = patientData.dataset.examId
        const btnDownload = document.querySelector('#modal-info-btn-download');

        if (btnDownload && examId && existsExamRecord(patientData))
            btnDownload.href = '/record_by_exam_id/' + examId;
    }

    function existsExamRecord(patientData) {
        const examRecord = patientData.dataset.examRecord;
        const btnDownload = document.querySelector('#modal-info-btn-download');

        if (examRecord !== 'None') {
            btnDownload.textContent = 'Baixar prontuário';
            return true;
        }
        else {
            btnDownload.textContent = "Enviar prontuário";
            btnDownload.setAttribute('data-action', 'upload');
            return false;
        }
    }
}

document.addEventListener('DOMContentLoaded', initializeEventListeners);
document.body.addEventListener('htmx:afterSwap', initializeEventListeners);