import { modalOptions2D } from "./modal-opcoes-2d.js";
import { modalOptions3D } from "./modal-opcoes-3d.js";

import {
    colorBlack,
    colorBlue,
    colorGreen,
    iconPending,
    iconCheck
} from "./styles.js";

export function startModalRaioX() {
    const backgroundModal = document.querySelector('#modal-backdrop');

    const modalRaioX = document.querySelector('#modal-raiox-container');
    const modalProntuarioRaioX = document.querySelector('#modal-prontuario-container-raiox');

    const labels = document.querySelectorAll('#modal-raiox-container [id^="label"]');
    const inputs = document.querySelectorAll('#modal-raiox-container input[type=file]');
    const fileNames = document.querySelectorAll('.input-value-raiox');

    const btnOpenModalXRay = document.querySelectorAll('.btn-modal-raiox');
    const btnCloseModalXRay = document.querySelector('#btn-close-raiox');
    const btnNextStep = document.querySelector('#btn-next-step-raiox');
    const btnPrevStep = document.querySelector('#btn-prev-step-raiox');
    const btnSubmit = document.querySelector('#btn-submit-raiox');

    const progressBar = document.querySelector('#progress-bar');
    const valueProgress = document.querySelector('#progress-title span');
    let stepProgressValue = parseInt(valueProgress.innerHTML);

    const steps = document.querySelectorAll('#modal-raiox-container .form-step');
    const totalSteps = steps.length;
    let currentStep = 0;

    btnOpenModalXRay.forEach(btn => btn.addEventListener('click', openModalXRay));
    btnCloseModalXRay.addEventListener('click', closeModaXRay);
    btnNextStep.addEventListener('click', nextElement);

    inputs.forEach(input => {
        input.addEventListener('change', () => {
            updateFileName(currentStep);
        });
    });

    function openModalXRay() {
        resetComponents();

        if (modalOptions2D.style.display === 'block') modalOptions2D.style.display = 'none';
        if (modalOptions3D.style.display === 'block') modalOptions3D.style.display = 'none';

        updateEventBtnPrev();

        modalRaioX.style.display = 'block';
        inputs[0].style.visibility = 'visible';
    }

    function closeModaXRay() {
        modalRaioX.style.display = 'none';
        backgroundModal.classList.remove('show');
        resetComponents();
    }

    const resetComponents = () => {
        labels.forEach(label => {
            const icon = label.children[0];
            icon.innerText = iconPending;
            label.style.color = colorBlack;
        });
    };

    const updateProgress = () => {
        const percent = (currentStep / totalSteps) * 100;
        progressBar.style.width = `${percent}%`;

        if (currentStep === totalSteps) {
            updateVisibilityButtons(currentStep);

            btnNextStep.removeEventListener('click', nextElement);
            btnNextStep.addEventListener('click', initModalProntuario)

            fileNames[fileNames.length - 1].innerText = 'Todos os arquivos foram selecionados';
        } else {
            updateTextButtons();
            updateVisibilityButtons(currentStep);
        }
    };

    const updateVisibilityButtons = () => {
        if (currentStep > 5) {
            btnNextStep.style.display = 'none';
            btnPrevStep.style.display = 'none';
            btnSubmit.style.display = 'block';
        }
    };

    const updateTextButtons = () => {
        if (currentStep < totalSteps) btnNextStep.innerText = 'Avançar';

        if (currentStep > 0) btnPrevStep.innerText = 'Voltar';
        else btnPrevStep.innerText = 'Fechar';
    };

    const updateEventBtnPrev = () => {
        if (currentStep === 0) {
            btnPrevStep.removeEventListener('click', prevElement);
            btnPrevStep.addEventListener('click', closeModaXRay);
        }
        else {
            btnPrevStep.removeEventListener('click', closeModaXRay);
            btnPrevStep.addEventListener('click', prevElement);
        }
    }

    const showCurrentInput = (index) => {
        if (index < inputs.length - 1) {
            const input = inputs[index];
            input.style.visibility = 'visible';
        }
    };

    const updateFileName = (index) => {
        if (index < steps.length) {
            const fileName = inputs[index].value;
            fileNames[index].innerText = fileName.split('\\').pop() || 'Nenhum arquivo selecionado';
        }
    };

    const showCurrentStep = (step) => {
        steps.forEach(s => s.classList.remove('active'));

        const activeStep = document.querySelector(`.form-step[data-step="${step}"]`);

        if (activeStep) activeStep.classList.add('active');

        console.log(step)

        if (step >= steps.length) {
            const lastStep = steps[steps.length - 1];
            lastStep.classList.add('active');
        }
    };

    const showCurrentLabel = (index) => {
        if (index === 0) {
            const label = labels[index];
            label.style.color = colorBlue;
        }

        if (index > 0) {
            const prevLabel = labels[index - 1];
            prevLabel.style.color = colorBlack;
        }

        if (index < labels.length && index !== 5) {
            const currentLabel = labels[index];
            currentLabel.style.color = colorBlue;
        }

        if (index < labels.length - 1) {
            const nextLabel = labels[index + 1];
            nextLabel.style.color = colorBlack;
        }
    };

    const updateCurrentLabelIcon = (currentIndex) => {
        labels.forEach((label, index) => {
            const icon = label.children[0];
            if (index < currentIndex) {
                icon.innerText = iconCheck;
                icon.style.color = colorGreen;
            } else if (index === currentIndex) {
                icon.innerText = iconPending;
                icon.style.color = colorBlack;
            } else {
                icon.innerText = iconPending;
                icon.style.color = colorBlack;
            }
        });
    }

    function nextElement() {
        if (!inputs[currentStep].value) {
            fileNames[currentStep].innerText = 'Selecione um arquivo antes de avançar';

            setTimeout(() => {
                fileNames[currentStep].innerText = 'Nenhum arquivo selecionado';
            }, 1000);

            return
        }

        if (currentStep < totalSteps) {
            currentStep++;

            updateEventBtnPrev();
            showCurrentLabel(currentStep);
            showCurrentStep(currentStep);
            showCurrentInput(currentStep);
            updateCurrentLabelIcon(currentStep);

            if (stepProgressValue < inputs.length - 1) {
                stepProgressValue++;
                valueProgress.innerHTML = `${stepProgressValue}`;
            }

            updateProgress();
        }
    }

    function prevElement() {
        if (currentStep > 0) {
            currentStep--;

            updateEventBtnPrev();
            showCurrentLabel(currentStep);
            showCurrentStep(currentStep);
            showCurrentInput(currentStep);

            if (stepProgressValue >= 1) {
                stepProgressValue--;
                valueProgress.innerHTML = `${stepProgressValue}`;
            }

            updateProgress();
        }
    }

    function initModalProntuario() {
        modalProntuarioRaioX.style.display = 'block';
        modalRaioX.style.display = 'none';
    }
}