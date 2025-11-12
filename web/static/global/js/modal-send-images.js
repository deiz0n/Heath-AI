import { closeCurrentModal } from "../../web/js/script.js";

export function openModalResonance(e) {
  const btn = e?.currentTarget || e?.target;
  let dataTarget = btn?.getAttribute("data-target-modal");
  const modalRegisterPatient = document.querySelector(
    "#modal-register-patient-container"
  );
  const patientDetailTarget = document.querySelector(
    "#result-search-patient-modal"
  );
  const backgroundModal = document.querySelector("#modal-backdrop");
  const modalSearchPatient = document.querySelector(
    "#modal-search-patient-container"
  );

  if (!dataTarget)
    dataTarget = patientDetailTarget.getAttribute("data-target-modal");

  closeCurrentModal(modalRegisterPatient?.id);
  closeCurrentModal(modalSearchPatient?.id);

  if (dataTarget === "modal-x-ray" || dataTarget === "modal-resonance") {
    const modalResonance = document.querySelector(".modal-send-images");
    setInputPatientModalResonance();
    updateTitleModal(dataTarget);
    setValueInputHidden(dataTarget);
    setNameInputImages(dataTarget); // Atualiza o nome do input ANTES de abrir o modal

    // Debug: verificar se o nome foi atualizado
    const inputImages = document.querySelector(".input-images");
    console.log("📝 Nome do input após setNameInputImages:", inputImages?.name);

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
  // Mostra "1 arquivo" se apenas 1 for selecionado
  const texto = quantity === 1 ? "arquivo" : "arquivos";
  quantityFiles.innerText = `${quantity} ${texto}`;
}

function setInputPatientModalResonance() {
  const formRegisterPatient = document.querySelector("#form-register-patient");
  const modalSearchPatient = document.querySelector(
    "#result-search-patient-modal"
  );
  const inputPatient = document.querySelector("#input-patient-modal-resonance");

  inputPatient.value = formRegisterPatient?.getAttribute("data-patient") || "";

  if (!inputPatient.value)
    inputPatient.value = modalSearchPatient?.getAttribute("data-patient") || "";
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

  // Validação: apenas 1 arquivo permitido
  if (quantityFiles > 1) {
    alert("Por favor, selecione apenas 1 imagem para análise.");
    e.target.value = ""; // Limpa o input
    quantityFiles = 0;
  }

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

  if (!inputImages) {
    console.error("❌ Input de imagens não encontrado!");
    return;
  }

  if (target.includes("x-ray")) {
    inputImages.name = "images_xray";
    console.log("✓ Input configurado para X-Ray: images_xray");
  } else {
    inputImages.name = "images_resonance";
    console.log("✓ Input configurado para Ressonância: images_resonance");
  }

  // Força o atributo name no HTML
  inputImages.setAttribute("name", inputImages.name);
}

document.addEventListener("DOMContentLoaded", assignListenersModalResonance);
document.body.addEventListener("htmx:afterSwap", assignListenersModalResonance);
