import { openModalResonance } from "../../global/js/modal-send-images.js";
import { openModalExamXRay } from "./modal-ambos.js";

const btnOpenModalSearchPatient = document.querySelector(
  ".search-patient-container a"
);
const btnCloseModalSearchPatient = document.querySelectorAll(
"#modal-search-patient-container #btn-close-raiox, #btn-close-modal-search-patient"
);

const inputCpf = document.querySelector("#modal-search-patient-container #cpf");

const modalSearchPatient = document.querySelector("#modal-search-patient-container");
const modalRegisterPatient = document.querySelector("#modal-register-patient-container");
const background = document.querySelector("#modal-backdrop");
const searchResultContainer = document.querySelector("#result-search-patient-modal");

btnOpenModalSearchPatient?.addEventListener("click", openModalSearchPatient);

btnCloseModalSearchPatient.forEach((btn) =>
  btn.addEventListener("click", closeModalSearchPatient)
);

inputCpf?.addEventListener("input", (e) => formatterCpf(e.target));

searchResultContainer.addEventListener("click", (e) => {
  const patientContainer = e.target.closest(".patient-data");
  getPatientData(patientContainer);
  if (patientContainer) openNextModal(searchResultContainer);
});

function openModalSearchPatient() {
  modalRegisterPatient.style.display = "none";
  modalSearchPatient.style.display = "block";
}

function closeModalSearchPatient() {
  modalSearchPatient.style.display = "none";
  background.classList.remove("show");
}

function formatterCpf(input) {
  let cpfValue = input.value.replace(/\D/g, "");

  if (cpfValue.length > 11) cpfValue = cpfValue.substring(0, 11);

  let valueFormatted = cpfValue;

  if (cpfValue.length > 9)
    valueFormatted = cpfValue.replace(
      /(\d{3})(\d{3})(\d{3})(\d{1,2})/,
      "$1.$2.$3-$4"
    );
  else if (cpfValue.length > 6)
    valueFormatted = cpfValue.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
  else if (cpfValue.length > 3)
    valueFormatted = cpfValue.replace(/(\d{3})(\d{1,3})/, "$1.$2");

  input.value = valueFormatted;
}

function getPatientData(patientContainer) {
  const container = patientContainer.querySelector('.user-cpf');
  const dataPatient = container.textContent.replace('CPF:', '').trim();
  searchResultContainer.setAttribute('data-patient', dataPatient);
}

function openNextModal(containerTarget) {
  openModalExamXRay(containerTarget);
  openModalResonance(containerTarget);
}
