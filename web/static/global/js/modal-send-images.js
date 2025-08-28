import { closeCurrentModal } from "../../web/js/script.js";

function openModalResonance(e) {
  const btn = e?.currentTarget || e?.target;
  const dataTarget = btn?.getAttribute("data-target-modal");
  const modalRegisterPatient = document.querySelector(
    "#modal-register-patient-container"
  );
  const backgroundModal = document.querySelector("#modal-backdrop");

  closeCurrentModal(modalRegisterPatient?.id);

  if (dataTarget === "modal-x-ray" || dataTarget === "modal-resonance") {
    const modalResonance = document.querySelector(".modal-send-images");
    setInputPatientModalResonance();
    updateTitleModal(dataTarget);
    setValueInputHidden(dataTarget);
    setNameInputImages(dataTarget);
    if (modalResonance && backgroundModal) {
      modalResonance.style.display = "block";
      backgroundModal.classList.add("show");
    }
  }
}

function closeModalResonance() {
  const modalResonance = document.querySelector(".modal-send-images");
  const backgroundModal = document.querySelector("#modal-backdrop");

  if (modalResonance && backgroundModal) {
    modalResonance.style.display = "none";
    backgroundModal.classList.remove("show");
  }
}

function initModalProntuario() {
  const modalResonance = document.querySelector(".modal-send-images");
  const initModalProntuarioRessonancia = document.querySelector(
    "#modal-prontuario-container-ressonancia"
  );

  if (initModalProntuarioRessonancia && modalResonance) {
    initModalProntuarioRessonancia.style.display = "block";
    modalResonance.style.display = "none";
  }
}

function updateQuantityFiles(quantity) {
  const quantityFiles = document.querySelector(
    ".modal-send-images #valor-input-ressonancia span"
  );
  quantityFiles.innerText = `${quantity}`;
}

function setInputPatientModalResonance() {
  const formRegisterPatient = document.querySelector("#form-register-patient");
  const inputPatient = document.querySelector("#input-patient-modal-resonance");

  if (formRegisterPatient && inputPatient) {
    inputPatient.value = formRegisterPatient.getAttribute("data-patient") || "";
  }
}

function updateTitleModal(target) {
  const titleModal = document.querySelector(
    ".modal-send-images .modal-titulo span"
  );

  if (titleModal) {
    if (target.includes("x-ray")) titleModal.innerText = "Raio X";
    else if (target.includes("resonance")) titleModal.innerText = "Ressonância";
  }
}

function assignListenersModalResonance() {
  const btnSubmitImages = document.querySelector("#btn-submit-images");
  const btnOpenModalSendImages = document.querySelector(
    "#btn-submit-modal-register-patient"
  );
  const btnCloseModalResonance = document.querySelector(".modal-send-images i");
  const input = document.querySelector(".modal-send-images .input-images");

  // Corrige o listener para abrir o modal de envio de imagens ao clicar no botão "próximo" do cadastro do paciente
  if (btnOpenModalSendImages) {
    btnOpenModalSendImages.removeEventListener("click", openModalResonance);
    btnOpenModalSendImages.addEventListener("click", openModalResonance);
  }

  if (btnCloseModalResonance) {
    btnCloseModalResonance.removeEventListener("click", () => {
      closeModalResonance();
    });
    btnCloseModalResonance.addEventListener("click", closeModalResonance);
  }

  if (btnSubmitImages) {
    btnSubmitImages.removeEventListener("click", initModalProntuario);
    btnSubmitImages.addEventListener("click", initModalProntuario);
  }

  if (input) {
    input.removeEventListener("change", handleInputSubmitImages);
    input.addEventListener("change", handleInputSubmitImages);

    input.removeEventListener("change", (e) =>
      updateQuantityFiles(e.target.files.length)
    );
    input.addEventListener("change", (e) => {
      updateQuantityFiles(e.target.files.length);
    });
  }
}

function handleInputSubmitImages(e) {
  const btnSubmitImages = document.querySelector(
    ".modal-send-images #btn-submit-images"
  );

  if (!btnSubmitImages) return;

  let quantityFiles = e.target.files.length;
  updateQuantityFiles(quantityFiles);
  if (btnSubmitImages.offsetParent !== null) {
    btnSubmitImages.disabled = quantityFiles === 0;
  }
}

function setValueInputHidden(target) {
  const inputHidden = document.querySelector("#input-type");

  if (target.includes("x-ray")) inputHidden.value = "x-ray";
  else inputHidden.value = "resonance";
}

function setNameInputImages(target) {
  const inputImages = document.querySelector(".input-images");

  if (target.includes("x-ray")) inputImages.name = "images_xray";
  else inputImages.name = "images_resonance";
}

document.addEventListener("DOMContentLoaded", assignListenersModalResonance);
document.body.addEventListener("htmx:afterSwap", assignListenersModalResonance);
