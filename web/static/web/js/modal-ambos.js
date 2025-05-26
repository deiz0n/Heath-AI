import { modalOptions2D } from "./modal-opcoes-2d.js";
import { modalOptions3D } from "./modal-opcoes-3d.js";
import { closeCurrentModal } from "./script.js";
import {
    colorBlack,
    colorBlue,
    colorGreen,
    iconPending,
    iconCheck
} from "./styles.js";

export function startModalAmbos() {
    const backgroundModal = document.querySelector('#modal-backdrop');

    const modalAmbos = document.querySelector('#modal-ambos-container');
    const modalProntuarioAmbos = document.querySelector('#modal-prontuario-container-ambos');

    const labels = document.querySelectorAll('#modal-ambos-container [id^="label"]');
    const inputs = document.querySelectorAll('#modal-ambos-container input[type=file]');
    const fileNames = document.querySelectorAll('.input-value-ambos');

    const btnOpenModalBoth = document.querySelector('#btn-modal-ambos');
    const btnCloseModalBoth = document.querySelector('#btn-close-ambos');
    const btnNextStep = document.querySelector('#btn-next-step-ambos');
    const btnPrevStep = document.querySelector('#btn-prev-step-ambos');
    const btnSubmit = document.querySelector('#btn-submit-ambos');

    const progressBar = document.querySelector('#modal-ambos-container #progress-bar');
    const valueProgress = document.querySelector('#modal-ambos-container #progress-title span');
    let stepProgressValue = parseInt(valueProgress.innerHTML) || 0;

    const steps = document.querySelectorAll('#modal-ambos-container .form-step');
    const totalSteps = steps.length - 1;
    let currentStep = 0;

    btnOpenModalBoth.addEventListener('click', openModalBoth);
    btnCloseModalBoth.addEventListener('click', closeModaBoth);
    btnNextStep.addEventListener('click', nextElement);
    btnPrevStep.addEventListener('click', prevElement);

    inputs.forEach(input => {
        input.addEventListener('change', () => {
            updateFileName(currentStep);
            console.log(input.id);
        });
    });

    function openModalBoth() {
        resetComponents();

        if (modalOptions2D.style.display === 'block') closeCurrentModal(modalOptions2D.id)
        if (modalOptions3D.style.display === 'block') closeCurrentModal(modalOptions3D.id)

        modalAmbos.style.display = 'block';

        updateEventBtnPrev();

        inputs[0].style.visibility = 'visible';
    }

    function closeModaBoth() {
        modalAmbos.style.display = 'none';
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

    const updateTitleModal = (index) => {
        const titleModal = document.querySelector('#modal-ambos-container .modal-titulo span');

        if (index > 4) titleModal.innerText = 'Ressonância';
        if (index <= 4 && titleModal.innerText !== 'Raio X') titleModal.innerText = 'Raio X';
    };

    const updateVisibilityLabels = (index) => {
        const labelsContainer = document.querySelector('#modal-ambos-container .labels')

        if (index > 4) labelsContainer.style.display = 'none';
        if (index <= 4 && labelsContainer.style.display === 'none') labelsContainer.style.display = 'block';
    };

    const updateVisibilityProgressBar = (index) => {
        const progressTitle = document.querySelector('#modal-ambos-container #progress-title');
        const progressBarContainer = document.querySelector('#modal-ambos-container .progress-bar')

        if (index > 4) {
            progressTitle.style.display = 'none';
            progressBarContainer.style.display = 'none';
        }

        if (index <= 4 && progressTitle.style.display === 'none') {
            progressTitle.style.display = 'block';
            progressBarContainer.style.display = 'block';
        }
    }

    const updateWidthModal = (index) => {
        if (index > 4) modalAmbos.style.width = '43%';
        if (index <= 4) modalAmbos.style.width = '90%';
    }

    const updateProgress = () => {
        const percent = (currentStep / totalSteps) * 100;
        progressBar.style.width = `${percent}%`;

        if (currentStep === totalSteps) {
            updateVisibilityButtons(currentStep);

            btnNextStep.removeEventListener('click', nextElement);
            btnNextStep.addEventListener('click', initModalProntuario);

            fileNames[fileNames.length - 1].innerText = 'Todos os arquivos foram selecionados';
        } else {
            updateTextButtons();
            updateVisibilityButtons(currentStep);
        }
    };

    const updateVisibilityButtons = () => {
        if (currentStep === 6) {
            // btnNextStep.style.display = 'none';
            // btnPrevStep.style.display = 'none';
            // btnSubmit.style.display = 'block';
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
            btnPrevStep.addEventListener('click', closeModaBoth);
        }
        else {
            btnPrevStep.removeEventListener('click', closeModaBoth);
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

        const activeStep = document.querySelector(`#modal-ambos-container .form-step[data-step="${step}"]`);

        if (activeStep) activeStep.classList.add('active');

        if (step > 4) activeStep.classList.add('ressonancia')
        if (step <= 4) activeStep.classList.remove('ressonancia')

        if (step >= steps.length) {
            const lastStep = steps[steps.length - 1];
            lastStep.classList.add('active');
        }
    };

    const showCurrentLabel = (index) => {
        if (index < 6) {
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

            showCurrentLabel(currentStep);
            showCurrentStep(currentStep);
            showCurrentInput(currentStep);
            updateCurrentLabelIcon(currentStep);
            updateTitleModal(currentStep);
            updateVisibilityLabels(currentStep);
            updateVisibilityProgressBar(currentStep);
            updateWidthModal(currentStep);

            if (stepProgressValue < inputs.length) {
                stepProgressValue++;
                valueProgress.innerHTML = `${stepProgressValue}`;
            }

            updateProgress();
        }
    }

    function prevElement() {
        if (currentStep > 0) {
            currentStep--;

            showCurrentLabel(currentStep)
            showCurrentStep(currentStep);
            showCurrentInput(currentStep)
            updateTitleModal(currentStep);
            updateVisibilityLabels(currentStep);
            updateVisibilityProgressBar(currentStep);
            updateWidthModal(currentStep);

            if (stepProgressValue >= 1) {
                stepProgressValue--;
                valueProgress.innerHTML = `${stepProgressValue}`;
            }

            updateProgress();
        }
    }

    function initModalProntuario() {
        modalProntuarioAmbos.style.display = 'block';
        modalAmbos.style.display = 'none';
    }
}