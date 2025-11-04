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
    ],
    // NOVO DADO: Matriz de Acessos baseada na imagem
    acessos: {
        'S': 'Select (Buscar dados)',
        'I': 'Insert (Criar dados)',
        'U': 'Update (Atualiza dados)', 
        'D': 'Delete (Deleta dados)',
        'CLIENTE': 'S Carro, S Contrato',
        'FUNCIONARIO': 'S/I/U Pessoa, S/I/U Cliente, S/I/U Contrato',
        'GERENTE': 'S/I/U/D Funcionário, S/I/U/D Pessoa, S/I/U/D Cliente, S/I/U/D Contrato, S/I/U/D Carro'
    },
};

document.addEventListener('DOMContentLoaded', () => {

    // Inicializa a visibilidade dos formulários como ocultos na carga
    document.querySelectorAll('.form-overlay').forEach(el => el.classList.add('hidden'));

    // ------------------- LÓGICA DE LOGIN COM API (Atualizado) -------------------
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = usernameInput.value;
            const password = passwordInput.value;

            // ENDPOINT PADRÃO DO SPRING SECURITY PARA LOGIN VIA FORM
            const loginEndpoint = '/login'; 
            
            // Note: O Spring Security padrão espera form-urlencoded para o endpoint /login
            fetch(loginEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded' 
                },
                // Envia os dados no formato URL-encoded (o nome deve ser 'username' e 'password')
                body: new URLSearchParams({
                    'username': username,
                    'password': password
                })
            })
            .then(response => {
                // SUCESSO: response.ok (200-299) indica sucesso.
                // FALHA: Qualquer outro status (401, 403) indica falha de autenticação.
                
                if (response.ok) {
                    // SUCESSO! Mostra o pop-up e redireciona (troca de tela)
                    alert('✅ SUCESSO: Login realizado! Bem-vindo(a) ao painel.');
                    
                    document.getElementById('login-screen').classList.remove('active');
                    document.getElementById('dashboard-screen').classList.add('active');
                    window.changeView('home-view'); 

                } else {
                    // FALHA! 
                    alert('❌ ERRO: Falha na autenticação. Usuário ou Senha inválidos.');

                    // Limpa a senha
                    passwordInput.value = '';
                }
            })
            .catch(error => {
                // Erro de rede ou servidor
                console.error('Falha na requisição de login:', error);
                alert('❌ ERRO: Não foi possível conectar ao servidor. Verifique o console.');
                passwordInput.value = '';
            });
        });
    }

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
        } else if (targetId === 'acessos-view') {
            renderAcessosView();
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
                    <i class="fas fas-search"></i> Pesquisar
                </button>
                <button class="btn secondary" onclick="changeView('${viewId}')">
                    <i class="fas fas-sync-alt"></i> Atualizar Lista
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

    // ------------------- RENDERIZAÇÃO DE ACESSOS -------------------
    
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

    //  ------------------- LOGOUT -------------------
    window.logout = () => {
        if (confirm("Deseja realmente sair do sistema?")) {
            // Em uma API REST real, aqui você faria um POST para /logout
            // Ex: fetch('/logout', { method: 'POST' }).then(() => { ... });
            document.getElementById('dashboard-screen').classList.remove('active');
            document.getElementById('login-screen').classList.add('active');
            passwordInput.value = ''; // Limpa a senha na tela de login
        }
    };
});