const btnIniciar = document.querySelector('#main-btn');
const btnCancelar = document.querySelector('#btn-cancelar');
const btnAvancar = document.querySelector('#btn-avancar');
const btnFecharModal = document.querySelector('.btn-fechar');
const btnIniciarModalRaioX = document.querySelector('#btn-modal-raiox');
const btnIniciarModalRessoncia = document.querySelector('#btn-modal-ressonancia');
const btnIniciarModalAmbos = document.querySelector('#btn-modal-ambos');
const btnConcluir = document.querySelector('#btn-concluir')

const modalOpcoes = document.querySelector('#modal-opcoes-container');
const modalRaioX = document.querySelector('#modal-raiox-container');
const modalAmbos = document.querySelector('#modal-raiox-container');
const modalProntuario = document.querySelector('#modal-prontuario-container');

const inputContainer = document.querySelector('.input-container');

const inputsFile = document.querySelectorAll('.input-container input, textarea');
const labels = document.querySelectorAll('[id^="label"]');
const nomeArquivo = document.querySelectorAll('.valor-input');

const progresso = document.querySelector('#progresso');
const estiloValorProgresso = window.getComputedStyle(progresso);
const larguraValorProgresso = estiloValorProgresso.getPropertyValue('width');
const estiloBarraProgresso = window.getComputedStyle(progresso.parentElement);
const larguraBarraProgresso = estiloBarraProgresso.getPropertyValue('width');
const tituloProgresso = document.querySelector('#valor-progresso span');

const valoresInput = [];
let indiceAtual = 0;
let progressoAtualizado = false;


btnIniciar.addEventListener('click', () => {
    modalOpcoes.style.display = 'block'
})

btnFecharModal.addEventListener('click', () => {
    console.log('fechar');
    fecharModal();
})

btnIniciarModalRaioX.addEventListener('click', (e) => {
    atualizarTituloModal(e.target.textContent);
    iniciarModalBasico();
})

btnIniciarModalRessoncia.addEventListener('click', (e) => {
    atualizarTituloModal(e.target.textContent);
    iniciarModalBasico();
})

function atualizarStatusLabel(inputId) {
    const label = document.querySelector(`#label-${inputId}`);
    if (label) {
        const icon = label.querySelector('.icone-pendente');
        icon.textContent = 'check_circle';
        icon.style.color = '#4CAF50';
    }
}

function fecharModal() {
    resetarComponentesModal()
    modalOpcoes.style.display = 'none'
    modalRaioX.style.display = 'none'
}

function atualizarBarraProgresso() {
    const valorLaguraBarraProgresso = parseFloat(larguraBarraProgresso.replace('px', ''));

    const porcentagem = Math.min(100, (indiceAtual + 1) * 20);
    const larguraProgresso = (valorLaguraBarraProgresso * porcentagem) / 100;

    progresso.style.width = `${larguraProgresso}px`;
    tituloProgresso.textContent = indiceAtual + 1;
}

function diminuirBarraProgresso() {
    const valorLaguraBarraProgresso = parseFloat(larguraBarraProgresso.replace('px', ''));

    const porcentagem = Math.max(0, indiceAtual * 20);
    const larguraProgresso = (valorLaguraBarraProgresso * porcentagem) / 100;

    progresso.style.width = `${larguraProgresso}px`;
    tituloProgresso.textContent = indiceAtual;
}

function ocultarTodosOsInputs() {
    inputsFile.forEach((input, index) => {
        input.style.visibility = 'hidden';

        if (nomeArquivo[index]) {
            nomeArquivo[index].style.visibility = 'hidden';
        }

        const customInput = input.nextElementSibling;
        if (customInput) {
            customInput.style.visibility = 'hidden';
        }
    });
}

function mostrarInputAtual() {
    if (indiceAtual >= 0 && indiceAtual < inputsFile.length) {
        inputsFile[indiceAtual].style.visibility = 'visible';

        if (nomeArquivo[indiceAtual]) {
            nomeArquivo[indiceAtual].style.visibility = 'visible';
        }

        const customInput = inputsFile[indiceAtual].nextElementSibling;
        if (customInput) {
            customInput.style.visibility = 'visible';
        }
    }
}

function atualizarLabels() {
    labels.forEach((label, index) => {
        if (index === indiceAtual) {
            label.style.color = '#0360D9';
        } else {
            label.style.color = '#2E2E2E';
        }
    });
}

function resetarComponentesModal() {
    labels.forEach(label => {
        const icone = label.children[0];
        icone.textContent = 'access_time';
        icone.style.color = '#2E2E2E';
        label.style.color = '#2E2E2E';
    });

    inputsFile.forEach(input => {
        input.value = '';
        input.style.visibility = 'hidden';
    })

    nomeArquivo.forEach(titulo => {
        titulo.style.visibility = 'hidden';
        titulo.textContent = 'Nenhum arquivo selecionado';
    })

    // Oculta os custom inputs também
    inputsFile.forEach(input => {
        const customInput = input.nextElementSibling;
        if (customInput) {
            customInput.style.visibility = 'hidden';
        }
    });

    progresso.style.width = '0px'
    tituloProgresso.textContent = '0'
    indiceAtual = 0; //
    valoresInput.length = 0;
    btnCancelar.innerText = 'Cancelar';
    btnAvancar.innerText = 'Avançar';
}

function iniciarModalBasico() {
    modalRaioX.style.display = 'block';

    resetarComponentesModal();

    indiceAtual = 0;

    ocultarTodosOsInputs();

    mostrarInputAtual();

    atualizarLabels();

    if (btnCancelar) {
        btnCancelar.setAttribute('data-action', 'fechar');
    }

    // Configura os event listeners uma única vez
    if (!window.eventListenersSet) {
        percorrerElementosModalBasico(16.66);
        window.eventListenersSet = true;
    }
}

function fecharModalInicial() {
    modalOpcoes.style.display = 'none';
    modalRaioX.style.display = 'none';
}

function formatarNomeAequivo(arquivo) {
    return arquivo.split('\\').pop();
}

function percorrerElementosModalBasico() {
    // Configurar event listeners para os inputs
    inputsFile.forEach((input, index) => {
        input.addEventListener('change', (event) => {
            console.log(`Mudança no input ${index}: ${event.target.id}`);

            const tituloInput = nomeArquivo[index];
            if (tituloInput) {
                const fileName = formatarNomeAequivo(event.target.value);
                tituloInput.textContent = fileName || 'Nenhum arquivo selecionado';
            }

            if (index >= valoresInput.length) {
                valoresInput.push(event.target.value);
            } else {
                valoresInput[index] = event.target.value;
            }

            atualizarBarraProgresso();

            atualizarStatusLabel(event.target.id.replace('img-', ''));
        });
    });

    btnAvancar.addEventListener('click', (e) => {
        e.preventDefault();

        if (!inputsFile[indiceAtual].value) {
            nomeArquivo[indiceAtual].innerText = "Selecione um arquivo antes de avançar";

            setTimeout(() => {
                nomeArquivo[indiceAtual].innerText = "Nenhum arquivo selecionado"
            }, 1000);

            return;
        }

        atualizarNomeBtnCancelar(indiceAtual + 1);

        console.log(`Avançando do índice ${indiceAtual} para ${indiceAtual + 1}`);

        if (indiceAtual < inputsFile.length - 1) {
            ocultarTodosOsInputs();

            indiceAtual++;

            mostrarInputAtual();

            atualizarLabels();

            if (btnCancelar) {
                btnCancelar.setAttribute('data-action', 'voltar');
            }

            console.log(`Agora no índice ${indiceAtual}`);
        } else {
            mostrarMenssagemSucesso();
            iniciarModalProntuario();
        }
    });

    btnCancelar.addEventListener('click', (e) => {
        e.preventDefault();

        const action = btnCancelar.getAttribute('data-action');

        atualizarNomeBtnCancelar(indiceAtual - 1);

        if (action === 'fechar' || indiceAtual === 0) {
            fecharModal();
        } else {
            console.log(`Voltando do índice ${indiceAtual} para ${indiceAtual - 1}`);

            ocultarTodosOsInputs();

            indiceAtual--;

            mostrarInputAtual();

            atualizarLabels();

            diminuirBarraProgresso();

            if (indiceAtual === 0) {
                btnCancelar.setAttribute('data-action', 'fechar');
            }

            console.log(`Agora no índice ${indiceAtual}`);
        }
    });
}

function atualizarTituloModal(titulo) {
    const tituloGenerio = document.querySelector('.modal-titulo span')
    tituloGenerio.textContent = titulo
}

function atualizarNomeBtnCancelar(indice) {
    console.log(indice)
    if (indice != 0) btnCancelar.innerText = 'Voltar';
    if (indice === 0) btnCancelar.innerText = 'Cancelar';
}

function mostrarMenssagemSucesso() {
    btnAvancar.innerText = 'Concluir';
    nomeArquivo[indiceAtual].innerText = 'Todos os arquivos foram carregados';
    inputsFile.forEach(input => {
        input.value = '';
        input.style.visibility = 'hidden';
    })
}

function iniciarModalProntuario() {
    const nomeArquivo = document.querySelector('#valor-input-prontuario');
    const inputProntuario = document.querySelector('#input-prontuario');

    modalRaioX.style.display = 'none';
    modalProntuario.style.display = 'block';
    nomeArquivo.style.visibility = 'visible';

    inputProntuario.addEventListener('change', () => {
        nomeArquivo.innerText = formatarNomeAequivo(inputProntuario.value) || 'Nenhum arquivo selecionado';
    });

    btnConcluir.addEventListener('click', () => {
        valoresInput.push(inputProntuario.value);
        console.log(valoresInput);
        modalProntuario.style.display = 'none';
        console.log('Aguardando o envio dos arquivos...');
        fecharModal();
    })

    btnCancelar.addEventListener('click', () => {
        valoresInput.push(inputProntuario.value);
        console.log(valoresInput);
        modalProntuario.style.display = 'none';
        console.log('Aguardando o envio dos arquivos...');
        fecharModal();
    })
}