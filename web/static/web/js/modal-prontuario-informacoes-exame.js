import { closeCurrentModal } from "./script.js";

function initializeEventListeners() {
    const btnOpen = document.querySelector('#modal-info-btn-download');
    const btnClose = document.querySelector('#modal-prontuario-container-informacoes-exame i');

    const modalProntuarioInfoExam = document.querySelector('#modal-prontuario-container-informacoes-exame');
    const background = document.querySelector('#modal-backdrop');
    const modalInfoExam = document.querySelector('#modal-info-exam-container');

    const form = document.querySelector('#prontuario-modal-info-form');
    const fileName = document.querySelector('#valor-input-prontuario-info-exam');
    const input = document.querySelector('#input-prontuario-informacoes-exame');

    input.addEventListener('change', (e) => {
        updateFileName(e.target)
    })

    form.addEventListener('submit', function (e) {
        setUrlForm();
        console.log(e.target.getAttribute('hx-post'));
    })

    if (btnOpen) {
        btnOpen.removeEventListener('click', handleBtnOpenClick);
        btnOpen.addEventListener('click', function (e) {
            setUrlForm();
            handleBtnOpenClick(this, e);
        });
    }

    if (btnClose) {
        btnClose.removeEventListener('click', closeModalProntuarioInfoExam);
        btnClose.addEventListener('click', closeModalProntuarioInfoExam);
    }

    function handleBtnOpenClick(btn, e) {
        if (btn.getAttribute('data-action') === 'upload') {
            e.preventDefault();
            openModalProntuarioInfoExam();
        }
    }

    function openModalProntuarioInfoExam() {
        closeCurrentModal(modalInfoExam.id);
        modalProntuarioInfoExam.style.display = 'block';
    }

    function closeModalProntuarioInfoExam() {
        modalProntuarioInfoExam.style.display = 'none';
        background.classList.remove('show');
    }

    function setUrlForm() {
        const examId = sessionStorage.getItem('selectedExamId');
        if (!examId) return;
        form.setAttribute('hx-post', `/record_by_exam_id/${examId}`);
        console.log(form.getAttribute('hx-post'));
    }

    function updateFileName(input) {
        const value = input.value;
        fileName.innerText = value.split('\\').pop() || 'Nenhum arquivo selecionado';
    }
}
document.addEventListener('DOMContentLoaded', initializeEventListeners);
document.body.addEventListener('htmx:afterSwap', initializeEventListeners);