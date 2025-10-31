// script.js - Lógica Integrada de Navegação, CRUD Simulado e Renderização Dinâmica

// --- Dados de Simulação (Mock Data) ---
const mockData = {
    // Adicionado campo 'role' em Pessoas para simular o perfil de herança
    pessoas: [
        { id: 1, nome: "João Silva", cpf: "123.456.789-00", email: "joao@mail.com", role: "CLIENTE" },
        { id: 10, nome: "Fábio Mendes", cpf: "333.333.333-33", email: "fabio@locauto.com", role: "FUNCIONARIO" },
        { id: 100, nome: "Usuário Gerente", cpf: "999.999.999-99", email: "gerente@locauto.com", role: "GERENTE" }
    ],
    clientes: [
        { id: 1, nome: "Ana Lima", cpf: "111.111.111-11", email: "ana@mail.com", role: "CLIENTE", telefone: "(11) 98765-4321" },
        { id: 2, nome: "Carlos Souza", cpf: "222.222.222-22", email: "carlos@mail.com", role: "CLIENTE", telefone: "(21) 99887-7665" }
    ],
    funcionarios: [
        { id: 10, nome: "Fábio Mendes", cpf: "333.333.333-33", email: "fabio@locauto.com", role: "FUNCIONARIO", cargo: "Atendente", admissao: "2023-01-15", salario: 3000.00 },
        { id: 11, nome: "Gabriela Rios", cpf: "444.444.444-44", email: "gabriela@locauto.com", role: "FUNCIONARIO", cargo: "Vendedora", admissao: "2024-05-20", salario: 3500.00 }
    ],
    carros: [
        { id: 101, modelo: "Onix Plus", placa: "ABC1D23", ano: 2022, status: "Disponível" },
        { id: 102, modelo: "Renegade", placa: "XYZ9E87", ano: 2021, status: "Alugado" },
        { id: 103, modelo: "HB20", placa: "DEF4G56", ano: 2023, status: "Disponível" }
    ],
    contratos: [
         { id: 'C001', cliente: 'João Silva', carro: 'Onix Plus', inicio: '2025-10-01', fim: '2025-10-30', valor: 1500.00 },
    ]
};

document.addEventListener('DOMContentLoaded', () => {

    // Inicializa a visibilidade dos formulários como ocultos na carga
    document.querySelectorAll('.form-overlay').forEach(el => el.classList.add('hidden'));

    // ------------------- SIMULAÇÃO DE LOGIN (Com Validação de Senha) -------------------
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Credenciais de simulação (admin/123)
        const VALID_USER = "admin";
        const VALID_PASS = "123";

        // Obtém os valores dos inputs
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Validação
        if (username === VALID_USER && password === VALID_PASS) {
            // Sucesso no login:
            document.getElementById('login-screen').classList.remove('active');
            document.getElementById('dashboard-screen').classList.add('active');
            changeView('home-view'); // Garante que a primeira view carrega corretamente
        } else {
             // Falha no login
             alert("Falha no Login: Usuário ou Senha inválidos.");
             document.getElementById('password').value = ''; // Limpa o campo de senha
        }
    });

    // ------------------- NAVEGAÇÃO SPA -------------------
    const navItems = document.querySelectorAll('.nav-item');
    
    // Função global para trocar de view (usada no login e na barra lateral)
    window.changeView = (targetId) => {
        // 1. Atualiza o estado do menu
        navItems.forEach(i => i.classList.remove('active'));
        const activeItem = document.querySelector(`.nav-item[data-target="${targetId}"]`);
        if (activeItem) activeItem.classList.add('active');

        // 2. Mostra a view correta e esconde as outras
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        const targetView = document.getElementById(targetId);
        if (targetView) {
            targetView.classList.add('active');
        }

        // 3. Chamada de Renderização Dinâmica
        const entityKey = targetId.replace('-view', '');
        if (entityKey in mockData) {
            // Se for uma das views dinâmicas (pessoas, clientes, funcionarios, carros)
            const entityName = entityKey.charAt(0).toUpperCase() + entityKey.slice(1).replace('s', ''); // Ex: 'clientes' -> 'Cliente'
            
            // Aqui é onde você faria o fetch('/api/' + entityKey) para carregar dados reais
            
            renderDataView(targetId, mockData[entityKey], entityName); // Usando mockData por enquanto
        } else if (targetId === 'contratos-view') {
            // Conteúdo de contratos é semi-estático, mas vamos atualizar a tabela
            const table = document.querySelector('#contratos-view .data-table tbody');
            if (table) table.innerHTML = getTableRows('Contrato', mockData.contratos);
        }
    };

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            changeView(item.getAttribute('data-target'));
        });
    });

    // ------------------- RENDERIZAÇÃO DINÂMICA (Puxar Dados) -------------------
    
    function renderDataView(viewId, data, entityName) {
        const entityKey = viewId.replace('-view', ''); // Ex: 'pessoas'
        const view = document.getElementById(viewId);
        
        view.innerHTML = `
            <div class="crud-header">
                <h3>Gerenciar ${entityName}s</h3>
                <button class="btn primary" onclick="showForm('${viewId}', 'create')">
                    <i class="fas fa-plus"></i> Novo ${entityName}
                </button>
            </div>
            
            <div class="search-area">
                <input type="text" id="${viewId}-search-input" placeholder="Pesquisar ${entityName} por nome/CPF/placa...">
                <button class="btn secondary" onclick="searchData('${viewId}', '${entityName}', '${entityKey}')">
                    <i class="fas fa-search"></i> Pesquisar
                </button>
                <button class="btn secondary" onclick="changeView('${viewId}')">
                    <i class="fas fa-sync-alt"></i> Atualizar Lista
                </button>
            </div>

            <div class="card">
                <h4>Lista de ${entityName}s</h4>
                <table class="data-table" id="${viewId}-table">
                    <thead>
                        ${getTableHeader(entityName)}
                    </thead>
                    <tbody>
                        ${getTableRows(entityName, data)}
                    </tbody>
                </table>
            </div>
        `;
        
        // Adiciona o formulário modal de volta, se ele pertencer a essa view (para evitar que seja apagado)
        const formContainer = document.getElementById(`${entityKey}-form-container`);
        if (formContainer) {
            // Clonar o nó e adicionar à view
            view.appendChild(formContainer.cloneNode(true));
            document.getElementById(`${entityKey}-form-container`).classList.add('hidden');
        }
    }

    /** Retorna o cabeçalho da tabela baseado na entidade */
    function getTableHeader(entityName) {
        if (entityName === 'Pessoa') {
            return `<tr><th>ID</th><th>Nome</th><th>CPF</th><th>Email</th><th>Perfil</th><th>Ações</th></tr>`;
        } else if (entityName === 'Cliente') {
            return `<tr><th>ID</th><th>Nome</th><th>CPF</th><th>Telefone</th><th>Ações</th></tr>`;
        } else if (entityName === 'Funcionário') {
            return `<tr><th>ID</th><th>Nome</th><th>Cargo</th><th>Admissão</th><th>Salário</th><th>Ações</th></tr>`;
        } else if (entityName === 'Carro') {
            return `<tr><th>ID</th><th>Modelo</th><th>Placa</th><th>Ano</th><th>Status</th><th>Ações</th></tr>`;
        } else if (entityName === 'Contrato') {
             return `<tr><th>ID Contrato</th><th>Cliente</th><th>Carro</th><th>Início</th><th>Fim Prev.</th><th>Valor Total</th><th>Ações</th></tr>`;
        }
        return '';
    }

    /** Retorna as linhas da tabela */
    function getTableRows(entityName, data) {
        if (!data || data.length === 0) return '<tr><td colspan="6" style="text-align:center;">Nenhum registro encontrado.</td></tr>';
        
        let html = '';
        data.forEach(item => {
            let cells = '';
            const actions = `
                <button class="btn small edit" onclick="showForm('${entityName.toLowerCase()}s-view', 'edit', ${item.id || item.cpf || item.placa})"><i class="fas fa-edit"></i></button>
                <button class="btn small delete" onclick="confirmDelete('${item.id || item.cpf || item.placa}', '${entityName}')"><i class="fas fa-trash"></i></button>
            `;
            
            if (entityName === 'Pessoa') {
                cells = `<td>${item.id}</td><td>${item.nome}</td><td>${item.cpf}</td><td>${item.email}</td><td><span class="status-badge ${item.role.toLowerCase()}">${item.role}</span></td>`;
            } else if (entityName === 'Cliente') {
                cells = `<td>${item.id}</td><td>${item.nome}</td><td>${item.cpf}</td><td>${item.telefone}</td>`;
            } else if (entityName === 'Funcionário') {
                 const salarioFormatado = item.salario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                cells = `<td>${item.id}</td><td>${item.nome}</td><td>${item.cargo}</td><td>${item.admissao}</td><td>${salarioFormatado}</td>`;
            } else if (entityName === 'Carro') {
                const statusClass = item.status === 'Disponível' ? 'available' : 'rented';
                cells = `<td>${item.id}</td><td>${item.modelo}</td><td>${item.placa}</td><td>${item.ano}</td><td><span class="status-badge ${statusClass}">${item.status}</span></td>`;
            } else if (entityName === 'Contrato') {
                 const valorFormatado = item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                cells = `<td>${item.id}</td><td>${item.cliente}</td><td>${item.carro}</td><td>${item.inicio}</td><td>${item.fim}</td><td>${valorFormatado}</td>`;
            }
            
            html += `<tr>${cells}<td>${actions}</td></tr>`;
        });
        return html;
    }


    /** Simulação da função de pesquisa (Onde você faria a chamada GET com o filtro) */
    window.searchData = (viewId, entityName, entityKey) => {
        const input = document.getElementById(`${viewId}-search-input`).value.toLowerCase();
        const allData = mockData[entityKey];
        
        const filteredData = allData.filter(item => {
            // Lógica de pesquisa: busca por nome ou CPF/Placa
            return (item.nome && item.nome.toLowerCase().includes(input)) || 
                   (item.cpf && item.cpf.includes(input)) ||
                   (item.placa && item.placa.toLowerCase().includes(input));
        });

        const tbody = document.querySelector(`#${viewId}-table tbody`);
        if (tbody) {
            tbody.innerHTML = getTableRows(entityName, filteredData);
        }
        
        alert(`Pesquisa concluída! Encontrados ${filteredData.length} ${entityName}(s) para "${input}".`);
        // CHAMADA REAL: fetch('/api/' + entityKey + '?search=' + input).then(...)
    }

    // ------------------- SIMULAÇÃO DE CRUD (MODAIS) --- 

    window.showForm = (viewId, mode, entityId = null) => {
        // Mapeia views de Clientes/Funcionários para o modal de Pessoa
        const targetViewId = viewId === 'clientes-view' || viewId === 'funcionarios-view' ? 'pessoas-view' : viewId;
        
        const formContainer = document.getElementById(`${targetViewId.replace('-view', '')}-form-container`);
        const formTitleSpan = document.getElementById(`${targetViewId.replace('-view', '')}-form-title`);
        const form = document.getElementById(`${targetViewId.replace('-view', '')}-form`);
        
        if (!formContainer) {
             console.error(`Container do formulário ${targetViewId} não encontrado.`);
             return;
        }

        form.reset(); 

        if (mode === 'create') {
            formTitleSpan.textContent = 'Cadastrar';
        } else if (mode === 'edit') {
            formTitleSpan.textContent = 'Editar';
            // Simulação de carregamento (Chamada GET: fetch('/api/' + entityKey + '/' + entityId))
            console.log(`Simulando carregamento de dados para edição de ID: ${entityId}`);
        }

        formContainer.classList.remove('hidden');
    };

    window.hideForm = (viewId) => {
        const formContainer = document.getElementById(`${viewId.replace('-view', '')}-form-container`);
        if (formContainer) {
             formContainer.classList.add('hidden');
        }
    };

    // Submissão do formulário (Simulação de CREATE/UPDATE)
    document.querySelectorAll('.crud-form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formContainerId = form.parentNode.parentNode.id; // Pega o id do form-overlay
            const viewId = formContainerId.replace('-form-container', '-view');
            const entityKey = viewId.replace('-view', ''); // Ex: 'pessoas'
            const action = form.querySelector('h4').textContent.includes('Cadastrar') ? 'Criação' : 'Edição';
            
            // Aqui seria a chamada POST/PUT para o Spring Boot
            // Exemplo: fetch('/api/' + entityKey, { method: action === 'Criação' ? 'POST' : 'PUT', ... })

            alert(`Simulação de ${action} de ${entityKey.toUpperCase()}:\nDados enviados com sucesso! (ID: 999)`);
            
            hideForm(viewId);
            changeView(viewId); // Atualiza a lista após a submissão simulada
        });
    });

    // Simulação de DELETE
    window.confirmDelete = (entityId, entityName) => {
        if (confirm(`Tem certeza que deseja remover o(a) ${entityName} ID ${entityId}? (Simulação de DELETE)`)) {
            // Lógica real de deleção (DELETE) aqui: fetch('/api/' + entityName.toLowerCase() + 's/' + entityId, { method: 'DELETE' })
            alert(`Simulação de remoção: ${entityName} ID ${entityId} removido.`);
            // Opcional: Recarregar a lista: changeView(entityName.toLowerCase() + 's-view');
        }
    };

    // ------------------- LOGOUT -------------------
    window.logout = () => {
        if (confirm("Deseja realmente sair do sistema?")) {
            document.getElementById('dashboard-screen').classList.remove('active');
            document.getElementById('login-screen').classList.add('active');
        }
    };
});