// =================================================================
// MAIN.JS - Arquivo Principal que Inicializa a Aplicação
// =================================================================

/**
 * Inicialização da página - Carrega todos os módulos e configura eventos
 */
document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.form-overlay').forEach(el => el.classList.add('hidden'));

    // Configura o menu dinâmico
    setupDynamicMenu();

    // Setup dos event listeners de navegação
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            changeView(item.getAttribute('data-target'));
        });
    });
});
