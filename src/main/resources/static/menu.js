// =================================================================
// MENU.JS - Gerenciamento de Menu e Navegação
// =================================================================

/**
 * Configura o menu dinâmico baseado no papel do usuário
 */
async function setupDynamicMenu() {
    try {
        const response = await fetch('/api/credenciais/perfil'); 
        if (!response.ok) throw new Error('Não autenticado');
        const roles = await response.json();
        if (!roles || roles.length === 0) throw new Error('Perfil não encontrado');

        const role = roles[0];
        currentUserRole = role; 

        // Elementos do Menu
        const navSectionMgmt = document.getElementById('nav-section-management');
        const navClientes = document.getElementById('nav-clientes');
        const navFuncionarios = document.getElementById('nav-funcionarios');
        const navCarros = document.getElementById('nav-carros');
        const navContratos = document.getElementById('nav-contratos');
        const userInfoName = document.getElementById('user-info-name');

        // Reseta visibilidade
        if (navSectionMgmt) navSectionMgmt.style.display = 'none';
        if (navClientes) navClientes.style.display = 'none';
        if (navFuncionarios) navFuncionarios.style.display = 'none';
        if (navCarros) navCarros.style.display = 'none';
        if (navContratos) navContratos.style.display = 'none';
        if (userInfoName) userInfoName.textContent = role;

        // Ativa itens baseados no Role
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

/**
 * Muda a view (aba) ativa
 */
window.changeView = (targetId) => {
    const navItems = document.querySelectorAll('.nav-item');
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

/**
 * Logout do sistema
 */
window.logout = () => {
    if (confirm("Deseja realmente sair do sistema?")) {
         window.location.href = '/logout'; 
    }
};
