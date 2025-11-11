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
        if (!errorEl) return;
        errorEl.classList.add('hidden');

        const username = document.getElementById('username')?.value;
        const password = document.getElementById('password')?.value;

        if (!username || !password) {
            errorEl.textContent = '❌ Erro: Usuário e Senha são campos obrigatórios.';
            errorEl.classList.remove('hidden');
            return;
        }

        try {
            const res = await fetch('/api/credenciais/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const contentType = res.headers.get('content-type') || '';
            const isJson = contentType.includes('application/json');

            if (res.ok) {
                // Sucesso: prefere JSON com redirect, senão fallback para index.html
                if (isJson) {
                    const data = await res.json();
                    window.location.href = data.redirect || '/index.html';
                } else {
                    // Se não for JSON, redireciona para página padrão
                    window.location.href = '/index.html';
                }
                return;
            }

            // Tratamento de erro (res.ok === false)
            let errorMessage = '❌ Credenciais inválidas. Verifique seu login e senha.';
            let rawResponseText = '';

            try {
                rawResponseText = await res.text();

                if (isJson && rawResponseText) {
                    try {
                        const errObj = JSON.parse(rawResponseText);
                        // Prioriza campos comuns
                        if (errObj.error) {
                            errorMessage = errObj.error;
                        } else if (errObj.message) {
                            errorMessage = errObj.message;
                        } else {
                            errorMessage = JSON.stringify(errObj);
                        }
                    } catch (jsonErr) {
                        // Não conseguiu parsear JSON: mantem raw text
                        if (rawResponseText.trim()) errorMessage = rawResponseText.trim();
                    }
                } else {
                    // Não é JSON: tenta usar status para mensagem
                    if (res.status === 401) {
                        errorMessage = '❌ Falha na autenticação (401). Verifique as credenciais.';
                    } else if (res.status === 403) {
                        errorMessage = '❌ Acesso negado (403).';
                    } else {
                        if (rawResponseText.trim()) errorMessage = rawResponseText.trim();
                        else errorMessage = `Erro no servidor: ${res.status}`;
                    }
                }
            } catch (readError) {
                rawResponseText = `ERRO DE LEITURA DO CORPO: ${readError.message}`;
                console.error('Erro lendo corpo da resposta:', readError);
            }

            errorEl.textContent = errorMessage;
            errorEl.classList.remove('hidden');
            console.error('Falha de Login (DEBUG):', { status: res.status, rawResponseText });

        } catch (err) {
            // Erro de rede (CORS, servidor offline, etc.)
            if (!errorEl) return;
            errorEl.textContent = `Erro de conexão com o servidor: ${err.message}`;
            errorEl.classList.remove('hidden');
            console.error('Erro de Rede/Conexão:', err);
        }
    });

    // --- FUNÇÃO GLOBAL PARA ALTERNAR VISIBILIDADE DE SENHA ---
    window.togglePasswordVisibility = (element) => {
        const targetId = element.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if (!input) return;

        if (input.type === 'password') {
            input.type = 'text';
            element.classList.remove('fa-eye');
            element.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            element.classList.remove('fa-eye-slash');
            element.classList.add('fa-eye');
        }
    }
    
    
});