// =================================================================
// FORMS.JS - Handlers e Gerenciamento de Formulários
// =================================================================

/**
 * Exibe o formulário com modo create, edit ou view
 */
window.showForm = async (viewId, mode, entityId = null) => {
    const entityKey = viewId.replace('-view', '');
    const formContainer = document.getElementById(`${entityKey}-form-container`);
    if (!formContainer) return;
    
    const formTitleSpan = document.getElementById(`${entityKey}-form-title`);
    const form = document.getElementById(`${entityKey}-form`);
    const errorEl = document.getElementById(`${entityKey}-form-error`);
    const formInputs = form.querySelectorAll('input, select');
    const submitButton = form.querySelector('button[type="submit"]');
    const cancelButton = form.querySelector('button.btn.secondary'); 
    
    if (errorEl) errorEl.classList.add('hidden');
    form.reset(); 

    // MODO: CRIAR
    if (mode === 'create') {
        formTitleSpan.textContent = 'Cadastrar';
        if (submitButton) submitButton.style.display = 'inline-flex'; 
        formInputs.forEach(input => input.removeAttribute('disabled'));
        cancelButton.textContent = 'Cancelar'; 
        
        if (entityKey === 'contratos') {
            loadContratoFormData();
        }
        formContainer.classList.remove('hidden');
        
    } 
    // MODO: EDITAR ou VISUALIZAR
    else if (mode === 'edit' || mode === 'view') {
        
        if (mode === 'edit') {
             formTitleSpan.textContent = 'Editar';
             if (submitButton) submitButton.style.display = 'inline-flex'; 
             formInputs.forEach(input => input.removeAttribute('disabled'));
             cancelButton.textContent = 'Cancelar';
         } else { 
             formTitleSpan.textContent = 'Visualizar (Somente Leitura)';
             if (submitButton) submitButton.style.display = 'none'; 
             formInputs.forEach(input => input.setAttribute('disabled', 'true')); 
             cancelButton.textContent = 'Fechar'; 
         }
        
        // --- PREENCHIMENTO DOS CAMPOS ---
        
        if (entityKey === 'clientes') {
            await loadClienteForm(entityId, formContainer);
        } 
        else if (entityKey === 'funcionarios') { 
            await loadFuncionarioForm(entityId, formContainer);
        } 
        else if (entityKey === 'carros') { 
            await loadCarroForm(entityId, formContainer);
        }
    }
};

/**
 * Carrega dados do cliente no formulário
 */
async function loadClienteForm(entityId, formContainer) {
    try {
        const response = await fetch(`/detalhescliente/${entityId}`);
        if (!response.ok) throw new Error('Cliente não encontrado.');
        const cliente = await response.json();
        
        document.getElementById('cliente-id').value = cliente.id_cliente;
        document.getElementById('cliente-pessoa-id').value = cliente.pessoa.id;
        document.getElementById('cliente-nome').value = cliente.pessoa.nome;
        document.getElementById('cliente-cpf').value = cliente.pessoa.CPF; 
        document.getElementById('cliente-email').value = cliente.pessoa.email;
        if (cliente.pessoa.data_nasc) document.getElementById('cliente-data-nasc').value = new Date(cliente.pessoa.data_nasc).toISOString().split('T')[0];
        document.getElementById('cliente-telefone1').value = cliente.pessoa.telefone1;
        document.getElementById('cliente-telefone2').value = cliente.pessoa.telefone2;
        document.getElementById('cliente-cep').value = cliente.pessoa.cep;
        document.getElementById('cliente-uf').value = cliente.pessoa.uf;
        document.getElementById('cliente-endereco').value = cliente.pessoa.endereco;
        document.getElementById('cliente-municipio').value = cliente.pessoa.municipio;
        document.getElementById('cliente-complemento').value = cliente.pessoa.complemento;

        formContainer.classList.remove('hidden');
    } catch (err) {
        alert(`Erro: ${err.message}`);
    }
}

/**
 * Carrega dados do funcionário no formulário
 */
async function loadFuncionarioForm(entityId, formContainer) {
    try {
        const response = await fetch(`/detalhesfuncionario/${entityId}`);
        if (!response.ok) throw new Error('Funcionário não encontrado.');
        const func = await response.json();
        
        document.getElementById('funcionario-id').value = func.idFuncionarios;
        if (func.dataAdmissao) document.getElementById('funcionario-dataAdmissao').value = new Date(func.dataAdmissao).toISOString().split('T')[0];
        document.getElementById('funcionario-cargo').value = func.cargo;
        document.getElementById('funcionario-salario').value = func.salario;
        document.getElementById('funcionario-pessoa-id').value = func.pessoa.id;
        document.getElementById('funcionario-nome').value = func.pessoa.nome;
        document.getElementById('funcionario-cpf').value = func.pessoa.CPF; 
        document.getElementById('funcionario-email').value = func.pessoa.email;
        if (func.pessoa.data_nasc) document.getElementById('funcionario-data-nasc').value = new Date(func.pessoa.data_nasc).toISOString().split('T')[0];
        document.getElementById('funcionario-telefone1').value = func.pessoa.telefone1;
        document.getElementById('funcionario-telefone2').value = func.pessoa.telefone2;
        document.getElementById('funcionario-cep').value = func.pessoa.cep;
        document.getElementById('funcionario-uf').value = func.pessoa.uf;
        document.getElementById('funcionario-endereco').value = func.pessoa.endereco;
        document.getElementById('funcionario-municipio').value = func.pessoa.municipio;
        document.getElementById('funcionario-complemento').value = func.pessoa.complemento;

        formContainer.classList.remove('hidden');
    } catch (err) {
        alert(`Erro: ${err.message}`);
    }
}

/**
 * Carrega dados do carro no formulário
 */
async function loadCarroForm(entityId, formContainer) {
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
        alert(`Erro: ${err.message}`);
    }
}

/**
 * Oculta o formulário
 */
window.hideForm = (viewId) => {
    const entityKey = viewId.replace('-view', '');
    const formContainer = document.getElementById(`${entityKey}-form-container`);
    if (formContainer) formContainer.classList.add('hidden');
};

/**
 * Carrega dados iniciais do formulário de contrato
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
        console.error('Erro ao carregar dados:', error);
    }
}
