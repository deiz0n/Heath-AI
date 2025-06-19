document.addEventListener('click', function(e) {
    const background = document.querySelector('.modal-backdrop')

    if (e.target.matches('.image-view img')) {
        const modal = document.querySelector('#modal-img-fullscreen');
        const img = document.querySelector('#img-fullscreen');

        if (modal && img) {
            img.src = e.target.src;
            img.alt = e.target.alt;
            modal.style.display = 'flex';
            background.style.display = 'block'
        }
    }
    if (e.target.id === 'modal-img-fullscreen') {
        e.target.style.display = 'none';
        background.style.display = 'flex'
    }
});