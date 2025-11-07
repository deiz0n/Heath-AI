import { closeCurrentModal } from "./script.js";

export function openModalExamXRay(e) {
  const patientDetailTarget = document.querySelector("#result-search-patient-modal");

  const btn = e?.currentTarget || e?.target;

  let dataTarget = btn?.getAttribute("data-target-modal");
  
  if (!dataTarget) 
    dataTarget = patientDetailTarget.getAttribute('data-target-modal');
  
  if (dataTarget !== "modal-both") return;
  
  
  const modalXray = document.querySelector("#modal-exam-xray");
  const backgroundModal = document.querySelector("#modal-backdrop");
  const modalRegisterPatient = document.querySelector("#modal-register-patient-container");
  
  const modalSearchPatient = document.querySelector('#modal-register-patient-container');

  if (modalRegisterPatient) closeCurrentModal(modalRegisterPatient.id);
  if (modalSearchPatient) closeCurrentModal(modalSearchPatient.id)

  if (modalXray && backgroundModal) {
    modalXray.style.display = "block";
    backgroundModal.classList.add("show");
  }
  setValueInputHidden();
}

function closeModalExamXRay() {
  const modalXRay = document.querySelector("#modal-exam-xray");
  if (modalXRay) modalXRay.style.display = "none";
}

function backToModalExamXray() {
  const modalResonance = document.querySelector("#modal-exam-resonance");
  const modalXray = document.querySelector("#modal-exam-xray");
  closeCurrentModal(modalResonance.id);
  modalXray.style.display = "block";
}

function openModalExamResonance() {
  const modalResonance = document.querySelector("#modal-exam-resonance");
  closeModalExamXRay();
  modalResonance.style.display = "block";
}

function closeModalExamResonance() {
  const modalResonance = document.querySelector("#modal-exam-resonance");
  if (modalResonance) modalResonance.style.display = "none";
}

function backToModalResonance() {
  const modalResonance = document.querySelector("#modal-exam-resonance");
  const modalRecordBoth = document.querySelector(
    "#modal-prontuario-container-ambos"
  );
  closeCurrentModal(modalRecordBoth.id);
  modalResonance.style.display = "block";
}

function openModalRecord() {
  const modalRecordBoth = document.querySelector(
    "#modal-prontuario-container-ambos"
  );
  closeModalExamResonance();
  if (modalRecordBoth) modalRecordBoth.style.display = "block";
}

function closeModalBoth() {
  document.querySelectorAll(".modal-exam-send-images").forEach((modal) => {
    modal.style.display = "none";
  });
  const inputs = document.querySelectorAll(
    ".modal-exam-send-images input, #modal-prontuario-container-ambos input"
  );
  updateQuantityFiles(0);
  inputs.forEach((input) => {
    input.value = "";
  });
  const backgroundModal = document.querySelector("#modal-backdrop");
  if (backgroundModal) backgroundModal.classList.remove("show");
}

function updateQuantityFiles(
  quantityXRays = undefined,
  quantityResonances = undefined
) {
  const quantityFilesXRay = document.querySelector(
    "#modal-exam-xray #valor-input-ressonancia span"
  );
  const quantityFilesResonance = document.querySelector(
    "#modal-exam-resonance #valor-input-ressonancia span"
  );

  if (quantityXRays != undefined)
    quantityFilesXRay.innerText = `${quantityXRays}`;
  if (quantityResonances != undefined)
    quantityFilesResonance.innerText = `${quantityResonances}`;
}

function setValueInputHidden() {
  const formRegisterPatient = document.querySelector("#form-register-patient");
  const modalSearchPatient = document.querySelector("#modal-search-patient-container");
  const inputPatient = document.querySelector("#input-patient-modal-both");
  const inputTypeExam = document.querySelector("#input-type-exam");

  if (formRegisterPatient && inputPatient) 
    inputPatient.value = formRegisterPatient.getAttribute("data-patient") || "";
  if (modalSearchPatient && inputPatient)
    inputPatient.value = modalSearchPatient.getAttribute("data-patient") || "";
  
  if (inputTypeExam) inputTypeExam.value = "both";
}

function assignListenersModalBoth() {
  const btnOpenModalXRayExam = document.querySelector(
    "#btn-submit-modal-register-patient"
  );
  if (btnOpenModalXRayExam) {
    btnOpenModalXRayExam.removeEventListener("click", openModalExamXRay);
    btnOpenModalXRayExam.addEventListener("click", function (e) {
      openModalExamXRay(e);
    });
  }

  const btnOpenModalResonanceExam = document.querySelector(
    "#btn-submit-images-xray"
  );
  if (btnOpenModalResonanceExam) {
    btnOpenModalResonanceExam.removeEventListener(
      "click",
      openModalExamResonance
    );
    btnOpenModalResonanceExam.addEventListener("click", openModalExamResonance);
  }

  const btnOpenModalRecord = document.querySelector(
    "#btn-submit-images-resonance"
  );
  if (btnOpenModalRecord) {
    btnOpenModalRecord.removeEventListener("click", openModalRecord);
    btnOpenModalRecord.addEventListener("click", openModalRecord);
  }

  const btnCloseModalBoth = document.querySelectorAll(
    ".modal-exam-send-images .btn-fechar"
  );
  btnCloseModalBoth?.forEach((btn) => {
    btn.removeEventListener("click", closeModalBoth);
    btn.addEventListener("click", closeModalBoth);
  });

  const inputImages = document.querySelectorAll(
    ".modal-exam-send-images .input-container-images input"
  );
  inputImages?.forEach((input) => {
    input.removeEventListener("change", updateQuantityFiles);
    input.removeEventListener("change", handleInputSubmitImages);
    if (input.name === "images_xray") {
      input.addEventListener("change", (e) =>
        updateQuantityFiles(e.target.files.length)
      );
    } else {
      input.addEventListener("change", (e) =>
        updateQuantityFiles(null, e.target.files.length)
      );
    }
    input.addEventListener("change", handleInputSubmitImages);
  });

  const btnBackModalImagesXRay = document.querySelector(
    "#btn-back-images-xray"
  );
  if (btnBackModalImagesXRay) {
    btnBackModalImagesXRay.removeEventListener("click", backToModalExamXray);
    btnBackModalImagesXRay.addEventListener("click", backToModalExamXray);
  }

  const btnBackModalProntuario = document.querySelector("#btn-back-prontuario");
  if (btnBackModalProntuario) {
    btnBackModalProntuario.removeEventListener("click", backToModalResonance);
    btnBackModalProntuario.addEventListener("click", backToModalResonance);
  }
}

function handleInputSubmitImages(e) {
  const modal = e.target.closest(".modal-exam-send-images");
  if (!modal) return;
  const btn = modal.querySelector('button.btn-primary[type="button"]');
  if (!btn) return;
  btn.disabled = e.target.files.length === 0;
}

document.addEventListener("DOMContentLoaded", assignListenersModalBoth);
document.body.addEventListener("htmx:afterSwap", assignListenersModalBoth);
