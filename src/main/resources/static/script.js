const mockData = {
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

    document.querySelectorAll('.form-overlay').forEach(el => el.classList.add('hidden'));

    async function setupDynamicMenu() {
        try {
            const response = await fetch('/api/credenciais/perfil');
            
            if (!response.ok) {
                throw new Error('Não autenticado');
            }

            const roles = await response.json();
            
            if (roles.length === 0) {
                throw new Error('Perfil não encontrado');
            }

            const role = roles[0]; 

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
                navPessoas.style.display = 'flex';
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

        const entityKey = targetId.replace('-view', '');
        if (entityKey in mockData) {
            const entityName = entityKey.charAt(0).toUpperCase() + entityKey.slice(1).replace('s', ''); 
            renderDataView(targetId, mockData[entityKey], entityName); 
        } else if (targetId === 'contratos-view') {
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
    
    function renderDataView(viewId, data, entityName) {
        const entityKey = viewId.replace('-view', ''); 
        const view = document.getElementById(viewId);
        
        view.innerHTML = `
            <div class="crud-header">
                <h3>Gerenciar ${entityName}s</h3>
                <button class="btn primary" onclick="showForm('${viewId}', 'create')">
                    <i class="fas fa-plus"></i> Novo ${entityName}
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
    }

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

    function getTableRows(entityName, data) {
        if (!data || data.length === 0) return '<tr><td colspan="6" style="text-align:center;">Nenhum registro encontrado.</td></tr>';
        
        let html = '';
        data.forEach(item => {
            let cells = '';
            const actions = `<button class="btn small edit" onclick="showForm('${entityName.toLowerCase()}s-view', 'edit', ${item.id || item.cpf || item.placa})"><i class="fas fa-edit"></i></button><button class="btn small delete" onclick="confirmDelete('${item.id || item.cpf || item.placa}', '${entityName}')"><i class="fas fa-trash"></i></button>`;
            
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


    window.showForm = (viewId, mode, entityId = null) => {
        const formContainer = document.getElementById(`${viewId.replace('-view', '')}-form-container`);
        const formTitleSpan = document.getElementById(`${viewId.replace('-view', '')}-form-title`);
        const form = document.getElementById(`${viewId.replace('-view', '')}-form`);
        
        if (!formContainer) {
             console.error(`Container do formulário ${targetViewId} não encontrado.`);
             return;
        }

        form.reset(); 

        if (mode === 'create') {
            formTitleSpan.textContent = 'Cadastrar';
        } else if (mode === 'edit') {
            formTitleSpan.textContent = 'Editar';
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

    document.querySelectorAll('.crud-form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formContainerId = form.parentNode.parentNode.id;
            const viewId = formContainerId.replace('-form-container', '-view');
            const entityKey = viewId.replace('-view', ''); 
            const action = form.querySelector('h4').textContent.includes('Cadastrar') ? 'Criação' : 'Edição';
            
            alert(`Simulação de ${action} de ${entityKey.toUpperCase()}:\nDados enviados com sucesso! (ID: 999)`);
            
            hideForm(viewId);
            changeView(viewId); 
        });
    });

    window.confirmDelete = (entityId, entityName) => {
        if (confirm(`Tem certeza que deseja remover o(a) ${entityName} ID ${entityId}? (Simulação de DELETE)`)) {
            alert(`Simulação de remoção: ${entityName} ID ${entityId} removido.`);
        }
    };
    
    window.logout = () => {
        if (confirm("Deseja realmente sair do sistema?")) {
             window.location.href = '/logout'; 
        }
    };
});