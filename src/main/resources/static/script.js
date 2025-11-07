// script.js - Lógica Integrada de Navegação, CRUD Simulado e Renderização Dinâmica

// ... (Restante do Mock Data)

document.addEventListener('DOMContentLoaded', () => {

    // Inicializa a visibilidade dos formulários como ocultos na carga
    document.querySelectorAll('.form-overlay').forEach(el => el.classList.add('hidden'));

    // O código de login manual que manipulava o DOM e fazia o fetch('/login') FOI REMOVIDO DAQUI
    // O Spring Security e o novo login.html cuidam disso.

    // ------------------- NAVEGAÇÃO SPA -------------------
    const navItems = document.querySelectorAll('.nav-item');
    
    // ... (restante do código: changeView, renderDataView, etc.)
    
    //  ------------------- LOGOUT -------------------
    window.logout = () => {
        if (confirm("Deseja realmente sair do sistema?")) {
            // Chamada real de logout do Spring Security
            // O Spring Security irá invalidar a sessão e redirecionar para /login.html
             window.location.href = '/logout'; 
        }
    };
});