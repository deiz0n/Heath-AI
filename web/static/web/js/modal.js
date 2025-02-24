const btnIniciar = document.querySelector('#main-btn');
const btnCancelar = document.querySelector('#btn-cancelar');
const btnAvancar = document.querySelector('#btn-avancar')
const btnFecharModal = document.querySelector('.btn-fechar');

const modal = document.querySelector('#modal-container');

const inputsFile = document.querySelectorAll('.input-container input[type="file"]');
const labels = document.querySelectorAll('[id^="label"]')
const titulosInput = document.querySelectorAll('.valor-input')

const progresso = document.querySelector('#progresso')
const estiloValorProgresso = window.getComputedStyle(progresso)
const larguraValorProgresso = estiloValorProgresso.getPropertyValue('width')
const estiloBarraProgresso = window.getComputedStyle(progresso.parentElement)
const larguraBarraProgresso = estiloBarraProgresso.getPropertyValue('width')
const tituloProgresso = document.querySelector('#valor-progresso span')

const msgSucesso = document.querySelector('#mensagem-sucesso')

const valoresInput = []

btnIniciar.addEventListener('click', () => {
    modal.style.display = 'block';
    inputsFile[0].style.visibility = 'visible'
    titulosInput[0].style.visibility = 'visible'
    labels[0].style.color = '#0360D9'
})

btnCancelar.addEventListener('click', () => {
    modal.style.display = 'none'
})

btnFecharModal.addEventListener('click', () => {
    fecharModal()
}) 

inputsFile.forEach((input, index) => {
    input.addEventListener('change', (event) => {
        console.log(`${event.target.id} OK!`);
        
        // Atualiza o título, indicando o arquivo selecionado
        if (index < titulosInput.length - 1) {
            const tituloInput = titulosInput[index]
            tituloInput.textContent = `${event.target.value}`
        }

        valoresInput.push(event.target.value);
        
        // Atualiza o ícone do label do input correspondente
        if (event.target.value) atualizarStatusLabel(event.target.id.replace('img-', ''));

        // Atualiza a barra de progresso
        atualizarBarraProgresso()

        btnAvancar.addEventListener('click', () => {
            
            // Desabilita o custom input atual
            const customInputAtual = event.target.nextElementSibling;
            customInputAtual.style.visibility = 'hidden';

            // Desabilita o título atual
            titulosInput[index].style.visibility = 'hidden'

            if (index < labels.length - 1) {
                labels[index].style.color = '#2E2E2E'
                labels[index + 1].style.color = '#0360D9'
            }
            
            if (index < inputsFile.length - 1) {
                // Desabilita o input atual
                input.style.visibility = 'hidden';
                
                // Ativa o próximo título, input e customInput respectivamente
                titulosInput[index + 1].style.visibility = 'visible';
                inputsFile[index + 1].style.visibility = 'visible';
                inputsFile[index + 1].nextElementSibling.style.visibility = 'visible';
            }
            
            if (index === inputsFile.length - 1) {
                customInputAtual.style.display = 'none';
                inputsFile[index].style.display = 'none'
                
            }
        });
    });
});

function atualizarStatusLabel(inputId) {    
    const label = document.querySelector(`#label-${inputId}`);
    if (label) {
        const icon = label.querySelector('.icone-pendente');
        icon.textContent = 'check_circle';
        icon.style.color = '#4CAF50';
    }
}

function fecharModal() {
    labels.forEach(label => {
        const icone = label.children[0]
        icone.textContent = 'access_time'
        icone.style.color = '#2E2E2E'
        label.style.color = '#2E2E2E'
    })
    inputsFile.forEach(input => {
        input.value = ''
        input.style.visibility = 'hidden'
    })
    titulosInput.forEach(titulo => {
        titulo.style.visibility = 'hidden';
        titulo.textContent = 'Nenhum arquivo selecionado'
    })
    progresso.style.width = '0px'
    tituloProgresso.textContent = '0'
    modal.style.display = 'none'
}

function atualizarBarraProgresso() {
    const valorLaguraProgresso = parseFloat(larguraValorProgresso.replace('px', ''));
    const valorLaguraBarraProgresso = parseFloat(larguraBarraProgresso.replace('px', ''));

    let valorProgresso = parseFloat(progresso.style.width.replace('px', '')) || 0;
    let valorPorcentagemPorgresso = parseInt(tituloProgresso.textContent) || 0;

    if (valorLaguraProgresso <= valorLaguraBarraProgresso) {
        valorProgresso += valorLaguraBarraProgresso * 0.2;
        valorPorcentagemPorgresso += 20;

        valorProgresso = `${valorProgresso}px`
        tituloProgresso.textContent = `${valorPorcentagemPorgresso}`

        progresso.style.width = valorProgresso
    }
}