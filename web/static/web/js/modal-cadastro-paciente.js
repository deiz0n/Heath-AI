import { closeCurrentModal } from "./script.js";

function initializeModalRegisterPatient() {
  const linkOpenModalRegisterPatient = document.querySelector('#register-patient-link');
  const btnOpenModalXRay = document.querySelectorAll(".btn-modal-raiox");
  const btnOpenModalResonance = document.querySelectorAll(".btn-modal-ressonancia");
  const btnOpenModalBoth = document.querySelector("#btn-modal-ambos");
  const btnOpenNextModal = document.querySelector("#btn-submit-modal-register-patient");

  const btnCloseModalRegisterPatient = document.querySelector("#modal-register-patient-container i");
  const btnCloseBottomRegisterPatient = document.querySelector("#btn-close-modal-register-patient");

  const background = document.querySelector("#modal-backdrop");
  const modalOptions2D = document.querySelector("#modal-opcoes-2d-container");
  const modalOptions3D = document.querySelector("#modal-opcoes-3d-container");
  const modalRegisterPatient = document.querySelector("#modal-register-patient-container");
  const modalSearchPatient = document.querySelector('#modal-search-patient-container');
  const patientDetail = document.querySelector('#result-search-patient-modal');

  const inputCpf = document.querySelector("#modal-register-patient-container input[name=cpf]");

  const formRegisterPatient = document.querySelector("#form-register-patient");

  linkOpenModalRegisterPatient?.addEventListener('click', openModalRegisterPatient);
  inputCpf?.addEventListener("input", (e) => formatterCpf(e.target));

  if (btnOpenModalXRay || btnOpenModalResonance || btnOpenModalBoth) {
    btnOpenModalXRay?.forEach((btn) =>
      btn.addEventListener("click", (e) => {
        openModalRegisterPatient();
        setBtnOpenNextModal(e.target);
      })
    );

    btnOpenModalResonance?.forEach((btn) =>
      btn.addEventListener("click", (e) => {
        openModalRegisterPatient();
        setBtnOpenNextModal(e.target);
      })
    );

    btnOpenModalBoth?.addEventListener("click", (e) => {
      openModalRegisterPatient();
      setBtnOpenNextModal(e.target);
    });
  }

  if (btnCloseModalRegisterPatient && btnCloseBottomRegisterPatient) {
    btnCloseBottomRegisterPatient.addEventListener(
      "click",
      closeModalRegisterPatient
    );

    btnCloseBottomRegisterPatient.addEventListener(
      "click",
      closeModalRegisterPatient
    );
  }

  function openModalRegisterPatient() {
    if (modalSearchPatient) modalSearchPatient.style.display = "none";
    if (modalOptions2D.style.display !== "none")
      closeCurrentModal(modalOptions2D.id);
    if (modalOptions3D.style.display !== "none")
      closeCurrentModal(modalOptions3D.id);

    modalRegisterPatient.style.display = "block";
  }

  function closeModalRegisterPatient() {
    modalRegisterPatient.style.display = "none";
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
    formRegisterPatient.setAttribute("data-patient", valueFormatted);
  }

  function setBtnOpenNextModal(btnTarget) {
    if (btnTarget.id.includes("ambos")) {
      btnOpenNextModal.setAttribute("data-target-modal", "modal-both");
      patientDetail.setAttribute("data-target-modal", "modal-both");
    }
    else if (btnTarget.id.includes("x-ray")) {
      btnOpenNextModal.setAttribute("data-target-modal", "modal-x-ray");
      patientDetail.setAttribute("data-target-modal", "modal-x-ray");
    }
    else if (btnTarget.id.includes("resonance")) {
      btnOpenNextModal.setAttribute("data-target-modal", "modal-resonance");
      patientDetail.setAttribute("data-target-modal", "modal-resonance");
    }
  }
}

document.addEventListener("DOMContentLoaded", initializeModalRegisterPatient);
document.body.addEventListener("htmx:afterSwap", initializeModalRegisterPatient);
