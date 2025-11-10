/*
 * =============================================
 * SCRIPT.JS ATUALIZADO (COM FILTROS, CÁLCULO E PERMISSÕES)
 * =============================================
 */

const mockData = {
    acessos: {
        'S': 'Select (Buscar dados)', 'I': 'Insert (Criar dados)', 'U': 'Update (Atualiza dados)', 'D': 'Delete (Deleta dados)',
        'CLIENTE': 'S Carro, S Contrato', 'FUNCIONARIO': 'S/I/U Pessoa, S/I/U Cliente, S/I/U Contrato',
        'GERENTE': 'S/I/U/D Funcionário, S/I/U/D Pessoa, S/I/U/D Cliente, S/I/U/D Contrato, S/I/U/D Carro'
    },
};

let currentUserRole = null;
let graficoFrota = null;

// ==============================================================================
// FUNÇÕES GLOBAIS DE CÁLCULO
// ==============================================================================

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
        
        // Define a hora para evitar problemas de fuso horário que causam diferença de 1 dia
        dataInicio.setHours(0, 0, 0, 0);
        dataFim.setHours(0, 0, 0, 0);

        if (dataFim < dataInicio) {
            valorInput.value = 'Data Fim Inválida';
            return;
        }

        const diffTime = Math.abs(dataFim.getTime() - dataInicio.getTime());
        // Adiciona 1 dia (para contar o dia de retirada)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 

        const valorTotal = diffDays * taxaDiaria;
        
        valorInput.value = valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    } catch (e) {
        valorInput.value = 'Erro de Cálculo';
    }
};


// ==============================================================================
// FUNÇÕES DE BUSCA DE DADOS (FETCH)
// ==============================================================================

async function loadDashboardData() {
    try {
        const response = await fetch('/api/dashboard/resumo');
        if (!response.ok) throw new Error('Falha ao buscar resumo.');
        const data = await response.json();
        
        document.getElementById('kpi-carros-disponiveis').innerText = data.carrosDisponiveis;
        document.getElementById('kpi-carros-alugados').innerText = data.carrosAlugados;
        document.getElementById('kpi-contratos-ativos').innerText = data.contratosAtivos; 
        document.getElementById('kpi-clientes').innerText = data.clientesCadastrados;
        
        renderDashboardCharts(data);
        
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        document.getElementById('kpi-carros-disponiveis').innerText = 'Erro';
        document.getElementById('kpi-carros-alugados').innerText = 'Erro';
        document.getElementById('kpi-contratos-ativos').innerText = 'Erro';
        document.getElementById('kpi-clientes').innerText = 'Erro';
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
    const tableBody = document.querySelector('#contratos-view .data-table tbody');
    if (!tableBody) return;
    tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Carregando seus contratos...</td></tr>';
    try {
        const response = await fetch('/api/contratos'); 
        if (!response.ok) {
             tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: red;">Erro no servidor ao buscar contratos (${response.status})</td></tr>`;
             return;
        }
        const contratos = await response.json();
        tableBody.innerHTML = getTableRows('Contrato', contratos);
    } catch (error) {
        console.error('Falha ao buscar contratos:', error);
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: red;">Falha de rede ao tentar carregar contratos.</td></tr>`;
    }
}

/**
 * Renderiza a view E a barra de busca.
 */
async function renderDataView(viewId, entityName, endpoint, filterParamName = null) {
    const view = document.getElementById(viewId);
    const showNewButton = (currentUserRole === 'GERENTE' || currentUserRole === 'FUNCIONARIO');
    
    // 1. Adiciona o HTML da barra de busca SE um filterParamName foi fornecido
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

    // 2. Adiciona o Event Listener para o botão de busca (se ele existe)
    if (filterParamName) {
        document.getElementById(`${viewId}-search-button`).addEventListener('click', () => {
            const searchTerm = document.getElementById(`${viewId}-search-input`).value;
            // Chama a função de busca com o termo
            fetchDataAndRenderTable(viewId, endpoint, filterParamName, searchTerm);
        });
        
        // Opcional: Busca ao pressionar "Enter"
        document.getElementById(`${viewId}-search-input`).addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                document.getElementById(`${viewId}-search-button`).click();
            }
        });
    }

    // 3. Busca os dados (primeira carga, sem filtro)
    fetchDataAndRenderTable(viewId, endpoint, null, null);
}

/**
 * NOVO: Função separada para buscar os dados e popular a tabela.
 */
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
                : `Erro ao buscar dados (${response.status})`;
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


// ==============================================================================
// FUNÇÕES DE RENDERIZAÇÃO DE TABELA (HTML)
// ==============================================================================

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
                actions += `<button class="btn small delete" onclick="confirmDelete(${idParaAcao}, '${entityName}')"><i class="fas fa-trash"></i></button>`;
            }
        }

        if (actions === '') {
            if (entityName === 'carro' && currentUserRole === 'CLIENTE') {
                const statusTxt = item.status ? 'Disponível' : 'Alugado';
                const statusClass = item.status ? 'available' : 'rented';
                actions = `<span class="status-badge ${statusClass}">${statusTxt}</span>`;
            } else {
                actions = '<span style="color: var(--secondary-color);"><i>Visualização</i></span>';
            }
        }
        
        if (entityName === 'pessoa') {
            cells = `<td>${item.id}</td><td>${item.nome}</td><td>${item.CPF}</td><td>${item.email || 'N/D'}</td>`;
        
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
            
            cells = `
                <td>${item.idCarro}</td>
                <td>${item.nome}</td>
                <td>${item.placa}</td>
                <td>${item.anoFabricacao}</td>
                <td>${item.cor}</td>
                <td>${item.quilometragem}</td>
                <td>${statusTxt}</td>`;
        
        } else if (entityName === 'contrato') {
             const valor = item.valorTotal || 0;
             const valorFormatado = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
             const dtInicio = item.dataInicio ? new Date(item.dataInicio).toLocaleDateString('pt-BR') : 'N/D';
             const dtFim = item.dataFim ? new Date(item.dataFim).toLocaleDateString('pt-BR') : 'N/D';
             const statusTxt = item.statusContrato || 'ATIVO';
             
             if (currentUserRole === 'GERENTE' || currentUserRole === 'FUNCIONARIO') {
                 const isChecked = (statusTxt === 'CONCLUIDO'); 
                 actions = `<input type="checkbox" ${isChecked ? 'checked' : ''} disabled>`;
             } else {
                 actions = `<span style="color: var(--secondary-color);"><i>${statusTxt}</i></span>`;
             }
             
             cells = `
                <td>${item.idContrato}</td>
                <td>${item.usuarioCliente?.pessoa?.nome || 'N/D'}</td>
                <td>${item.carro?.nome || 'N/D'}</td>
                <td>${dtInicio}</td>
                <td>${dtFim}</td>
                <td>${valorTotal}</td>
                <td>${statusTxt}</td>
             `;
        }
        
        html += `<tr>${cells}<td>${actions}</td></tr>`;
    });
    return html;
}

// ==============================================================================
// INICIALIZAÇÃO E EVENT LISTENERS
// ==============================================================================

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
            const navPessoas = document.getElementById('nav-pessoas');
            const navClientes = document.getElementById('nav-clientes');
            const navFuncionarios = document.getElementById('nav-funcionarios');
            const navGerentes = document.getElementById('nav-gerentes'); 
            const navCarros = document.getElementById('nav-carros');
            const navContratos = document.getElementById('nav-contratos');
            const navAcessos = document.getElementById('nav-acessos');
            const userInfoName = document.getElementById('user-info-name');

            if (navSectionMgmt) navSectionMgmt.style.display = 'none';
            if (navPessoas) navPessoas.style.display = 'none';
            if (navClientes) navClientes.style.display = 'none';
            if (navFuncionarios) navFuncionarios.style.display = 'none';
            if (navGerentes) navGerentes.style.display = 'none'; 
            if (navCarros) navCarros.style.display = 'none';
            if (navContratos) navContratos.style.display = 'none';
            if (navAcessos) navAcessos.style.display = 'none';
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
                navPessoas.style.display = 'flex';
                navClientes.style.display = 'flex';
                navFuncionarios.style.display = 'flex';
                navGerentes.style.display = 'flex'; 
                navCarros.style.display = 'flex';
                navContratos.style.display = 'flex';
                navAcessos.style.display = 'flex';
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

        // ATUALIZADO: Passa os parâmetros de filtro (cpf e placa)
        if (targetId === 'home-view') {
            loadDashboardData(); 
        } 
        else if (targetId === 'pessoas-view') {
            renderDataView('pessoas-view', 'Pessoa', '/detalhesPessoa/listar', 'cpf');
        } 
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
        else if (targetId === 'acessos-view') {
            renderAcessosView();
        }
    };

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            changeView(item.getAttribute('data-target'));
        });
    });
    
    window.renderAcessosView = () => {
        const container = document.getElementById('acessos-container');
        if (!container) return;
        const accessData = mockData.acessos;
        let html = `
            <h4>Matriz de Acessos por Perfil (CRUD)</h4>
            <div class="access-table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Perfil</th>
                            <th>Entidades Acessadas e Permissões (S/I/U/D)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>CLIENTE</td><td>${accessData.CLIENTE}</td></tr>
                        <tr><td>FUNCIONARIO</td><td>${accessData.FUNCIONARIO}</td></tr>
                        <tr><td>GERENTE</td><td>${accessData.GERENTE}</td></tr>
                    </tbody>
                </table>
            </div>
            
            <h4 style="margin-top: 30px; border-bottom: none;">Legenda dos Acessos (CRUD):</h4>
            <ul style="list-style-type: none; padding: 0;">
                <li><span style="font-weight: bold;">S</span> - ${accessData.S}</li>
                <li><span style="font-weight: bold;">I</span> - ${accessData.I}</li>
                <li><span style="font-weight: bold;">U</span> - ${accessData.U} (PUT/PATCH)</li>
                <li><span style="font-weight: bold;">D</span> - ${accessData.D}</li>
            </ul>
        `;
        container.innerHTML = html;
    }

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
     * NOVO: Carrega os dados (Clientes e Carros) para os dropdowns
     * do formulário de Contrato.
     */
    async function loadContratoFormData() {
        const clienteSelect = document.getElementById('contrato-select-cliente');
        const carroSelect = document.getElementById('contrato-select-carro');
        const errorEl = document.getElementById('contrato-form-error');
        
        // Zera os campos calculados
        document.getElementById('contrato-valor-total').value = '0,00';
        document.getElementById('contrato-data-inicio').value = '';
        document.getElementById('contrato-data-fim').value = '';

        try {
            clienteSelect.innerHTML = '<option value="">Carregando clientes...</option>';
            carroSelect.innerHTML = '<option value="">Carregando carros...</option>';
            
            // 1. Buscar Clientes
            const clienteResponse = await fetch('/detalhescliente/listar');
            if (!clienteResponse.ok) throw new Error('Falha ao buscar clientes.');
            const clientes = await clienteResponse.json();
            
            clienteSelect.innerHTML = '<option value="">Selecione um cliente...</option>';
            
            // PALIATIVO: Usamos item.id_cliente como o ID do Usuário (tb_usuarios.id_usuario)
            clientes.forEach(cliente => {
                const option = document.createElement('option');
                option.value = cliente.id_cliente; 
                option.textContent = `${cliente.pessoa.nome} (CPF: ${cliente.pessoa.CPF})`;
                clienteSelect.appendChild(option);
            });


            // 2. Buscar Carros (Apenas os disponíveis)
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

        const carro = {
            idCarro: null, 
            nome: document.getElementById('carro-nome').value,
            placa: document.getElementById('carro-placa').value,
            anoFabricacao: parseInt(document.getElementById('carro-ano').value, 10),
            cor: document.getElementById('carro-cor').value,
            quilometragem: parseFloat(document.getElementById('carro-km').value),
            status: true
        };

        try {
            const response = await fetch('/detalhesCarros/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(carro)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erro no servidor (${response.status})`);
            }

            alert('Carro cadastrado com sucesso!');
            hideForm('carros-view');
            changeView('carros-view'); 

        } catch (error) {
            console.error('Falha ao cadastrar carro:', error);
            errorEl.textContent = `❌ ${error.message}`;
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

    // Handler genérico (simulado) para os outros formulários (Pessoa, Gerente)
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

    window.confirmDelete = (entityId, entityName) => {
        if (confirm(`Tem certeza que deseja remover o(a) ${entityName} ID ${entityId}? (API de DELETE real precisa ser implementada aqui)`)) {
            alert(`Simulação de remoção: ${entityName} ID ${entityId} removido.`);
        }
    };
    
    window.logout = () => {
        if (confirm("Deseja realmente sair do sistema?")) {
             window.location.href = '/logout'; 
        }
    };
});