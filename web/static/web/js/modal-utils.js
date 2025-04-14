// import { initModalProntuario } from "./script.js";
//
// export function startModal(typeModal) {
//
//     const modalBackground = document.querySelector('.modal');
//     // const modal = document.getElementById('modal-backdrop');
//     const closeModalBtn = document.getElementById('btn-close-modal');
//     const nextBtn = document.getElementById('next-step');
//     const prevBtn = document.getElementById('prev-step');
//     const submitBtn = document.getElementById('submit-form');
//     const progressBar = document.getElementById('progress-bar');
//     const titleProgress = document.querySelector('#progress-title span');
//     let stepProgress = parseInt(titleProgress.textContent);
//
//     const labels = document.querySelectorAll('[id^="label"]');
//     const inputs = document.querySelectorAll('input[type=file]');
//     const namesFile = document.querySelectorAll('.valor-input');
//     const iconsLabel = document.querySelectorAll('.icon-pending');
//
//     console.log(namesFile)
//
//     const steps = document.querySelectorAll('.form-step');
//     let currentStep = 0;
//     const totalSteps = steps.length;
//     let stepAux = 0;
//
//
//     // Abrir modal
//     // modal.style.display = 'flex';
//     initModal(typeModal);
//
//     function initModal(typeModal) {
//         const currentModal = document.querySelector(`#modal-${typeModal}-container`)
//         currentModal.style.display = 'block';
//
//         showCurrentLabel(stepAux)
//         inputs[0].style.visibility = 'visible';
//     }
//
//     // function closeModal() {
//     //     modal.style.display = 'none';
//     //     resetComponents();
//     // }
//
//     function resetComponents() {
//         labels.forEach(label => {
//             const iconPending = label.children[0];
//             iconPending.innerHTML = 'access_time';
//             label.style.color = '#2e2e2e'
//         })
//     }
//
//     // Fechar modal
//     closeModalBtn.addEventListener('click', closeModal);
//
//     // Fechar modal ao clicar fora
//     // modal.addEventListener('click', function (e) {
//     //     if (e.target === modal) {
//     //         modal.style.display = 'none';
//     //     }
//     //     resetComponents();
//     // });
//
//     inputs.forEach(input => {
//         input.addEventListener('change', (e) => {
//             updateFileName(currentStep);
//             console.log(`${e.target.name}: ${e.target.value}`)
//         })
//     })
//
//     // Função para atualizar o progresso visual
//     function updateProgress() {
//         const percent = (currentStep / totalSteps) * 100;
//         progressBar.style.width = `${percent}%`;
//
//         // Habilitar/desabilitar botões
//         prevBtn.disabled = currentStep === 1;
//
//         // Realiza as alterações no botão de avançar/concluir
//         if (currentStep === totalSteps) {
//             // nextBtn.style.display = 'none';
//             // prevBtn.style.display = 'none'
//             // submitBtn.style.display = 'block';
//
//             nextBtn.removeEventListener('click', nextElement);
//
//             nextBtn.addEventListener('click', () => {
//                 modalBackground.style.backgroundColor = 'transparent';
//                 modalBackground.style.boxShadow = 'none';
//                 initModalProntuario(typeModal)
//             });
//
//
//             namesFile[namesFile.length - 2].innerText = 'Todos os arquivos foram selecionados';
//         }
//         else {
//             nextBtn.innerText = 'Avançar'
//         }
//
//         // Realiza as alterações no botão de fechar/voltar
//         if (currentStep > 0)
//             prevBtn.innerText = 'Voltar'
//         else
//             prevBtn.innerText = 'Fechar'
//     }
//
//     function activeCurrentInput(index) {
//         if (index < inputs.length) {
//             const input = inputs[index];
//             input.style.visibility = 'visible';
//         }
//     }
//
//     function updateTitleModal(typeModal, index) {
//         if (typeModal === 'ambos') {
//             const title = document.querySelector('.modal-header-title span')
//             if (index === 5) {
//                 title.innerText = 'Ressonância';
//                 if (currentStep < 9)
//                     showCurrentLabel(stepAux);
//             }
//             else
//                 title.innerText = 'Raio X'
//         }
//     }
//
//     function resetCountAux(index) {
//         if (index > 4) {
//             stepAux = 0;
//         }
//     }
//
//     function updateFileName(index) {
//         const value = inputs[index].value;
//         namesFile[index].innerText = value.split('\\').pop() || 'Nenhum arquivo selecionado';
//     }
//
//     // Função para mostrar o passo atual
//     function showStep(step) {
//         steps.forEach(s => s.classList.remove('active'));
//         const activeStep = document.querySelector(`.form-step[data-step="${step}"]`);
//         if (activeStep) {
//             activeStep.classList.add('active');
//         }
//         if (step >= steps.length) {
//             const lastStep = steps[steps.length - 1];
//             lastStep.classList.add('active');
//         }
//     }
//
//     function showCurrentLabel(index, aux) {
//         if (index === 0 && aux < 5) {
//             const label = labels[index];
//             label.style.color = '#0360D9';
//         }
//
//         if (index > 0) {
//             const prevLabel = labels[index - 1];
//             prevLabel.style.color = '#2e2e2e';
//         }
//
//         if (index < labels.length && index !== 5) {
//             const currentLabel = labels[index];
//             currentLabel.style.color = '#0360D9';
//         }
//
//         if (index < labels.length - 1) {
//             const nextLabel = labels[index + 1];
//             nextLabel.style.color = '#2e2e2e';
//         }
//     }
//
//     function updateCurrentLabelIcon(target, stepAux) {
//         labels.forEach((label, index) => {
//             const icon = label.children[0];
//             if (index < stepAux) {
//                 icon.innerText = 'check_circle';
//                 icon.style.color = '#4CAF50';
//             } else if (index === stepAux) {
//                 icon.innerText = 'access_time';
//                 icon.style.color = '#2e2e2e';
//             } else {
//                 icon.innerText = 'access_time';
//                 icon.style.color = '#2e2e2e';
//             }
//         });
//     }
//
//     // Botão próximo
//     nextBtn.addEventListener('click', nextElement);
//
//     function nextElement() {
//         if (!inputs[currentStep].value) {
//             namesFile[currentStep].innerText = "Selecione um arquivo antes de avançar";
//
//             setTimeout(() => {
//                 namesFile[currentStep].innerText = "Nenhum arquivo selecionado"
//             }, 1000);
//
//             return;
//         }
//
//         if (currentStep < totalSteps) {
//             currentStep++;
//             stepAux++;
//
//             showCurrentLabel(stepAux, currentStep)
//             showStep(currentStep);
//             activeCurrentInput(currentStep)
//             resetCountAux(stepAux);
//             updateTitleModal(typeModal, currentStep);
//             updateCurrentLabelIcon(null, stepAux)
//
//             if (stepProgress < inputs.length) {
//                 stepProgress++;
//                 titleProgress.innerHTML = `${stepProgress}`;
//             }
//
//             updateProgress();
//         }
//     }
//
//     // Botão anterior
//     prevBtn.addEventListener('click', function () {
//         if (currentStep > 0) {
//             currentStep--;
//             stepAux--;
//
//             showCurrentLabel(stepAux, currentStep)
//             showStep(currentStep);
//             activeCurrentInput(currentStep)
//             resetCountAux(stepAux);
//             updateTitleModal(typeModal, currentStep);
//
//             if (stepProgress >= 1) {
//                 stepProgress--;
//                 titleProgress.innerHTML = `${stepProgress}`;
//             }
//
//             updateProgress();
//         }
//     });
// }