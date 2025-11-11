// =================================================================
// ARQUIVO NOVO: LÓGICA DE FORMULÁRIOS E EVENTOS
// =================================================================

/**
 * Lógica de cálculo de valor do contrato
 */
window.calcularValorLocacao = () => {
    const inicioStr = document.getElementById('contrato-data-inicio').value;
    const fimStr = document.getElementById('contrato-data-fim').value;
    const valorInput = document.getElementById('contrato-valor-total');
    const taxaDiaria = 150.00;

    if (!inicioStr || !fimStr) {
        valorInput.value = '0,00';
        return;
    }

    try {
        const dataInicio = new Date(inicioStr);
        const dataFim = new Date(fimStr);
        
        dataInicio.setHours(0, 0, 0, 0);
        dataFim.setHours(0, 0, 0, 0);

        if (dataFim < dataInicio) {
            valorInput.value = 'Data Fim Inválida';
            return;
        }

        const diffTime = Math.abs(dataFim.getTime() - dataInicio.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 

        const valorTotal = diffDays * taxaDiaria;
        
        valorInput.value = valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    } catch (e) {
        valorInput.value = 'Erro de Cálculo';
    }
};

/**
 * Lógica para mostrar/esconder modais de formulário
 */
window.showForm = async (viewId, mode, entityId = null) => {
    const entityKey = viewId.replace('-view', '');
    const formContainer = document.getElementById(`${entityKey}-form-container`);
    if (!formContainer) {
         if (viewId === 'gerentes-view') return;
         console.error(`Container do formulário ${viewId} não encontrado.`);
         return;
    }
    
    const formTitleSpan = document.getElementById(`${entityKey}-form-title`);
    const form = document.getElementById(`${entityKey}-form`);
    const errorEl = document.getElementById(`${entityKey}-form-error`);
    
    if (errorEl) errorEl.classList.add('hidden');
    form.reset(); 

    if (mode === 'create') {
        formTitleSpan.textContent = 'Cadastrar';
        if (entityKey === 'contratos') {
            loadContratoFormData();
        }
        formContainer.classList.remove('hidden');
        
    } else if (mode === 'edit') {
        formTitleSpan.textContent = 'Editar';
        
        if (entityKey === 'clientes') {
            try {
                const response = await fetch(`/detalhescliente/${entityId}`);
                if (!response.ok) throw new Error('Cliente não encontrado.');
                const cliente = await response.json();
                
                document.getElementById('cliente-id').value = cliente.id_cliente;
                document.getElementById('cliente-pessoa-id').value = cliente.pessoa.id;
                document.getElementById('cliente-nome').value = cliente.pessoa.nome;
                document.getElementById('cliente-cpf').value = cliente.pessoa.CPF; 
                document.getElementById('cliente-email').value = cliente.pessoa.email;
                
                if (cliente.pessoa.data_nasc) {
                    document.getElementById('cliente-data-nasc').value = new Date(cliente.pessoa.data_nasc).toISOString().split('T')[0];
                }
                
                document.getElementById('cliente-telefone1').value = cliente.pessoa.telefone1;
                document.getElementById('cliente-telefone2').value = cliente.pessoa.telefone2;
                document.getElementById('cliente-cep').value = cliente.pessoa.cep;
                document.getElementById('cliente-uf').value = cliente.pessoa.uf;
                document.getElementById('cliente-endereco').value = cliente.pessoa.endereco;
                document.getElementById('cliente-municipio').value = cliente.pessoa.municipio;
                document.getElementById('cliente-complemento').value = cliente.pessoa.complemento;

                formContainer.classList.remove('hidden');
                
            } catch (err) {
                alert(`Erro ao carregar dados do cliente: ${err.message}`);
            }
        } else if (entityKey === 'carros') { 
            try {
                const response = await fetch(`/detalhesCarros/${entityId}`);
                if (!response.ok) throw new Error('Carro não encontrado.');
                const carro = await response.json();
                
                document.getElementById('carro-id').value = carro.idCarro; 
                document.getElementById('carro-nome').value = carro.nome;
                document.getElementById('carro-placa').value = carro.placa;
                document.getElementById('carro-ano').value = carro.anoFabricacao;
                document.getElementById('carro-cor').value = carro.cor;
                document.getElementById('carro-km').value = carro.quilometragem;
                
                formContainer.classList.remove('hidden');
                
            } catch (err) {
                alert(`Erro ao carregar dados do carro: ${err.message}`);
            }
        } else {
            console.log(`Simulando carregamento de dados para edição de ID: ${entityId}`);
            formContainer.classList.remove('hidden');
        }
    }
};

window.hideForm = (viewId) => {
    const formContainer = document.getElementById(`${viewId.replace('-view', '')}-form-container`);
    if (formContainer) {
         formContainer.classList.add('hidden');
    }
};

/**
 * Carrega dados (clientes/carros) para o formulário de contrato
 */
async function loadContratoFormData() {
    const clienteSelect = document.getElementById('contrato-select-cliente');
    const carroSelect = document.getElementById('contrato-select-carro');
    const errorEl = document.getElementById('contrato-form-error');
    
    document.getElementById('contrato-valor-total').value = '0,00';
    document.getElementById('contrato-data-inicio').value = '';
    document.getElementById('contrato-data-fim').value = '';

    try {
        clienteSelect.innerHTML = '<option value="">Carregando clientes...</option>';
        carroSelect.innerHTML = '<option value="">Carregando carros...</option>';
        
        const clienteResponse = await fetch('/detalhescliente/listar');
        if (!clienteResponse.ok) throw new Error('Falha ao buscar clientes.');
        const clientes = await clienteResponse.json();
        
        clienteSelect.innerHTML = '<option value="">Selecione um cliente...</option>';
        
        clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.id_cliente; 
            option.textContent = `${cliente.pessoa.nome} (CPF: ${cliente.pessoa.CPF})`;
            clienteSelect.appendChild(option);
        });


        const carroResponse = await fetch('/detalhesCarros/listar');
        if (!carroResponse.ok) throw new Error('Falha ao buscar carros.');
        const carros = await carroResponse.json();
        
        carroSelect.innerHTML = '<option value="">Selecione um carro...</option>';
        carros.forEach(carro => {
            if (carro.status === true) { 
                const option = document.createElement('option');
                option.value = carro.idCarro;
                option.textContent = `${carro.nome} (Placa: ${carro.placa})`;
                carroSelect.appendChild(option);
            }
        });

    } catch (error) {
        console.error('Falha ao carregar dados do formulário de contrato:', error);
        errorEl.textContent = 'Erro ao carregar dados. ' + error.message;
        errorEl.classList.remove('hidden');
    }
}

/**
 * Submit do formulário de Carro (Criar/Editar)
 */
window.handleCarroSubmit = async (event) => {
    event.preventDefault();
    const errorEl = document.getElementById('carro-form-error');
    errorEl.classList.add('hidden');

    const carroId = document.getElementById('carro-id').value; 
    const isUpdate = !!carroId; 

    let currentStatus = true;
    if (isUpdate) {
        try {
            const response = await fetch(`/detalhesCarros/${carroId}`);
            if (response.ok) {
                const existingCarro = await response.json();
                currentStatus = existingCarro.status; 
            }
        } catch (error) {
            console.warn('Falha ao buscar status atual do carro. Assumindo true.', error);
        }
    }

    const carro = {
        idCarro: isUpdate ? parseInt(carroId, 10) : null, 
        nome: document.getElementById('carro-nome').value,
        placa: document.getElementById('carro-placa').value,
        anoFabricacao: parseInt(document.getElementById('carro-ano').value, 10),
        cor: document.getElementById('carro-cor').value,
        quilometragem: parseFloat(document.getElementById('carro-km').value),
        status: currentStatus 
        // O 'ativo' é controlado pelo backend (salvar/deletar)
    };
    
    const method = isUpdate ? 'PUT' : 'POST';
    const endpoint = isUpdate ? `/detalhesCarros/${carroId}` : '/detalhesCarros/add';
    const successMessage = isUpdate ? 'Carro atualizado com sucesso!' : 'Carro cadastrado com sucesso!';

    try {
        const response = await fetch(endpoint, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(carro)
        });

        if (!response.ok) {
            const errorText = await response.text();
            let msg = `Erro no servidor (${response.status})`;
            try {
                const errorData = JSON.parse(errorText);
                msg = errorData.message || errorData.error || msg;
            } catch (e) {
                const statusMatch = errorText.match(/\[(.*?)\]/);
                if (statusMatch && statusMatch[1]) {
                    msg = statusMatch[1];
                } else if (errorText.trim()) {
                    msg = errorText.trim();
                }
            }
            throw new Error(msg);
        }

        alert(successMessage);
        hideForm('carros-view');
        changeView('carros-view'); 

    } catch (error) {
        console.error(`Falha ao ${isUpdate ? 'atualizar' : 'cadastrar'} carro:`, error);
        errorEl.textContent = `${error.message}`;
        errorEl.classList.remove('hidden');
    }
};

/**
 * Submit do formulário de Cliente (Editar)
 */
window.handleClienteSubmit = async (event) => {
    event.preventDefault();
    const errorEl = document.getElementById('cliente-form-error');
    errorEl.classList.add('hidden');

    const pessoaId = document.getElementById('cliente-pessoa-id').value;
    
    const getLocalDate = (id) => {
        const val = document.getElementById(id).value;
        return val ? val : null;
    };

    const pessoa = {
        id: pessoaId,
        nome: document.getElementById('cliente-nome').value,
        CPF: document.getElementById('cliente-cpf').value,
        email: document.getElementById('cliente-email').value,
        data_nasc: getLocalDate('cliente-data-nasc'),
        telefone1: document.getElementById('cliente-telefone1').value,
        telefone2: document.getElementById('cliente-telefone2').value,
        cep: document.getElementById('cliente-cep').value,
        uf: document.getElementById('cliente-uf').value,
        endereco: document.getElementById('cliente-endereco').value,
        municipio: document.getElementById('cliente-municipio').value,
        complemento: document.getElementById('cliente-complemento').value
    };

    try {
        const response = await fetch(`/detalhesPessoa/update/${pessoaId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pessoa)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro no servidor (${response.status})`);
        }

        alert('Cliente atualizado com sucesso!');
        hideForm('clientes-view');
        changeView('clientes-view'); 

    } catch (error) {
        console.error('Falha ao atualizar cliente:', error);
        errorEl.textContent = `❌ ${error.message}`;
        errorEl.classList.remove('hidden');
    }
};

/**
 * Submit do formulário de Contrato (Criar)
 */
window.handleContratoSubmit = async (event) => {
    event.preventDefault();
    const errorEl = document.getElementById('contrato-form-error');
    errorEl.classList.add('hidden');
    
    const getLocalDate = (id) => {
        const val = document.getElementById(id).value;
        return val ? val : null;
    };
    
    const contratoDTO = {
        dataInicio: getLocalDate('contrato-data-inicio'),
        dataFim: getLocalDate('contrato-data-fim'),
        idClienteUsuario: parseInt(document.getElementById('contrato-select-cliente').value, 10),
        idCarro: parseInt(document.getElementById('contrato-select-carro').value, 10)
    };
    
    try {
        const response = await fetch('/api/contratos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contratoDTO)
        });

        if (!response.ok) {
            const errorText = await response.text();
            try {
                const errorData = JSON.parse(errorText);
                let msg = errorData.message || errorData.error || `Erro no servidor (${response.status})`;
                if (errorData.message && errorData.message.includes("O carro selecionado não está disponível")) {
                    msg = "O carro selecionado não está disponível para locação.";
                }
                throw new Error(msg);
            } catch(e) {
                throw new Error(errorText || `Erro no servidor (${response.status})`);
            }
        }

        alert('Contrato criado com sucesso!');
        hideForm('contratos-view');
        changeView('contratos-view');
        loadDashboardData(); 

    } catch (error) {
        console.error('Falha ao criar contrato:', error);
        errorEl.textContent = `❌ ${error.message}`;
        errorEl.classList.remove('hidden');
    }
};

/**
 * Lógica de "Deletar" (Exclusão Lógica)
 */
window.confirmDelete = async (entityId, entityName) => {
    if (!confirm(`Tem certeza que deseja remover o(a) ${entityName} ID ${entityId}?`)) {
        return;
    }

    let endpoint = '';
    let viewToReload = '';

    if (entityName === 'carro') {
        endpoint = `/detalhesCarros/${entityId}`;
        viewToReload = 'carros-view';
    } else {
        alert(`Ainda não sei deletar: ${entityName}`);
        return;
    }

    try {
        const response = await fetch(endpoint, {
            method: 'DELETE'
        });

        if (response.ok) { // Sucesso (204 No Content)
            alert(`${entityName} ID ${entityId} removido (inativado) com sucesso.`);
            if (viewToReload) {
                changeView(viewToReload); // Recarrega a view
            }
        } else {
            // Trata os erros do backend (400 = Alugado, 404 = Não encontrado)
            let errorMsg = `Erro ${response.status} ao deletar.`;
            
            try {
                // Tenta ler a mensagem de erro específica do backend
                const errorText = await response.text();
                // O Spring Boot geralmente envia um JSON de erro
                const errorData = JSON.parse(errorText);
                errorMsg = errorData.message || errorData.error || errorMsg;

            } catch(e) {
                 // Fallback se a resposta não for JSON
                 if (response.status === 400) {
                    errorMsg = "Este carro está alugado ou vinculado a contratos e não pode ser excluído.";
                } else if (response.status === 404) {
                    errorMsg = "Carro não encontrado.";
                }
            }
            
            throw new Error(errorMsg);
        }

    } catch (error) {
        console.error(`Falha ao deletar ${entityName}:`, error);
        alert(`ERRO: ${error.message}`);
    }
};