const btnIniciar = document.querySelector('#main-btn');
const btnCancelar = document.querySelector('#btn-cancelar');
const btnAvancar = document.querySelector('#btn-avancar');
const btnFecharModal = document.querySelector('.btn-fechar');
const btnIniciarModalRaioX = document.querySelector('#btn-modal-raiox')

const modalOpcoes = document.querySelector('#modal-opcoes-container');
const modalRaioX = document.querySelector('#modal-raiox-container');

const inputsFile = document.querySelectorAll('.input-container input[type="file"]');
const labels = document.querySelectorAll('[id^="label"]')
const nomeArquivo = document.querySelectorAll('.valor-input')

const progresso = document.querySelector('#progresso')
const estiloValorProgresso = window.getComputedStyle(progresso)
const larguraValorProgresso = estiloValorProgresso.getPropertyValue('width')
const estiloBarraProgresso = window.getComputedStyle(progresso.parentElement)
const larguraBarraProgresso = estiloBarraProgresso.getPropertyValue('width')
const tituloProgresso = document.querySelector('#valor-progresso span')

const msgSucesso = document.querySelector('#mensagem-sucesso')

const valoresInput = []
let indiceAtual = 0;
let progressoAtualizado = false;

btnIniciar.addEventListener('click', () => {
    modalOpcoes.style.display = 'block'
})

btnFecharModal.addEventListener('click', () => {
    console.log('fechar')
    fecharModal()
}) 

btnIniciarModalRaioX.addEventListener('click', () => {
    iniciarModal()
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
    
    // Calcular a porcentagem baseada no índice atual (20% por etapa)
    const porcentagem = Math.min(100, (indiceAtual + 1) * 20);
    const larguraProgresso = (valorLaguraBarraProgresso * porcentagem) / 100;
    
    progresso.style.width = `${larguraProgresso}px`;
    tituloProgresso.textContent = `${porcentagem}`;
}

function diminuirBarraProgresso() {
    const valorLaguraBarraProgresso = parseFloat(larguraBarraProgresso.replace('px', ''));
    
    // Calcular a porcentagem baseada no índice atual (20% por etapa)
    const porcentagem = Math.max(0, indiceAtual * 20);
    const larguraProgresso = (valorLaguraBarraProgresso * porcentagem) / 100;
    
    progresso.style.width = `${larguraProgresso}px`;
    tituloProgresso.textContent = `${porcentagem}`;
}

// Função para esconder todos os inputs, custom inputs e nomes de arquivo
function ocultarTodosOsInputs() {
    inputsFile.forEach((input, index) => {
        input.style.visibility = 'hidden';
        
        // Ocultar o nome do arquivo correspondente
        if (nomeArquivo[index]) {
            nomeArquivo[index].style.visibility = 'hidden';
        }
        
        // Ocultar o custom input correspondente
        const customInput = input.nextElementSibling;
        if (customInput) {
            customInput.style.visibility = 'hidden';
        }
    });
}

// Função para mostrar apenas o input do índice atual
function mostrarInputAtual() {
    // Verificar se o índice é válido
    if (indiceAtual >= 0 && indiceAtual < inputsFile.length) {
        inputsFile[indiceAtual].style.visibility = 'visible';
        
        // Mostrar o nome do arquivo correspondente
        if (nomeArquivo[indiceAtual]) {
            nomeArquivo[indiceAtual].style.visibility = 'visible';
        }
        
        // Mostrar o custom input correspondente
        const customInput = inputsFile[indiceAtual].nextElementSibling;
        if (customInput) {
            customInput.style.visibility = 'visible';
        }
    }
}

// Função para atualizar a aparência dos labels
function atualizarLabels() {
    labels.forEach((label, index) => {
        if (index === indiceAtual) {
            label.style.color = '#0360D9'; // Destaca o label atual
        } else {
            label.style.color = '#2E2E2E'; // Cor padrão para os outros labels
        }
    });
}

function resetarComponentesModal() {
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
    
    nomeArquivo.forEach(titulo => {
        titulo.style.visibility = 'hidden';
        titulo.textContent = 'Nenhum arquivo selecionado'
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
    indiceAtual = 0; // Reseta o índice atual
    valoresInput.length = 0; // Limpa o array de valores
    
    // Esconde a mensagem de sucesso
    if (msgSucesso) {
        msgSucesso.style.visibility = 'hidden';
    }
}

function iniciarModal() {
    modalRaioX.style.display = 'block';
    
    resetarComponentesModal(); // Reseta tudo primeiro
    
    indiceAtual = 0; // Inicia com o primeiro input
    
    // Oculta todos os inputs primeiro
    ocultarTodosOsInputs();
    
    // Mostra apenas o input atual
    mostrarInputAtual();
    
    // Atualiza os labels
    atualizarLabels();
    
    // Configura a ação do botão cancelar
    // No primeiro input, o botão Cancelar deve agir como Fechar
    if (btnCancelar) {
        btnCancelar.setAttribute('data-action', 'fechar');
    }

    // Configura os event listeners uma única vez
    if (!window.eventListenersSet) {
        percorrerElementos();
        window.eventListenersSet = true;
    }
}

function fecharModalInicial() {
    modalOpcoes.style.display = 'none';
}

function percorrerElementos() {
    // Configurar event listeners para os inputs
    inputsFile.forEach((input, index) => {
        input.addEventListener('change', (event) => {
            console.log(`Mudança no input ${index}: ${event.target.id}`);
            
            // Atualiza o texto do nome do arquivo
            const tituloInput = nomeArquivo[index];
            if (tituloInput) {
                const fileName = event.target.value.split('\\').pop();
                tituloInput.textContent = fileName || 'Nenhum arquivo selecionado';
            }
            
            // Atualiza o array de valores
            if (index >= valoresInput.length) {
                valoresInput.push(event.target.value);
            } else {
                valoresInput[index] = event.target.value;
            }

            atualizarBarraProgresso();
            
            // Atualiza o status do label
            atualizarStatusLabel(event.target.id.replace('img-', ''));
        });
    });

    // Event listener para o botão de avançar
    btnAvancar.addEventListener('click', (e) => {
        e.preventDefault(); // Previne comportamento padrão do botão
        
        // Verifica se há um arquivo selecionado
        if (!inputsFile[indiceAtual].value) {
            alert('Por favor, selecione um arquivo antes de avançar.');
            return;
        }
        
        console.log(`Avançando do índice ${indiceAtual} para ${indiceAtual + 1}`);
        
        // Avança para o próximo input se não for o último
        if (indiceAtual < inputsFile.length - 1) {
            // Oculta todos os inputs
            ocultarTodosOsInputs();
            
            // Incrementa o índice
            indiceAtual++;
            
            // Mostra apenas o input atual
            mostrarInputAtual();
            
            // Atualiza os labels
            atualizarLabels();
            
            // Atualiza o modo do botão Cancelar
            if (btnCancelar) {
                btnCancelar.setAttribute('data-action', 'voltar');
            }
            
            console.log(`Agora no índice ${indiceAtual}`);
        } else {
            console.log('Todos os inputs foram preenchidos:', valoresInput);
        }
    });

    // Event listener para o botão cancelar (agora funciona como voltar)
    btnCancelar.addEventListener('click', (e) => {
        e.preventDefault(); // Previne comportamento padrão do botão
        
        // Verifica a ação atual do botão
        const action = btnCancelar.getAttribute('data-action');
        
        if (action === 'fechar' || indiceAtual === 0) {
            // Se estiver no primeiro input ou a ação for fechar, fecha o modal
            fecharModal();
        } else {
            // Caso contrário, volta para o input anterior
            console.log(`Voltando do índice ${indiceAtual} para ${indiceAtual - 1}`);
            
            // Oculta todos os inputs
            ocultarTodosOsInputs();
            
            // Decrementa o índice
            indiceAtual--;
            
            // Mostra apenas o input atual
            mostrarInputAtual();
            
            // Atualiza os labels
            atualizarLabels();
            
            // Atualiza a barra de progresso
            diminuirBarraProgresso();
            
            // Se voltar ao primeiro input, muda a ação do botão para fechar
            if (indiceAtual === 0) {
                btnCancelar.setAttribute('data-action', 'fechar');
            }
            
            console.log(`Agora no índice ${indiceAtual}`);
        }
    });
}