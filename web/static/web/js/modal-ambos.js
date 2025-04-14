import {
    colorBlack,
    colorBlue,
    colorGreen,
    iconPending,
    iconCheck
} from "./styles.js";

export function startModalAmbos() {
    const modalAmbos = document.querySelector('#modal-ambos-container');

    const labels = document.querySelectorAll('#modal-ambos-container [id^="label"]');
    const inputs = document.querySelectorAll('#modal-ambos-container input[type=file]');
    const fileNames = document.querySelectorAll('.input-value-ambos');

    const btnCloseModalRaioX = document.querySelector('#btn-close-ambos');
    const btnNextStep = document.querySelector('#btn-next-step-ambos');
    const btnPrevStep = document.querySelector('#btn-prev-step-ambos');
    const btnSubmit = document.querySelector('#btn-submit-ambos');

    const progressBar = document.querySelector('#modal-ambos-container #progress-bar');
    const valueProgress = document.querySelector('#modal-ambos-container #progress-title span');
    let stepProgressValue = parseInt(valueProgress.innerHTML) || 0;

    const steps = document.querySelectorAll('#modal-ambos-container .form-step');
    const totalSteps = steps.length;
    let currentStep = 0;

    initModal();

    btnCloseModalRaioX.addEventListener('click', closeModa);
    btnNextStep.addEventListener('click', nextElement);
    btnPrevStep.addEventListener('click', prevElement);

    inputs.forEach(input => {
        input.addEventListener('change', () => {
            updateFileName(currentStep);
            console.log(input.id);
        });
    });

    function initModal() {
        modalAmbos.style.display = 'block';

        inputs[0].style.visibility = 'visible';
    }

    function closeModa() {
        modalAmbos.style.display = 'none';
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

        if (index > 4) labelsContainer.style.visibility = 'hidden';
        if (index <= 4 && labelsContainer.style.visibility === 'hidden') labelsContainer.style.visibility = 'visible';
    };

    const updateProgress = () => {
        const percent = (currentStep / totalSteps) * 100;
        progressBar.style.width = `${percent}%`;

        if (currentStep === totalSteps) {
            updateVisibilityButtons(currentStep);

            fileNames[fileNames.length - 1].innerText = 'Todos os arquivos foram selecionados';
        } else {
            updateTextButtons();
            updateVisibilityButtons(currentStep);
        }
    };

    const updateVisibilityButtons = () => {
        if (currentStep === 6) {
            btnNextStep.style.display = 'none';
            btnPrevStep.style.display = 'none';
            btnSubmit.style.display = 'block';
        }
        //     btnNextStep.style.display = 'block'; // Restaurar visibilidade
        //     btnPrevStep.style.display = 'block'; // Restaurar visibilidade
        //     btnSubmit.style.display = 'none';
        // }
    };

    const updateTextButtons = () => {
        if (currentStep < totalSteps) btnNextStep.innerText = 'Avançar';

        if (currentStep > 0) btnPrevStep.innerText = 'Voltar';
        else btnPrevStep.innerText = 'Fechar';
    };

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
            // updateVisibilityLabels(currentStep);

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
            // updateVisibilityLabels(currentStep);

            if (stepProgressValue >= 1) {
                stepProgressValue--;
                valueProgress.innerHTML = `${stepProgressValue}`;
            }

            updateProgress();
        }
    }
};