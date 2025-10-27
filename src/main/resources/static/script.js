document.addEventListener('DOMContentLoaded', () => {
    // ------------------- SIMULAÇÃO DE LOGIN -------------------
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Em uma aplicação real, aqui haveria a chamada para a API de autenticação.
        
        // Simulação de sucesso no login:
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('dashboard-screen').classList.add('active');
    });

    // ------------------- NAVEGAÇÃO SPA (Single Page Application) -------------------
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 1. Atualiza o estado do menu
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // 2. Mostra a view correta e esconde as outras
            const targetId = item.getAttribute('data-target');

            views.forEach(view => {
                view.classList.remove('active');
            });

            const targetView = document.getElementById(targetId);
            if (targetView) {
                targetView.classList.add('active');
            }
        });
    });

    // ------------------- SIMULAÇÃO DE CRUD (MODAIS) -------------------
    window.showForm = (viewId, mode, entityId = null) => {
        const formContainer = document.getElementById(`${viewId.replace('-view', '')}-form-container`);
        const formTitleSpan = document.getElementById(`${viewId.replace('-view', '')}-form-title`);
        const form = document.getElementById(`${viewId.replace('-view', '')}-form`);
        
        form.reset(); // Limpa campos

        if (mode === 'create') {
            formTitleSpan.textContent = 'Cadastrar';
        } else if (mode === 'edit') {
            formTitleSpan.textContent = 'Editar';
            // Em uma aplicação real, aqui carregaria os dados da 'entityId' do banco.
            console.log(`Simulando carregamento de dados para edição: ID ${entityId}`);
            // Exemplo de preenchimento (simulação)
            if (viewId === 'pessoas-view') {
                form.querySelector('input[name="nome"]').value = 'João Editado';
                form.querySelector('input[name="cpf"]').value = '12345678900';
            } else if (viewId === 'carros-view') {
                 form.querySelector('input[name="nome"]').value = 'Modelo Editado';
                 form.querySelector('input[name="placa"]').value = 'NEW1234';
            }
        }

        formContainer.classList.remove('hidden');
    };

    window.hideForm = (viewId) => {
        const formContainer = document.getElementById(`${viewId.replace('-view', '')}-form-container`);
        formContainer.classList.add('hidden');
    };

    // Submissão do formulário (Simulação de CREATE/UPDATE)
    document.querySelectorAll('.crud-form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const viewId = form.id.replace('-form', '-view');
            const action = form.querySelector('h4').textContent.includes('Cadastrar') ? 'Criação' : 'Edição';
            
            alert(`Simulação de ${action} de ${viewId.toUpperCase()}:\nDados enviados com sucesso! (ID: 999)`);
            
            hideForm(viewId);
        });
    });

    // Simulação de DELETE
    window.confirmDelete = (entityId) => {
        if (confirm(`Tem certeza que deseja remover a entidade ID ${entityId}? (Simulação de DELETE)`)) {
            alert(`Simulação de remoção: ID ${entityId} removido.`);
            // Em uma aplicação real, aqui seria a chamada de exclusão e a atualização da tabela.
        }
    };

    // ------------------- LOGOUT -------------------
    window.logout = () => {
        if (confirm("Deseja realmente sair do sistema?")) {
            document.getElementById('dashboard-screen').classList.remove('active');
            document.getElementById('login-screen').classList.add('active');
            // Resetar estados de visualização e forms aqui se necessário.
        }
    };
});