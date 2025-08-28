// import { startModalRaioX } from "./modal-raiox.js";

const btnStartRaioX = document.querySelectorAll(".btn-modal-raiox");
const btnStartAmbos = document.querySelector("#btn-modal-ambos");

export function closeCurrentModal(modalId) {
  const modal = document.querySelector(`#${modalId}`);
  modal.style.display = "none";
}
