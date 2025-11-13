// =================================================================
// CRUD.JS - Operações CRUD (Create, Read, Update, Delete)
// =================================================================

/**
 * Handler para conclusão de contrato
 */
async function handleConcluirContrato(checkboxElement, contratoId) {
    const row = checkboxElement.closest('tr');
    const statusDesejado = checkboxElement.checked;

    if (!statusDesejado) {
        alert("Não é possível reabrir um contrato por esta interface.");
        checkboxElement.checked = true;
        return;
    }

    if (!confirm(`Tem certeza que deseja CONCLUIR o contrato ID ${contratoId}? Esta ação irá liberar o carro.`)) {
        checkboxElement.checked = false;
        return;
    }

    try {
        const response = await fetch(`/api/contratos/${contratoId}/concluir`, {
            method: 'PATCH'
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status} ao tentar concluir o contrato.`);
        }

        const data = await response.json(); 
        checkboxElement.disabled = true; 
        
        if (row) {
            row.style.backgroundColor = '#f0f0f0'; // Destaca a linha como inativa
            
            // Atualiza a célula de Status visualmente
            const statusCell = row.querySelector('td:nth-child(7)'); 
            
            if (statusCell) {
                statusCell.textContent = data.statusContrato; // Ex: "CONCLUIDO"
                
                // Remove cores de alerta (vermelho/amarelo/verde) e aplica cinza
                statusCell.removeAttribute('style'); 
                statusCell.style.color = '#6c757d'; 
                statusCell.style.fontWeight = 'normal';
            }
        }
        
        // Atualiza os contadores do dashboard
        loadDashboardData();

    } catch (error) {
        console.error('Falha ao concluir contrato:', error);
        alert('ERRO: Não foi possível concluir o contrato.\n' + error.message);
        checkboxElement.checked = false;
    }
}

/**
 * Handler de submit para Carro
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
        } catch (e) {}
    }

    const carro = {
        idCarro: isUpdate ? parseInt(carroId, 10) : null, 
        nome: document.getElementById('carro-nome').value,
        placa: document.getElementById('carro-placa').value,
        anoFabricacao: parseInt(document.getElementById('carro-ano').value, 10),
        cor: document.getElementById('carro-cor').value,
        quilometragem: parseFloat(document.getElementById('carro-km').value),
        status: currentStatus 
    };
    
    const method = isUpdate ? 'PUT' : 'POST';
    const endpoint = isUpdate ? `/detalhesCarros/${carroId}` : '/detalhesCarros/add';

    try {
        const response = await fetch(endpoint, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(carro)
        });

        if (!response.ok) {
            const errorText = await response.text();
            let msg = `Erro no servidor`;
            try { const json = JSON.parse(errorText); msg = json.message || msg; } catch(e){}
            throw new Error(msg);
        }

        alert('Sucesso!');
        hideForm('carros-view');
        changeView('carros-view'); 

    } catch (error) {
        errorEl.textContent = error.message;
        errorEl.classList.remove('hidden');
    }
};

/**
 * Handler de submit para Cliente
 */
window.handleClienteSubmit = async (event) => {
    event.preventDefault();
    const errorEl = document.getElementById('cliente-form-error');
    errorEl.classList.add('hidden');

    const pessoaId = document.getElementById('cliente-pessoa-id').value;

    const pessoa = {
        id: pessoaId,
        nome: getVal('cliente-nome'),
        CPF: getVal('cliente-cpf'),
        email: getVal('cliente-email'),
        data_nasc: getVal('cliente-data-nasc'),
        telefone1: getVal('cliente-telefone1'),
        telefone2: getVal('cliente-telefone2'),
        cep: getVal('cliente-cep'),
        uf: getVal('cliente-uf'),
        endereco: getVal('cliente-endereco'),
        municipio: getVal('cliente-municipio'),
        complemento: getVal('cliente-complemento')
    };

    try {
        const response = await fetch(`/detalhesPessoa/update/${pessoaId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pessoa)
        });

        if (!response.ok) throw new Error('Erro ao atualizar cliente');
        alert('Sucesso!');
        hideForm('clientes-view');
        changeView('clientes-view'); 

    } catch (error) {
        errorEl.textContent = error.message;
        errorEl.classList.remove('hidden');
    }
};

/**
 * Handler de submit para Funcionário
 */
window.handleFuncionarioSubmit = async (event) => {
    event.preventDefault();
    const errorEl = document.getElementById('funcionario-form-error');
    errorEl.classList.add('hidden');

    const funcionarioId = document.getElementById('funcionario-id').value;
    const pessoaId = document.getElementById('funcionario-pessoa-id').value;

    const pessoa = {
        id: pessoaId,
        nome: getVal('funcionario-nome'),
        CPF: getVal('funcionario-cpf'),
        email: getVal('funcionario-email'),
        data_nasc: getVal('funcionario-data-nasc'),
        telefone1: getVal('funcionario-telefone1'),
        telefone2: getVal('funcionario-telefone2'),
        cep: getVal('funcionario-cep'),
        uf: getVal('funcionario-uf'),
        endereco: getVal('funcionario-endereco'),
        municipio: getVal('funcionario-municipio'),
        complemento: getVal('funcionario-complemento')
    };

    const dto = {
        pessoa: pessoa,
        cargo: getVal('funcionario-cargo'),
        salario: parseFloat(getVal('funcionario-salario')),
        data_admissao: getVal('funcionario-dataAdmissao')
    };

    try {
        const response = await fetch(`/detalhesfuncionario/${funcionarioId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dto)
        });

        if (!response.ok) throw new Error('Erro ao atualizar funcionário');
        alert('Sucesso!');
        hideForm('funcionarios-view');
        changeView('funcionarios-view'); 

    } catch (error) {
        errorEl.textContent = error.message;
        errorEl.classList.remove('hidden');
    }
};

/**
 * Handler de submit para Contrato
 */
window.handleContratoSubmit = async (event) => {
    event.preventDefault();
    const errorEl = document.getElementById('contrato-form-error');
    errorEl.classList.add('hidden');
    
    const contratoDTO = {
        dataInicio: getVal('contrato-data-inicio'),
        dataFim: getVal('contrato-data-fim'),
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
            const text = await response.text();
            let msg = 'Erro ao criar contrato';
            try { const json = JSON.parse(text); msg = json.message || msg; } catch(e){}
            throw new Error(msg);
        }

        alert('Contrato criado com sucesso!');
        hideForm('contratos-view');
        changeView('contratos-view');
        loadDashboardData(); 

    } catch (error) {
        errorEl.textContent = error.message;
        errorEl.classList.remove('hidden');
    }
};

/**
 * Confirmação e exclusão de entidade
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
    } 
    else if (entityName === 'funcionario') { 
        endpoint = `/detalhesfuncionario/${entityId}`;
        viewToReload = 'funcionarios-view';
    } 
    else if (entityName === 'cliente') {
        endpoint = `/detalhescliente/${entityId}`;
        viewToReload = 'clientes-view';
    } 
    else {
        alert(`Ainda não sei deletar: ${entityName}`);
        return;
    }

    try {
        const response = await fetch(endpoint, {
            method: 'DELETE'
        });

        if (response.ok) { 
            alert(`${entityName} ID ${entityId} removido com sucesso.`);
            if (viewToReload) {
                changeView(viewToReload); 
            }
        } else {
            let errorMsg = `Erro ${response.status}`;
            try { const json = await response.json(); errorMsg = json.message || errorMsg; } catch(e){}
            
            // Tratamento específico de erros comuns
            if (response.status === 400) errorMsg = "O item possui vínculos (contratos ativos) e não pode ser excluído.";
            
            alert(`ERRO: ${errorMsg}`);
        }

    } catch (error) {
        console.error(`Falha ao deletar ${entityName}:`, error);
        alert(`ERRO: ${error.message}`);
    }
};
