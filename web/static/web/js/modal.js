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

const valoresInputModalAmbos = [];
const valoresInput = [];
let indiceAtual = 0;
let progressoAtualizado = false;

// Acompanha em qual etapa do fluxo "Ambos" estamos
let ambosCurrentStage = "";

// Variável para armazenar o tipo de modal atual
let tipoModalAtual = null;

const tipoModal = {
    RaioX: 'RaioX',
    Ressonancia: 'Ressonancia',
    Ambos: 'Ambos'
};

// Armazenar funções de manipulação de eventos para remoção posterior
let avancarHandler = null;
let regredirHandler = null;
let inputHandlers = [];

btnIniciar.addEventListener('click', () => {
    modalOpcoes.style.display = 'block'
})

btnFecharModal.addEventListener('click', () => {
    console.log('fechar');
    fecharModal();
})

btnIniciarModalRaioX.addEventListener('click', (e) => {
    atualizarTituloModal(e.target.textContent);
    tipoModalAtual = tipoModal.RaioX;
    ambosCurrentStage = "";
    iniciarModalBasico(tipoModalAtual);
})

btnIniciarModalRessoncia.addEventListener('click', (e) => {
    atualizarTituloModal(e.target.textContent);
    tipoModalAtual = tipoModal.Ressonancia;
    ambosCurrentStage = "";
    iniciarModalBasico(tipoModalAtual);
})

btnIniciarModalAmbos.addEventListener('click', () => {
    atualizarTituloModal('Raio-X');
    tipoModalAtual = tipoModal.Ambos;
    ambosCurrentStage = "RaioX";
    iniciarModalBasico(tipoModalAtual);
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

    // Resetamos o estado do fluxo "Ambos" e o tipo de modal
    ambosCurrentStage = "";
    tipoModalAtual = null;

    // Removemos todos os event listeners
    removerEventos();
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

    // Na transição do fluxo "Ambos", preservamos alguns estados
    if (tipoModalAtual !== tipoModal.Ambos || ambosCurrentStage === "") {
        removerEventos();
        valoresInput.length = 0;
    }

    progresso.style.width = '0px'
    tituloProgresso.textContent = '0'
    indiceAtual = 0;
    btnCancelar.innerText = 'Cancelar';
    btnAvancar.innerText = 'Avançar';

    if (valoresInputModalAmbos.length === 11) valoresInput.length = 0;
}

function iniciarModalBasico(modalTipo) {
    modalRaioX.style.display = 'block';

    // Removemos os event listeners existentes antes de configurar novos
    removerEventos();

    resetarComponentesModal();

    indiceAtual = 0;

    ocultarTodosOsInputs();

    mostrarInputAtual();

    atualizarLabels();

    if (btnCancelar) {
        btnCancelar.setAttribute('data-action', 'fechar');
    }

    // Configura novos event listeners para o tipo de modal atual
    percorrerElementosModalBasico(modalTipo);
}

function fecharModalInicial() {
    modalOpcoes.style.display = 'none';
    modalRaioX.style.display = 'none';
}

function formatarNomeAequivo(arquivo) {
    return arquivo.split('\\').pop();
}

function percorrerElementosModalBasico(modalTipo) {
    // Limpa os manipuladores antigos
    inputHandlers = [];

    // Configurar event listeners para os inputs
    inputsFile.forEach((input, index) => {
        const inputHandler = (event) => {
            console.log(`Mudança no input ${index}: ${event.target.id}`);
            console.log("Tipo de modal atual:", modalTipo);

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
        };

        // Armazenar o manipulador para remoção posterior
        inputHandlers.push({ element: input, handler: inputHandler, type: 'change' });

        // Adicionar o event listener
        input.addEventListener('change', inputHandler);
    });

    // Configurar o event listener para o botão Avançar
    avancarHandler = (e) => avancar(e, modalTipo);
    btnAvancar.addEventListener('click', avancarHandler);

    // Configurar o event listener para o botão Cancelar
    regredirHandler = (e) => regredir(e);
    btnCancelar.addEventListener('click', regredirHandler);
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

function iniciarModalProntuario(modal) {
    const nomeArquivo = document.querySelector('#valor-input-prontuario');
    const inputProntuario = document.querySelector('#input-prontuario');

    modalRaioX.style.display = 'none';
    modalProntuario.style.display = 'block';
    nomeArquivo.style.visibility = 'visible';

    // Remover listeners antigos do inputProntuario
    const oldProntuarioListeners = getEventListeners(inputProntuario, 'change');
    if (oldProntuarioListeners && oldProntuarioListeners.length > 0) {
        oldProntuarioListeners.forEach(listener => {
            inputProntuario.removeEventListener('change', listener);
        });
    }

    const prontuarioHandler = () => {
        nomeArquivo.innerText = formatarNomeAequivo(inputProntuario.value) || 'Nenhum arquivo selecionado';
    };

    inputProntuario.addEventListener('change', prontuarioHandler);

    // Remover listeners antigos dos botões
    if (btnConcluir) {
        const oldConcluirListeners = getEventListeners(btnConcluir, 'click');
        if (oldConcluirListeners && oldConcluirListeners.length > 0) {
            oldConcluirListeners.forEach(listener => {
                btnConcluir.removeEventListener('click', listener);
            });
        }

        btnConcluir.addEventListener('click', () => {
            if (modal === tipoModal.RaioX || modal === tipoModal.Ressonancia) valoresInput.push(inputProntuario.value);
            else valoresInputModalAmbos.push(inputProntuario.value);

            modalProntuario.style.display = 'none';
            console.log('Aguardando o envio dos arquivos...');
            fecharModal();
        });
    }

    if (btnCancelar) {
        // Remover listener antigo
        if (regredirHandler) {
            btnCancelar.removeEventListener('click', regredirHandler);
        }

        btnCancelar.addEventListener('click', () => {
            valoresInput.push(inputProntuario.value);
            console.log(valoresInput);
            modalProntuario.style.display = 'none';
            console.log('Aguardando o envio dos arquivos...');
            fecharModal();
        });
    }
}

function getEventListeners(element, type) {
    return [];
}

function avancar(e, modalTipo) {
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
    console.log("Tipo de modal atual:", modalTipo);

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
        if (modalTipo === tipoModal.Ambos) {

            if (ambosCurrentStage === "RaioX") {
                // Primeira etapa do "Ambos" está completa (RaioX)
                // Transição para a segunda etapa (Ressonancia)
                console.log("Transicionando de RaioX para Ressonancia no fluxo Ambos");
                ambosCurrentStage = "Ressonancia";
                atualizarTituloModal('Ressonância');

                // Reiniciamos o componente para o próximo estágio
                valoresInputModalAmbos.push(...valoresInput);
                resetarComponentesModal();
                mostrarInputAtual();
                atualizarLabels();
                console.log("Valores do fluxo Ambos:", valoresInputModalAmbos);
                // Note que estamos mantendo modalTipo como tipoModal.Ambos
            } else {
                // Ambas as etapas concluídas, mostrar prontuário
                valoresInputModalAmbos.push(...valoresInput);
                mostrarMenssagemSucesso();
                iniciarModalProntuario(modalTipo);
                console.log(valoresInputModalAmbos);
            }
        } else if (modalTipo === tipoModal.RaioX || modalTipo === tipoModal.Ressonancia) {
            mostrarMenssagemSucesso();
            iniciarModalProntuario(modalTipo);
        }
    }
}

function regredir(e) {
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
}

function removerEventos() {
    // Remover os event listeners de avanço e retrocesso
    if (avancarHandler) {
        btnAvancar.removeEventListener('click', avancarHandler);
        avancarHandler = null;
    }

    if (regredirHandler) {
        btnCancelar.removeEventListener('click', regredirHandler);
        regredirHandler = null;
    }

    inputHandlers.forEach(({ element, handler, type }) => {
        element.removeEventListener(type, handler);
    });

    inputHandlers = [];

    window.eventListenersSet = false;
}