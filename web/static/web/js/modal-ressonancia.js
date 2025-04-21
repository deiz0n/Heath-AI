export function startModalRessonancia() {
    const btnNextStep = document.querySelector('#btn-next-step-ressonancia');

    const modalRessonancia = document.querySelector('#modal-ressonancia-container');
    const initModalProntuarioRessonancia = document.querySelector('#modal-prontuario-container-ressonancia');

    const input = document.querySelector('#input-ressonancia');

    input.addEventListener('change', (e) => {
        updateQuantityFiles(e.target.files.length);
    });

    btnNextStep.addEventListener('click', initModalProntuario);

    initModal();

    function initModal() {
        modalRessonancia.style.display = 'block';
    };

    function updateQuantityFiles(quantity) {
        const quantityFiles = document.querySelector('#valor-input-ressonancia span');
        quantityFiles.innerText = `${quantity}`;
    };

    function initModalProntuario() {
        initModalProntuarioRessonancia.style.display = 'block';
        modalRessonancia.style.display = 'none';
    }
};