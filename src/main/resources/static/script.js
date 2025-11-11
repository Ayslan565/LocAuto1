const mockData = {
    acessos: {
        'S': 'Select (Buscar dados)', 'I': 'Insert (Criar dados)', 'U': 'Update (Atualiza dados)', 'D': 'Delete (Deleta dados)',
        'CLIENTE': 'S Carro, S Contrato', 
        'FUNCIONARIO': 'S/I/U Pessoa, S/I/U Cliente, S/I/U Contrato, S Carro', 
        'GERENTE': 'S/I/U/D Funcionário, S/I/U/D Pessoa, S/I/U/D Cliente, S/I/U/D Contrato, S/I/U/D Carro, S/I/U/D Acessos' 
    },
};

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
            ${(showNewButton && entityName !== 'Cliente' && entityName !== 'Funcionário' && entityName !== 'Pessoa') ? `
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
    if (entityName === 'Pessoa') {
        return `<tr><th>ID</th><th>Nome</th><th>CPF</th><th>Email</th><th>Ações</th></tr>`;
    } else if (entityName === 'Cliente') {
        return `<tr><th>ID</th><th>Nome</th><th>CPF</th><th>Telefone</th><th>Email</th><th>Ações</th></tr>`;
    } else if (entityName === 'Funcionário') {
        return `<tr><th>ID</th><th>Nome</th><th>Cargo</th><th>Admissão</th><th>Salário</th><th>Ações</th></tr>`;
    } else if (entityName === 'Carro') {
         return `<tr><th>ID</th><th>Modelo</th><th>Placa</th><th>Ano</th><th>Cor</th><th>KM</th><th>Status</th><th>Ações</th></tr>`;
    } else if (entityName === 'Contrato') {
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
        
        // NOVO: Adiciona o botão de visualização (Olhinho)
        if (entityName === 'cliente' || entityName === 'pessoa' || entityName === 'funcionario' || entityName === 'carro') {
            const idParaAcao = entityName === 'cliente' ? item.id_cliente : entityId;
            actions += `<button class="btn small view-details" onclick="showForm('${entityName}s-view', 'view', ${idParaAcao})"><i class="fas fa-eye"></i></button>`;
        }
        
        if (currentUserRole === 'GERENTE' || currentUserRole === 'FUNCIONARIO') {
            if (entityName !== 'contrato') {
                 const idParaAcao = entityName === 'cliente' ? item.id_cliente : entityId;
                 // Adiciona o botão de edição APÓS o de visualização
                 actions += `<button class="btn small edit" onclick="showForm('${entityName}s-view', 'edit', ${idParaAcao})"><i class="fas fa-edit"></i></button>`;
            }
        }
        
        if (currentUserRole === 'GERENTE') {
            if (entityName !== 'contrato') {
                const idParaAcao = entityName === 'cliente' ? item.id_cliente : entityId;
                if (actions) actions += ' '; 
                actions += `<button class="btn small delete" onclick="confirmDelete(${idParaAcao}, '${entityName}')"><i class="fas fa-trash"></i></button>`;
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
        
        if (entityName === 'pessoa') {
            cells = `<td>${item.id}</td><td>${item.nome}</td><td>${item.cpf}</td><td>${item.email || 'N/D'}</td>`;
        
        } else if (entityName === 'cliente') {
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
            
            cells = `
                <td>${item.idCarro}</td>
                <td>${item.nome}</td>
                <td>${item.placa}</td>
                <td>${item.anoFabricacao}</td>
                <td>${item.cor}</td>
                <td>${item.quilometragem}</td>
                <td ${statusStyle}>${statusTxt}</td>`;
        
        } else if (entityName === 'contrato') {
             const valor = item.valorTotal || 0;
             const valorFormatado = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
             const dtInicio = item.dataInicio ? new Date(item.dataInicio).toLocaleDateString('pt-BR') : 'N/D';

             let rowStyle = '';
             let dataFimObj = null;

             const today = new Date();
             today.setHours(0, 0, 0, 0);
             
             const statusTxt = item.statusContrato || 'ATIVO';

             if (item.dataFim) {
                 dataFimObj = new Date(item.dataFim);
                 dataFimObj.setHours(0, 0, 0, 0); 

                 if (dataFimObj.getTime() < today.getTime()) {
                     rowStyle = 'style="background-color: #f8d7da;"'; 
                 } 
                 else if (dataFimObj.getTime() === today.getTime()) {
                     rowStyle = 'style="background-color: #fff3cd;"'; 
                 }
             }
             
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
             
             cells = `
                <td>${item.idContrato}</td>
                <td>${item.clienteNome || 'N/D'}</td>
                <td>${item.carroNome || 'N/D'}</td>
                <td>${dtInicio}</td>
                <td>${dtFim}</td>
                <td>${valorFormatado}</td>
                <td>${statusTxt}</td>
             `;
             
             html += `<tr ${rowStyle}>${cells}<td>${actions}</td></tr>`;
             
             return; 
        }
        
        html += `<tr>${cells}<td>${actions}</td></tr>`;
    });
    return html;
}

// =================================================================
// LÓGICA DE NAVEGAÇÃO, INICIALIZAÇÃO E FORMULÁRIOS
// =================================================================

document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.form-overlay').forEach(el => el.classList.add('hidden'));

    async function setupDynamicMenu() {
        try {
            const response = await fetch('/api/credenciais/perfil'); 
            if (!response.ok) throw new Error('Não autenticado');
            const roles = await response.json();
            if (roles.length === 0) throw new Error('Perfil não encontrado');

            const role = roles[0];
            currentUserRole = role; 

            const navSectionMgmt = document.getElementById('nav-section-management');
            // const navPessoas = document.getElementById('nav-pessoas'); // REMOVIDO
            const navClientes = document.getElementById('nav-clientes');
            const navFuncionarios = document.getElementById('nav-funcionarios');
            // const navGerentes = document.getElementById('nav-gerentes'); // REMOVIDO
            const navCarros = document.getElementById('nav-carros');
            const navContratos = document.getElementById('nav-contratos');
            // const navAcessos = document.getElementById('nav-acessos'); // REMOVIDO
            const userInfoName = document.getElementById('user-info-name');

            if (navSectionMgmt) navSectionMgmt.style.display = 'none';
            // if (navPessoas) navPessoas.style.display = 'none'; // REMOVIDO
            if (navClientes) navClientes.style.display = 'none';
            if (navFuncionarios) navFuncionarios.style.display = 'none';
            // if (navGerentes) navGerentes.style.display = 'none'; // REMOVIDO
            if (navCarros) navCarros.style.display = 'none';
            if (navContratos) navContratos.style.display = 'none';
            // if (navAcessos) navAcessos.style.display = 'none'; // REMOVIDO
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
                // navPessoas.style.display = 'flex'; // REMOVIDO
                navClientes.style.display = 'flex';
                navFuncionarios.style.display = 'flex';
                // navGerentes.style.display = 'flex'; // REMOVIDO
                navCarros.style.display = 'flex';
                navContratos.style.display = 'flex';
                // navAcessos.style.display = 'flex'; // REMOVIDO
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
        // else if (targetId === 'pessoas-view') { ... } // REMOVIDO
        else if (targetId === 'clientes-view') {
            renderDataView('clientes-view', 'Cliente', '/detalhescliente/listar', 'cpf');
        }
        else if (targetId === 'funcionarios-view') {
            renderDataView('funcionarios-view', 'Funcionário', '/detalhesfuncionario/listar', null);
        }
        else if (targetId === 'carros-view') {
            renderDataView('carros-view', 'Carro', '/detalhesCarros/listar', 'placa');
        }
        else if (targetId === 'contratos-view') {
            renderContratosView(); 
        } 
        // else if (targetId === 'acessos-view') { ... } // REMOVIDO
    };

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            changeView(item.getAttribute('data-target'));
        });
    });
    
    // window.renderAcessosView = () => { ... } // FUNÇÃO REMOVIDA

    window.showForm = async (viewId, mode, entityId = null) => {
        const entityKey = viewId.replace('-view', '');
        const formContainer = document.getElementById(`${entityKey}-form-container`);
        if (!formContainer) {
             // if (viewId === 'gerentes-view') return; // REMOVIDO
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

        // 1. Definição do Modo e Título
        if (mode === 'create') {
            formTitleSpan.textContent = 'Cadastrar';
            // submitButton.classList.remove('hidden'); // ANTIGO
            if (submitButton) submitButton.style.display = 'inline-flex'; // CORRIGIDO
            formInputs.forEach(input => input.removeAttribute('disabled'));
            
            cancelButton.textContent = 'Cancelar'; 
            
            if (entityKey === 'contratos') {
                loadContratoFormData();
            }
            formContainer.classList.remove('hidden');
            
        } else if (mode === 'edit' || mode === 'view') {
            
            // 2. Título e botões
            if (mode === 'edit') {
                 formTitleSpan.textContent = 'Editar';
                 // submitButton.classList.remove('hidden'); // ANTIGO
                 if (submitButton) submitButton.style.display = 'inline-flex'; // CORRIGIDO
                 formInputs.forEach(input => input.removeAttribute('disabled'));
                 cancelButton.textContent = 'Cancelar';
             } else { // mode === 'view'
                 formTitleSpan.textContent = 'Visualizar (Somente Leitura)';
                 // submitButton.classList.add('hidden'); // ANTIGO
                 if (submitButton) submitButton.style.display = 'none'; // CORRIGIDO
                 formInputs.forEach(input => input.setAttribute('disabled', 'true')); 
                 cancelButton.textContent = 'Fechar'; // Renomeado para Fechar
             }
            
            // 3. Carregamento dos dados
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
                    if(mode === 'view') formInputs.forEach(input => input.setAttribute('disabled', 'true'));
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
                    if(mode === 'view') formInputs.forEach(input => input.setAttribute('disabled', 'true'));
                }
            } else {
                console.log(`Simulando carregamento de dados para edição de ID: ${entityId}`);
                formContainer.classList.remove('hidden');
            }
        }
    };

    window.hideForm = (viewId) => {
        const entityKey = viewId.replace('-view', '');
        const formContainer = document.getElementById(`${entityKey}-form-container`);
        if (formContainer) {
             formContainer.classList.add('hidden');
        }
    };

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

    document.querySelectorAll('.crud-form:not(#clientes-form):not(#contratos-form)').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formContainerId = form.parentNode.parentNode.id;
            const viewId = formContainerId.replace('-form-container', '-view');
            const entityKey = form.dataset.entity;
            
            alert(`Simulação de Criação/Edição de ${entityKey}:\n(API de POST/PUT real precisa ser implementada aqui)`);
            
            hideForm(viewId);
            changeView(viewId); 
        });
    });

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

            if (response.ok) { 
                alert(`${entityName} ID ${entityId} removido (inativado) com sucesso.`);
                if (viewToReload) {
                    changeView(viewToReload); 
                }
            } else {
                let errorMsg = `Erro ${response.status} ao deletar.`;
                
                try {
                    const errorText = await response.text();
                    const errorData = JSON.parse(errorText);
                    errorMsg = errorData.message || errorData.error || errorMsg;

                } catch(e) {
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
    
    window.logout = () => {
        if (confirm("Deseja realmente sair do sistema?")) {
             window.location.href = '/logout'; 
        }
    };
});