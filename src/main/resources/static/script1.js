let currentUserRole = null;
let graficoFrota = null;

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
            row.style.backgroundColor = '#f0f0f0';
            const statusCell = row.querySelector('td:nth-child(7)');
            if (statusCell) {
                statusCell.textContent = data.statusContrato;
            }
        }
        
        loadDashboardData();

    } catch (error) {
        console.error('Falha ao concluir contrato:', error);
        alert('ERRO: Não foi possível concluir o contrato.\n' + error.message);
        checkboxElement.checked = false;
    }
}


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


async function loadDashboardData() {
    const kpiClientesCard = document.getElementById('kpi-clientes-card');
    if (currentUserRole === 'CLIENTE') {
        if (kpiClientesCard) {
            kpiClientesCard.style.display = 'none';
        }
    } else {
        if (kpiClientesCard) {
            kpiClientesCard.style.display = 'flex'; 
        }
    }
    
    try {
        const response = await fetch('/api/dashboard/resumo');
        if (!response.ok) throw new Error('Falha ao buscar resumo.');
        const data = await response.json();
        
        document.getElementById('kpi-carros-disponiveis').innerText = data.carrosDisponiveis;
        document.getElementById('kpi-carros-alugados').innerText = data.carrosAlugados;
        document.getElementById('kpi-contratos-ativos').innerText = data.contratosAtivos; 
        
        if (currentUserRole !== 'CLIENTE') {
            document.getElementById('kpi-clientes').innerText = data.clientesCadastrados;
        }

        renderDashboardCharts(data);
        
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        document.getElementById('kpi-carros-disponiveis').innerText = 'Erro';
        document.getElementById('kpi-carros-alugados').innerText = 'Erro';
        document.getElementById('kpi-contratos-ativos').innerText = 'Erro';
        if (currentUserRole !== 'CLIENTE') {
            document.getElementById('kpi-clientes').innerText = 'Erro';
        }
    }
}

function renderDashboardCharts(data) {
    const ctx = document.getElementById('graficoFrota').getContext('2d');
    if (graficoFrota) {
        graficoFrota.destroy();
    }
    graficoFrota = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Disponíveis', 'Alugados'],
            datasets: [{
                label: 'Status da Frota',
                data: [data.carrosDisponiveis, data.carrosAlugados],
                backgroundColor: ['rgba(0, 123, 255, 0.7)', 'rgba(108, 117, 125, 0.7)'],
                borderColor: ['rgba(0, 123, 255, 1)', 'rgba(108, 117, 125, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } }
        }
    });
}

async function renderContratosView() {
    const showNewButton = (currentUserRole === 'GERENTE' || currentUserRole === 'FUNCIONARIO');

    const view = document.getElementById('contratos-view');
    view.innerHTML = `
        <div class="crud-header">
            <h3>Gerenciar Contratos</h3>
            ${showNewButton ? `
            <button class="btn primary" onclick="showForm('contratos-view', 'create')">
                <i class="fas fa-plus"></i> Novo Contrato
            </button>` : ''}
        </div>
        
        <div class="card">
            <h4>Contratos em Andamento</h4>
            <table class="data-table">
                <thead>
                    ${getTableHeader('Contrato')}
                </thead>
                <tbody>
                    <tr><td colspan="8" style="text-align:center;">Carregando seus contratos...</td></tr>
                </tbody>
            </table>
        </div>
    `;

    const tableBody = document.querySelector('#contratos-view .data-table tbody');
    if (!tableBody) return;

    try {
        const response = await fetch('/api/contratos'); 
        if (!response.ok) {
             tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: red;">Erro no servidor ao buscar contratos (${response.status})</td></tr>`;
             return;
        }
        const contratos = await response.json();
        tableBody.innerHTML = getTableRows('contrato', contratos);
    } catch (error) {
        console.error('Falha ao buscar contratos:', error);
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: red;">Falha de rede ao tentar carregar contratos.</td></tr>`;
    }
}

async function renderDataView(viewId, entityName, endpoint, filterParamName = null) {
    const view = document.getElementById(viewId);
    const showNewButton = (currentUserRole === 'GERENTE' || currentUserRole === 'FUNCIONARIO');
    
    let searchBarHtml = '';
    if (filterParamName) {
        let placeholder = `Buscar por ${filterParamName}...`;
        if (filterParamName === 'cpf') placeholder = 'Buscar por CPF... (ex: 111)';
        if (filterParamName === 'placa') placeholder = 'Buscar por Placa... (ex: ABC)';
        if (filterParamName === 'nome') placeholder = 'Buscar por Nome/Modelo...';
        
        searchBarHtml = `
            <div class="search-area">
                <input type="text" id="${viewId}-search-input" placeholder="${placeholder}">
                <button class="btn primary" id="${viewId}-search-button">Buscar</button>
            </div>
        `;
    }

    view.innerHTML = `
        <div class="crud-header">
            <h3>Gerenciar ${entityName}s</h3>
            ${(showNewButton && entityName !== 'Cliente' && entityName !== 'Funcionário') ? `
            <button class="btn primary" onclick="showForm('${viewId}', 'create')">
                <i class="fas fa-plus"></i> Novo ${entityName}
            </button>` : ''}
        </div>
        
        ${searchBarHtml} 
        
        <div class="card">
            <h4>Lista de ${entityName}s</h4>
            <table class="data-table" id="${viewId}-table">
                <thead>
                    ${getTableHeader(entityName)}
                </thead>
                <tbody>
                    <tr><td colspan="8" style="text-align:center;">Carregando dados...</td></tr>
                </tbody>
            </table>
        </div>
    `;

    if (filterParamName) {
        document.getElementById(`${viewId}-search-button`).addEventListener('click', () => {
            const searchTerm = document.getElementById(`${viewId}-search-input`).value;
            fetchDataAndRenderTable(viewId, endpoint, filterParamName, searchTerm);
        });
        
        document.getElementById(`${viewId}-search-input`).addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                document.getElementById(`${viewId}-search-button`).click();
            }
        });
    }

    fetchDataAndRenderTable(viewId, endpoint, null, null);
}

async function fetchDataAndRenderTable(viewId, endpoint, filterParamName, searchTerm) {
    const tableBody = document.querySelector(`#${viewId} .data-table tbody`);
    if (!tableBody) return;
    tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Buscando...</td></tr>';

    let url = endpoint;
    if (filterParamName && searchTerm) {
        url += `?${filterParamName}=${encodeURIComponent(searchTerm)}`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorMsg = response.status === 404 
                ? `API não encontrada (${url}).`
                : `Erro no servidor (${response.status})`;
            tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: red;">${errorMsg}</td></tr>`;
            return;
        }
        
        const data = await response.json();
        tableBody.innerHTML = getTableRows(viewId.replace('-view', ''), data);
    } catch (error) {
        console.error(`Falha ao buscar ${viewId}:`, error);
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: red;">Falha de rede ao buscar ${url}.</td></tr>`;
    }
}


function getTableHeader(entityName) {
    if (entityName === 'Cliente') {
        return `<tr><th>ID</th><th>Nome</th><th>CPF</th><th>Telefone</th><th>Email</th><th>Ações</th></tr>`;
    } else if (entityName === 'Funcionário') {
        return `<tr><th>ID</th><th>Nome</th><th>Cargo</th><th>Admissão</th><th>Salário</th><th>Ações</th></tr>`;
    } else if (entityName === 'Carro') {
         if (currentUserRole === 'CLIENTE') {
             return `<tr><th>ID</th><th>Modelo</th><th>Ano</th><th>Cor</th><th>KM</th><th>Status</th><th>Ações</th></tr>`;
         }
         return `<tr><th>ID</th><th>Modelo</th><th>Placa</th><th>Ano</th><th>Cor</th><th>KM</th><th>Status</th><th>Ações</th></tr>`;
    } else if (entityName === 'Contrato') {
         if (currentUserRole === 'CLIENTE') {
             return `<tr><th>ID Contrato</th><th>Carro</th><th>Início</th><th>Fim Prev.</th><th>Valor Total</th><th>Status</th><th>Ações</th></tr>`;
         }
         return `<tr><th>ID Contrato</th><th>Cliente</th><th>Carro</th><th>Início</th><th>Fim Prev.</th><th>Valor Total</th><th>Status</th><th>Ações</th></tr>`;
    }
    return '';
}

function getTableRows(entityName, data) {
    entityName = entityName.replace('s-view', '').replace('s', '');

    if (!data || data.length === 0) return `<tr><td colspan="8" style="text-align:center;">Nenhum registro encontrado.</td></tr>`;
    
    let html = '';
    
    data.forEach(item => {
        let cells = '';
        let actions = ''; 

        let entityId = item.id || item.id_cliente || item.idFuncionarios || item.idCarro || item.idContrato;
        
        actions = ''; 
        
        // Botão VISUALIZAR e EDITAR para Funcionários
        if (entityName === 'cliente' || entityName === 'funcionario' || entityName === 'carro') {
            const idParaAcao = entityName === 'cliente' ? item.id_cliente : entityId;
            actions += `<button class="btn small view-details" onclick="showForm('${entityName}s-view', 'view', ${idParaAcao})"><i class="fas fa-eye"></i></button>`;
        }
        
        if (currentUserRole === 'GERENTE' || currentUserRole === 'FUNCIONARIO') {
            if (entityName !== 'contrato') {
                 const idParaAcao = entityName === 'cliente' ? item.id_cliente : entityId;
                 actions += `<button class="btn small edit" onclick="showForm('${entityName}s-view', 'edit', ${idParaAcao})"><i class="fas fa-edit"></i></button>`;
            }
        }
        
        if (currentUserRole === 'GERENTE') {
            if (entityName !== 'contrato') {
                const idParaAcao = entityName === 'cliente' ? item.id_cliente : entityId;
                if (actions) actions += ' '; 
                let deleteName = entityName === 'funcionário' ? 'funcionario' : entityName;
                actions += `<button class="btn small delete" onclick="confirmDelete(${idParaAcao}, '${deleteName}')"><i class="fas fa-trash"></i></button>`;
            }
        }

        if (actions === '') {
            if (entityName === 'carro' && currentUserRole === 'CLIENTE') {
                const statusTxt = item.status ? 'Disponível' : 'Alugado';
                const statusClass = item.status ? 'available' : 'rented';
                actions = `<span class="status-badge ${statusClass}">${statusTxt}</span>`;
            } else {
                actions = `<span style="color: var(--secondary-color);"><i>Visualização</i></span>`;
            }
        }
        
        if (entityName === 'cliente') {
            cells = `<td>${item.id_cliente}</td>
                     <td>${item.pessoa?.nome || 'N/D'}</td>
                     <td>${item.pessoa?.CPF || 'N/D'}</td>
                     <td>${item.pessoa?.telefone1 || 'N/D'}</td>
                     <td>${item.pessoa?.email || 'N/D'}</td>`;
        
        } else if (entityName === 'funcionario') {
            const salario = item.salario || 0;
            const salarioFormatado = salario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            const admissao = item.dataAdmissao ? new Date(item.dataAdmissao).toLocaleDateString('pt-BR') : 'N/D';
            
            cells = `<td>${item.idFuncionarios}</td><td>${item.pessoa?.nome || 'N/D'}</td><td>${item.cargo}</td><td>${admissao}</td><td>${salarioFormatado}</td>`;
        
        } else if (entityName === 'carro') {
            const statusTxt = item.status ? 'Disponível' : 'Alugado';
            const statusColor = item.status ? 'var(--success-color)' : 'var(--danger-color)';
            const statusStyle = `style="color: ${statusColor}; font-weight: bold;"`;
            
            if (currentUserRole === 'CLIENTE') {
                cells = `
                    <td>${item.idCarro}</td>
                    <td>${item.nome}</td>
                    <td>${item.anoFabricacao}</td>
                    <td>${item.cor}</td>
                    <td>${item.quilometragem}</td>
                    <td ${statusStyle}>${statusTxt}</td>`;
            } else {
                cells = `
                    <td>${item.idCarro}</td>
                    <td>${item.nome}</td>
                    <td>${item.placa}</td>
                    <td>${item.anoFabricacao}</td>
                    <td>${item.cor}</td>
                    <td>${item.quilometragem}</td>
                    <td ${statusStyle}>${statusTxt}</td>`;
            }
        
        } else if (entityName === 'contrato') {
             const valor = item.valorTotal || 0;
             const valorFormatado = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
             const dtInicio = item.dataInicio ? new Date(item.dataInicio).toLocaleDateString('pt-BR') : 'N/D';
             
             let rowStyle = '';
             const statusTxt = item.statusContrato || 'ATIVO';
             const dtFim = item.dataFim ? new Date(item.dataFim).toLocaleDateString('pt-BR') : 'N/D';
             
             if (currentUserRole === 'GERENTE' || currentUserRole === 'FUNCIONARIO') {
                 const isChecked = (statusTxt === 'CONCLUIDO');
                 if (isChecked) {
                     rowStyle = 'style="background-color: #f0f0f0;"'; 
                     actions = `<input type="checkbox" checked disabled>`;
                 } else {
                     actions = `<input type="checkbox" onchange="handleConcluirContrato(this, ${item.idContrato})">`;
                 }
             } else {
                 actions = `<span style="color: var(--secondary-color);"><i>Visualização</i></span>`;
             }
             
             if (currentUserRole === 'CLIENTE') {
                 cells = `<td>${item.idContrato}</td><td>${item.carroNome || 'N/D'}</td><td>${dtInicio}</td><td>${dtFim}</td><td>${valorFormatado}</td><td>${statusTxt}</td>`;
             } else {
                 cells = `<td>${item.idContrato}</td><td>${item.clienteNome || 'N/D'}</td><td>${item.carroNome || 'N/D'}</td><td>${dtInicio}</td><td>${dtFim}</td><td>${valorFormatado}</td><td>${statusTxt}</td>`;
             }
             
             html += `<tr ${rowStyle}>${cells}<td>${actions}</td></tr>`;
             return; 
        }
        
        html += `<tr>${cells}<td>${actions}</td></tr>`;
    });
    return html;
}

document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.form-overlay').forEach(el => el.classList.add('hidden'));

    async function setupDynamicMenu() {
        try {
            const response = await fetch('/api/credenciais/perfil'); 
            if (!response.ok) throw new Error('Não autenticado');
            const roles = await response.json();
            const role = roles[0];
            currentUserRole = role; 

            const navSectionMgmt = document.getElementById('nav-section-management');
            const navClientes = document.getElementById('nav-clientes');
            const navFuncionarios = document.getElementById('nav-funcionarios');
            const navCarros = document.getElementById('nav-carros');
            const navContratos = document.getElementById('nav-contratos');
            const userInfoName = document.getElementById('user-info-name');

            if (navSectionMgmt) navSectionMgmt.style.display = 'none';
            if (navClientes) navClientes.style.display = 'none';
            if (navFuncionarios) navFuncionarios.style.display = 'none';
            if (navCarros) navCarros.style.display = 'none';
            if (navContratos) navContratos.style.display = 'none';
            if (userInfoName) userInfoName.textContent = role;

            if (role === 'CLIENTE') {
                navSectionMgmt.style.display = 'block';
                navCarros.style.display = 'flex';
                navContratos.style.display = 'flex';
            } 
            else if (role === 'FUNCIONARIO') {
                navSectionMgmt.style.display = 'block';
                navCarros.style.display = 'flex';
                navClientes.style.display = 'flex';
                navContratos.style.display = 'flex';
            } 
            else if (role === 'GERENTE') {
                navSectionMgmt.style.display = 'block';
                navClientes.style.display = 'flex';
                navFuncionarios.style.display = 'flex';
                navCarros.style.display = 'flex';
                navContratos.style.display = 'flex';
            }
            loadDashboardData();
        } catch (error) {
            console.error('Falha ao configurar menu dinâmico:', error);
            window.location.href = '/login.html';
        }
    }

    setupDynamicMenu();

    const navItems = document.querySelectorAll('.nav-item');
    
    window.changeView = (targetId) => {
        navItems.forEach(i => i.classList.remove('active'));
        const activeItem = document.querySelector(`.nav-item[data-target="${targetId}"]`);
        if (activeItem) activeItem.classList.add('active');

        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        const targetView = document.getElementById(targetId);
        if (targetView) {
            targetView.classList.add('active');
        }

        if (targetId === 'home-view') {
            loadDashboardData(); 
        } 
        else if (targetId === 'clientes-view') {
            renderDataView('clientes-view', 'Cliente', '/detalhescliente/listar', 'cpf');
        }
        else if (targetId === 'funcionarios-view') {
            renderDataView('funcionarios-view', 'Funcionário', '/detalhesfuncionario/listar', null);
        }
        else if (targetId === 'carros-view') {
            const filterParam = (currentUserRole === 'CLIENTE') ? 'nome' : 'placa';
            renderDataView('carros-view', 'Carro', '/detalhesCarros/listar', filterParam);
        }
        else if (targetId === 'contratos-view') {
            renderContratosView(); 
        } 
    };

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            changeView(item.getAttribute('data-target'));
        });
    });
    
    window.showForm = async (viewId, mode, entityId = null) => {
        const entityKey = viewId.replace('-view', '');
        const formContainer = document.getElementById(`${entityKey}-form-container`);
        if (!formContainer) {
             console.error(`Container do formulário ${viewId} não encontrado.`);
             return;
        }
        
        const formTitleSpan = document.getElementById(`${entityKey}-form-title`);
        const form = document.getElementById(`${entityKey}-form`);
        const errorEl = document.getElementById(`${entityKey}-form-error`);
        const formInputs = form.querySelectorAll('input, select');
        
        const submitButton = form.querySelector('button[type="submit"]');
        const cancelButton = form.querySelector('button.btn.secondary'); 
        
        if (errorEl) errorEl.classList.add('hidden');
        form.reset(); 

        if (mode === 'create') {
            formTitleSpan.textContent = 'Cadastrar';
            if (submitButton) submitButton.style.display = 'inline-flex'; 
            formInputs.forEach(input => input.removeAttribute('disabled'));
            cancelButton.textContent = 'Cancelar'; 
            if (entityKey === 'contratos') loadContratoFormData();
            formContainer.classList.remove('hidden');
            
        } else if (mode === 'edit' || mode === 'view') {
            
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
            else if (entityKey === 'funcionarios') { 
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
            else if (entityKey === 'carros') { 
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
        }
    };

    window.hideForm = (viewId) => {
        const entityKey = viewId.replace('-view', '');
        const formContainer = document.getElementById(`${entityKey}-form-container`);
        if (formContainer) formContainer.classList.add('hidden');
    };

    async function loadContratoFormData() {
        const clienteSelect = document.getElementById('contrato-select-cliente');
        const carroSelect = document.getElementById('contrato-select-carro');
        
        document.getElementById('contrato-valor-total').value = '0,00';
        document.getElementById('contrato-data-inicio').value = '';
        document.getElementById('contrato-data-fim').value = '';

        try {
            clienteSelect.innerHTML = '<option value="">Carregando...</option>';
            carroSelect.innerHTML = '<option value="">Carregando...</option>';
            
            const clienteResponse = await fetch('/detalhescliente/listar');
            const clientes = await clienteResponse.json();
            clienteSelect.innerHTML = '<option value="">Selecione um cliente...</option>';
            clientes.forEach(cliente => {
                const option = document.createElement('option');
                option.value = cliente.id_cliente; 
                option.textContent = `${cliente.pessoa.nome} (CPF: ${cliente.pessoa.CPF})`;
                clienteSelect.appendChild(option);
            });

            const carroResponse = await fetch('/detalhesCarros/listar');
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

    // Handlers de Submit
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
            if (!response.ok) throw new Error('Erro ao salvar carro');
            alert('Sucesso!');
            hideForm('carros-view');
            changeView('carros-view'); 
        } catch (error) {
            errorEl.textContent = error.message;
            errorEl.classList.remove('hidden');
        }
    };

    window.handleClienteSubmit = async (event) => {
        event.preventDefault();
        const errorEl = document.getElementById('cliente-form-error');
        errorEl.classList.add('hidden');
        const pessoaId = document.getElementById('cliente-pessoa-id').value;
        const getVal = (id) => document.getElementById(id).value || null;

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

    window.handleFuncionarioSubmit = async (event) => {
        event.preventDefault();
        const errorEl = document.getElementById('funcionario-form-error');
        errorEl.classList.add('hidden');
        const funcionarioId = document.getElementById('funcionario-id').value;
        const pessoaId = document.getElementById('funcionario-pessoa-id').value;
        const getVal = (id) => document.getElementById(id).value || null;

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
    
    window.handleContratoSubmit = async (event) => {
        event.preventDefault();
        const errorEl = document.getElementById('contrato-form-error');
        errorEl.classList.add('hidden');
        const getVal = (id) => document.getElementById(id).value || null;
        
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
                throw new Error(text.includes('disponível') ? 'Carro indisponível' : 'Erro ao criar contrato');
            }
            alert('Sucesso!');
            hideForm('contratos-view');
            changeView('contratos-view');
            loadDashboardData(); 
        } catch (error) {
            errorEl.textContent = error.message;
            errorEl.classList.remove('hidden');
        }
    };

    window.confirmDelete = async (entityId, entityName) => {
        if (!confirm(`Confirmar exclusão?`)) return;

        let endpoint = '';
        let viewToReload = '';

        if (entityName === 'carro') {
            endpoint = `/detalhesCarros/${entityId}`;
            viewToReload = 'carros-view';
        } else if (entityName === 'funcionario') { 
            endpoint = `/detalhesfuncionario/${entityId}`;
            viewToReload = 'funcionarios-view';
        } else {
            return;
        }

        try {
            const response = await fetch(endpoint, { method: 'DELETE' });
            if (response.ok) { 
                alert('Removido com sucesso.');
                changeView(viewToReload); 
            } else {
                alert('Não foi possível remover (verifique vínculos).');
            }
        } catch (error) {
            console.error(error);
        }
    };
    
    window.logout = () => {
        if (confirm("Sair do sistema?")) window.location.href = '/logout'; 
    };
});