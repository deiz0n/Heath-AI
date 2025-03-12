import { ExameBasico, ExameCompleto } from "./tipo-modal.js";

const btnIniciar = document.querySelector('#main-btn');
let btnCancelar = document.querySelector('#btn-cancelar');
const btnAvancar = document.querySelector('#btn-avancar');
const btnFecharModal = document.querySelector('.btn-fechar');
const btnIniciarModalRaioX = document.querySelector('#btn-modal-raiox');
const btnIniciarModalRessoncia = document.querySelector('#btn-modal-ressonancia');
const btnIniciarModalAmbos = document.querySelector('#btn-modal-ambos');
let btnConcluir = document.querySelector('#btn-concluir')

const modalOpcoes = document.querySelector('#modal-opcoes-container');
const modalRaioX = document.querySelector('#modal-raiox-container');
const modalProntuario = document.querySelector('#modal-prontuario-container');

const inputContainer = document.querySelector('.input-container');

const inputsFile = document.querySelectorAll('.input-container input, textarea');
const labels = document.querySelectorAll('[id^="label"]');
const nomeArquivo = document.querySelectorAll('.valor-input');

const progresso = document.querySelector('#progresso');
const estiloValorProgresso = window.getComputedStyle(progresso);
const estiloBarraProgresso = window.getComputedStyle(progresso.parentElement);
const larguraBarraProgresso = estiloBarraProgresso.getPropertyValue('width');
const tituloProgresso = document.querySelector('#valor-progresso span');

const valoresInputModalAmbos = [];
const valoresInput = [];
let indiceAtual = 0;

// Acompanha em qual etapa do fluxo "Ambos" estamos
let ambosCurrentStage = "";

// Variável para armazenar o tipo de modal atual
let tipoModalAtual = null;

// Objeto para controle de fluxo do modal "Ambos"
const fluxoAmbos = {
    etapaAtual: "",
    dadosRaioX: [],
    dadosRessonancia: [],
    dadosProntuario: "",
    limpar() {
        this.etapaAtual = "";
        this.dadosRaioX = [];
        this.dadosRessonancia = [];
        this.dadosProntuario = "";
    }
};

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
    // Limpar o console para um novo fluxo
    modalOpcoes.style.display = 'block'
})

btnFecharModal.addEventListener('click', () => {
    console.log('fechar');
    fecharModal();
})

btnIniciarModalRaioX.addEventListener('click', (e) => {
    // Limpar o console para um novo fluxo
    atualizarTituloModal(e.target.textContent);
    tipoModalAtual = tipoModal.RaioX;
    ambosCurrentStage = "";
    fluxoAmbos.limpar();
    iniciarModalBasico(tipoModalAtual);
})

btnIniciarModalRessoncia.addEventListener('click', (e) => {
    // Limpar o console para um novo fluxo
    atualizarTituloModal(e.target.textContent);
    tipoModalAtual = tipoModal.Ressonancia;
    ambosCurrentStage = "";
    fluxoAmbos.limpar();
    iniciarModalBasico(tipoModalAtual);
})

btnIniciarModalAmbos.addEventListener('click', () => {
    // Limpar o console para um novo fluxo
    atualizarTituloModal('Raio-X');
    tipoModalAtual = tipoModal.Ambos;
    ambosCurrentStage = "RaioX";
    fluxoAmbos.etapaAtual = "RaioX";
    fluxoAmbos.limpar();
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

function limparTodosOsEstados() {
    // Resetar componentes visuais
    resetarComponentesModal();

    // Resetar estado do fluxo
    ambosCurrentStage = "";
    tipoModalAtual = null;
    fluxoAmbos.limpar();

    // Limpar arrays de valores
    valoresInput.length = 0;
    valoresInputModalAmbos.length = 0;

    // Resetar índice
    indiceAtual = 0;

    // Remover todos os event listeners
    removerEventos();
    limparEventosModalProntuario();
}

function fecharModal() {
    // Ocultar todos os modais
    modalOpcoes.style.display = 'none';
    modalRaioX.style.display = 'none';
    modalProntuario.style.display = 'none';

    // Limpar todos os estados
    limparTodosOsEstados();
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

    // Reset display state
    modalRaioX.style.display = 'none';
    modalProntuario.style.display = 'block';
    nomeArquivo.style.visibility = 'visible';

    // Limpar completamente os event listeners existentes
    limparEventosModalProntuario();

    // Adicionar o handler para mudança de arquivo
    const prontuarioHandler = () => {
        nomeArquivo.innerText = formatarNomeAequivo(inputProntuario.value) || 'Nenhum arquivo selecionado';
    };
    inputProntuario.addEventListener('change', prontuarioHandler);

    // Criar um novo handler para o botão concluir
    const concluirHandler = () => {
        // Remove o event listener para evitar múltiplas chamadas
        btnConcluir.removeEventListener('click', concluirHandler);

        // Adiciona o valor do prontuário e registra o tipo de exame
        if (modal === tipoModal.Ambos) {
            valoresInputModalAmbos.push(inputProntuario.value);
            fluxoAmbos.dadosProntuario = inputProntuario.value;

            const [img_pd_cima_raiox, img_pd_lateral_raiox, img_pe_cima_raiox, img_pe_lateral_raiox, img_ambos_raiox] = valoresInputModalAmbos.slice(0, 5);
            const raiox = new ExameBasico(null, img_pd_cima_raiox, img_pd_lateral_raiox, img_pe_cima_raiox, img_pe_lateral_raiox, img_ambos_raiox, null);

            const [img_pd_cima_ressonancia, img_pd_lateral_ressonancia, img_pe_cima_ressonancia, img_pe_lateral_ressonancia, img_ambos_ressonancia] = valoresInputModalAmbos.slice(5, 10);
            const ressonancia = new ExameBasico(null, img_pd_cima_ressonancia, img_pd_lateral_ressonancia, img_pe_cima_ressonancia, img_pe_lateral_ressonancia, img_ambos_ressonancia, null);

            const exameCompleto = new ExameCompleto(raiox, ressonancia, valoresInputModalAmbos[valoresInputModalAmbos.length - 1]);

            console.log(exameCompleto);

            console.log(`tipo de exame enviado: ${modal} (Ambos - RaioX e Ressonância)`);
        } else {
            console.log(inputProntuario.value)

            const [img_pd_cima, img_pd_lateral, img_pe_cima, img_pe_lateral, img_ambos] = valoresInput;

            const exameBasico = new ExameBasico(modal, img_pd_cima, img_pd_lateral, img_pe_cima, img_pe_lateral, img_ambos, inputProntuario.value);

            console.log(exameBasico);
        }

        console.log('Aguardando o envio dos arquivos...');

        // Ocultar o modal antes de limpar os estados
        modalProntuario.style.display = 'none';

        // Limpar todos os estados antes de iniciar um novo fluxo
        limparTodosOsEstados();
    };

    // Criar um novo handler para o botão cancelar
    const cancelarHandler = () => {
        // Imediatamente remover o event listener para evitar múltiplas chamadas
        btnCancelar.removeEventListener('click', cancelarHandler);


        modalProntuario.style.display = 'none';
        limparTodosOsEstados();
    };

    // Adicionar os novos handlers
    btnConcluir.addEventListener('click', concluirHandler);
    btnCancelar.addEventListener('click', cancelarHandler);
}

if (btnCancelar) {
    // Remover listener antigo
    if (regredirHandler) {
        btnCancelar.removeEventListener('click', regredirHandler);
    }

    btnCancelar.addEventListener('click', () => {
        // Limpa logs anteriores antes de imprimir o atual


        modalProntuario.style.display = 'none';
        fecharModal();
    });
}

function limparEventosModalProntuario() {
    const inputProntuario = document.querySelector('#input-prontuario');

    // Clonar e substituir os elementos para remover TODOS os event listeners
    if (btnConcluir) {
        const novoBtnConcluir = btnConcluir.cloneNode(true);
        btnConcluir.parentNode.replaceChild(novoBtnConcluir, btnConcluir);
        btnConcluir = novoBtnConcluir;
    }

    if (btnCancelar) {
        const novoBtnCancelar = btnCancelar.cloneNode(true);
        btnCancelar.parentNode.replaceChild(novoBtnCancelar, btnCancelar);
        btnCancelar = novoBtnCancelar;
    }

    if (inputProntuario) {
        const novoInputProntuario = inputProntuario.cloneNode(true);
        inputProntuario.parentNode.replaceChild(novoInputProntuario, inputProntuario);
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
                // Salva os dados do RaioX no objeto de fluxo
                fluxoAmbos.dadosRaioX = [...valoresInput];

                // Transição para a segunda etapa (Ressonancia)
                console.log("Transicionando de RaioX para Ressonancia no fluxo Ambos");
                ambosCurrentStage = "Ressonancia";
                fluxoAmbos.etapaAtual = "Ressonancia";
                atualizarTituloModal('Ressonância');

                // Armazena valores atuais e reseta para o próximo fluxo
                valoresInputModalAmbos.push(...valoresInput);
                valoresInput.length = 0;

                // Reinicia o componente para o próximo estágio
                resetarComponentesModal();
                mostrarInputAtual();
                atualizarLabels();
            } else {
                // Ambas as etapas concluídas, mostrar prontuário
                fluxoAmbos.dadosRessonancia = [...valoresInput];
                valoresInputModalAmbos.push(...valoresInput);
                mostrarMenssagemSucesso();
                iniciarModalProntuario(modalTipo);
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
}