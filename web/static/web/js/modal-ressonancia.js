export function startModalRessonancia() {
    const modalRessonancia = document.querySelector('#modal-ressonancia-container');

    const input = document.querySelector('#input-ressonancia');

    input.addEventListener('change', (e) => {
        updateQuantityFiles(e.target.files.length);
    });

    initModal();

    function initModal() {
        modalRessonancia.style.display = 'block';
    };

    function updateQuantityFiles(quantity) {
        const quantityFiles = document.querySelector('#valor-input-ressonancia span');
        quantityFiles.innerText = `${quantity}`;
    };
};