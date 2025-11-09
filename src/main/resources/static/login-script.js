// login-script.js - Lógica dedicada ao formulário de Login

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('login-form');
    const errorEl = document.getElementById('login-error-message');
    const registerLink = document.getElementById('register-link');

    // Verifica se a URL contém o parâmetro de erro de falha de login (do Spring Security)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('error') && errorEl) {
        // Esta mensagem será exibida quando o login falhar por redirecionamento (caso não tenha o filtro JSON)
        errorEl.textContent = '❌ Usuário ou Senha inválidos. Tente novamente.';
        errorEl.classList.remove('hidden');
    } else if (errorEl) {
        errorEl.classList.add('hidden');
    }

    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'cadastro.html'; 
        });
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        errorEl.classList.add('hidden');
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!username || !password) {
            errorEl.textContent = '❌ Erro: Usuário e Senha são campos obrigatórios.';
            errorEl.classList.remove('hidden');
            return;
        }

        try {
            // 🔑 Correção: O fetch agora espera um JSON do SecurityConfig
            const res = await fetch('/api/credenciais/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
                // 🔑 'redirect: manual' foi removido para processar a resposta JSON
            });

            const isJson = res.headers.get("content-type")?.includes("application/json");

            if (res.ok && isJson) {
                // Sucesso na autenticação (esperado JSON do jsonSuccessHandler)
                const data = await res.json();
                
                // Armazena o token ou role (se necessário)
                // sessionStorage.setItem('userRole', data.role);
                
                // Redireciona para o destino
                window.location.href = data.redirect || '/index.html';

            } else {
                // --- TRATAMENTO DE ERROS 401 (Credenciais Inválidas ou Acesso Negado) ---
                let errorMessage = '❌ Credenciais inválidas. Verifique seu login e senha.';
                let rawResponseText = '';

                try {
                    rawResponseText = await res.text();
                    
                    // Tenta extrair a mensagem específica do back-end (do jsonFailureHandler ou AuthenticationEntryPoint)
                    if (isJson) { 
                        const err = JSON.parse(rawResponseText);
                        // Prioriza a mensagem do handler de falha
                        if (err.error === "Credenciais inválidas") {
                            errorMessage = '❌ Credenciais inválidas. Verifique seu login e senha.';
                        } else {
                            // Mensagem do AuthenticationEntryPoint (ex: "Não autorizado")
                            errorMessage = err.message || errorMessage;
                        }
                    } else if (res.status === 401) {
                         // Fallback se a resposta não for JSON (ex: HTML de erro do Spring)
                         errorMessage = '❌ Falha na autenticação (401). Verifique as credenciais.';
                    }

                } catch (readError) {
                    rawResponseText = `ERRO DE LEITURA DO CORPO: ${readError.message}`;
                }
                
                errorEl.textContent = errorMessage;
                errorEl.classList.remove('hidden');
                
                console.error('Falha de Login (DEBUG):', { status: res.status, rawResponseText: rawResponseText });
            }
        } catch (err) {
            // Lida com erros de rede (CORS, servidor offline)
            errorEl.textContent = `Erro de conexão com o servidor (Verifique se o backend está rodando): ${err.message}`;
            errorEl.classList.remove('hidden');
            console.error('Erro de Rede/Conexão:', err);
        }
    });

    // --- FUNÇÃO GLOBAL PARA ALTERNAR VISIBILIDADE DE SENHA ---
    window.togglePasswordVisibility = (element) => {
        const targetId = element.getAttribute('data-target');
        const input = document.getElementById(targetId);
        
        if (input.type === 'password') {
            input.type = 'text';
            element.classList.remove('fa-eye'); 
            element.classList.add('fa-eye-slash'); // Ícone de olho aberto
        } else {
            input.type = 'password';
            element.classList.remove('fa-eye-slash');
            element.classList.add('fa-eye'); // Ícone de olho fechado
        }
    }
    
    // --------------------------------------------------
    // NOVO: LÓGICA DO SLIDESHOW DE FUNDO
    // --------------------------------------------------
    const slides = document.querySelectorAll('.background-slideshow .slide');
    let currentSlide = 0;
    const slideInterval = 5000; // Tempo em milissegundos (5 segundos)

    function nextSlide() {
        if (slides.length === 0) return; // Não faz nada se não houver slides

        // Remove a classe 'active' do slide atual
        slides[currentSlide].classList.remove('active');
        
        // Calcula o próximo slide
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Adiciona a classe 'active' ao novo slide
        slides[currentSlide].classList.add('active');
    }

    // Inicia a troca de slides
    if (slides.length > 0) {
        setInterval(nextSlide, slideInterval);
    }
    
});