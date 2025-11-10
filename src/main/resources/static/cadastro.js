// cadastro.js - Script para a página de cadastro

document.addEventListener('DOMContentLoaded', () => {

    // Elementos DOM
    const tipoSelectHidden = document.getElementById('tipoCadastro');
    const tipoBotoes = document.querySelectorAll('.tipo-selecao button');
    const camposEspecificosDiv = document.getElementById('camposEspecificos');
    const funcionarioDiv = document.getElementById('funcionarioFields');
    const form = document.getElementById('cadastroForm');
    const passwordErrorElement = document.getElementById('passwordError');
    const serverErrorElement = document.getElementById('serverError'); 
    
    // Lista de campos específicos de funcionário/gerente
    const camposFuncionario = ['cargo', 'dataAdmissao', 'salario'];
    
    // --- FUNÇÕES DE INTERFACE ---
    window.selecionarTipo = (tipo, botaoClicado) => {
        // 1. Atualiza o campo oculto e limpa os erros
        if (tipoSelectHidden) tipoSelectHidden.value = tipo;
        if (passwordErrorElement) passwordErrorElement.classList.add('hidden');
        if (serverErrorElement) serverErrorElement.classList.add('hidden'); 

        // 2. Remove a classe 'selected' de todos os botões
        tipoBotoes.forEach(btn => btn.classList.remove('selected'));

        // 3. Adiciona a classe 'selected' ao botão clicado
        if (botaoClicado) botaoClicado.classList.add('selected');

        // 4. Ajusta a visibilidade e o required dos campos
        ajustarCampos(tipo);
    };

    const ajustarCampos = (tipo) => {

        // Limpa required de todos os campos específicos
        const resetAtributos = (campos) => {
            campos.forEach(id => {
                const input = document.getElementById(id);
                if (input) {
                    input.removeAttribute('required');
                }
            });
        };

        // Reseta e oculta tudo
        if (camposEspecificosDiv) camposEspecificosDiv.classList.add('hidden');
        if (funcionarioDiv) funcionarioDiv.classList.add('hidden');
        resetAtributos(camposFuncionario);

        if (tipo === 'CLIENTE') {
            // Cliente não tem campos específicos adicionais obrigatórios
            
        } else if (tipo === 'FUNCIONARIO' || tipo === 'GERENTE') {
            
            // Exibe a seção de detalhes específicos
            if (camposEspecificosDiv) camposEspecificosDiv.classList.remove('hidden');
            if (funcionarioDiv) funcionarioDiv.classList.remove('hidden');

            // Torna campos de trabalho OBRIGATÓRIOS
            camposFuncionario.forEach(id => {
                const input = document.getElementById(id);
                if (input) input.setAttribute('required', 'required');
            });
        }
    };

    // --- LÓGICA DE ENVIO (FETCH) ---
    if (form) form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Limpa erro do servidor antes de submeter
        if (serverErrorElement) serverErrorElement.classList.add('hidden'); 

        const tipo = tipoSelectHidden ? tipoSelectHidden.value : '';
        const senha = document.getElementById('senha') ? document.getElementById('senha').value : '';
        const confirmacaoSenha = document.getElementById('confirmacaoSenha') ? document.getElementById('confirmacaoSenha').value : '';
        const email = document.getElementById('email') ? document.getElementById('email').value : '';

        if (!tipo) {
            alert('ERRO: Por favor, selecione o Tipo de Pessoa a cadastrar.');
            return;
        }
        
        // --- VALIDAÇÃO DE SENHA FRONT-END ---
        if (senha !== confirmacaoSenha) {
            if (passwordErrorElement) passwordErrorElement.classList.remove('hidden');
            return; 
        } else {
            if (passwordErrorElement) passwordErrorElement.classList.add('hidden');
        }

        // 1. FUNÇÃO AUXILIAR PARA PEGAR VALOR DO DOM
        const getVal = (id) => document.getElementById(id) ? document.getElementById(id).value : '';

        // Definindo o login (usando o email como login)
        const login = email; 

        // 2. CONSTRUÇÃO DA PESSOA ANINHADA
        const dadosPessoa = {
            "Id": null,
            "CPF": getVal('cpf'),
            "nome": getVal('nome'),
            "data_nasc": getVal('data_nasc') || null, 
            "Email": email,
            "telefone1": getVal('telefone1') || null, 
            "telefone2": getVal('telefone2') || null, 
            "cep": getVal('cep') || null,
            "endereco": getVal('endereco') || null, 
            "complemento": getVal('complemento') || null,
            "municipio": getVal('municipio') || null, 
            "uf": getVal('uf') || null,
        };
        
        // 3. COLETA DE DADOS ESPECÍFICOS E CONSTRUÇÃO DO OBJETO RAIZ
        let dadosFinais = {};
        let endpoint = '';
        let porta = 8080; // A porta 8080 está funcionando agora

        
        if (tipo === 'CLIENTE') {
            dadosFinais = {
                "idCliente": null,
                "pessoa": dadosPessoa,
                "login": login,
                "senhaPura": senha,
            };
            endpoint = `http://localhost:${porta}/detalhescliente/add`; 
            
        } else if (tipo === 'FUNCIONARIO' || tipo === 'GERENTE') {
             // DTO para Funcionario (FuncionarioCadastroDTO)
             dadosFinais = {
                 "id_funcionario": null,
                 "data_admissao": getVal('dataAdmissao'),
                 "cargo": getVal('cargo'),
                 "salario": getVal('salario'),
                 "pessoa": dadosPessoa, 
                 "login": login,
                 "senhaPura": senha,
                 "tipoCadastro": tipo 
             };
             endpoint = `http://localhost:${porta}/detalhesfuncionario/add`; 
             
        } else {
             if (serverErrorElement) {
                 serverErrorElement.textContent = 'ERRO INTERNO: Tipo de cadastro não mapeado.';
                 serverErrorElement.classList.remove('hidden');
             }
             return;
        }
        
        // --- ENVIO (FETCH) ---
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosFinais)
        })
        .then(response => {
            if (response.ok) {
                return response.text();
            }
            
            // --- TRATAMENTO DE ERRO DO SERVIDOR ---
            return response.text().then(errorMessage => {
                let displayMessage = `Erro desconhecido. Status: ${response.status}.`;
                
                // Extrai a mensagem da ResponseStatusException
                let statusMatch = errorMessage.match(/\[(.*?)\]/);
                
                if (statusMatch && statusMatch[1]) {
                    displayMessage = statusMatch[1];
                } else if (response.status === 400 || response.status === 500) {
                    // Fallback para mensagens comuns
                    if (errorMessage.toLowerCase().includes("cpf já está cadastrado")) {
                         displayMessage = "O CPF informado já está cadastrado no sistema.";
                    } else if (errorMessage.toLowerCase().includes("e-mail") || errorMessage.toLowerCase().includes("login já está cadastrado")) {
                         displayMessage = "O E-mail (login) já está cadastrado no sistema.";
                    } else if (errorMessage.toLowerCase().includes("18 anos")) {
                         displayMessage = "Cliente deve ter no mínimo 18 anos para se cadastrar.";
                    } else {
                         displayMessage = `Erro no servidor (Status ${response.status}). Verifique o log.`;
                    }
                }
                
                throw new Error(displayMessage);
            });
        })
        .then(data => {
            // Exibe mensagem de sucesso e redireciona
            alert(`✅ Cadastro de ${tipo} realizado com sucesso! Redirecionando para o login.`);
            
            // 🔑 CORREÇÃO AQUI: Redireciona para o login.html em vez do index.html
            window.location.href = '/login.html'; 
        })
        .catch(error => {
            console.error('Falha na requisição:', error);
            
            // Mensagens que indicam que o usuário já existe (CPF/EMAIL/LOGIN)
            const errorKeywords = error.message.toLowerCase();
            const isDuplicateError = errorKeywords.includes("cpf já está cadastrado") || 
                                     errorKeywords.includes("e-mail já está cadastrado") || 
                                     errorKeywords.includes("login já está cadastrado");

            if (isDuplicateError) {
                alert('❌ ERRO: Usuário já no sistema.');
                
                if (serverErrorElement) {
                    serverErrorElement.textContent = '❌ ' + error.message;
                    serverErrorElement.classList.remove('hidden');
                }

            } else {
                if (serverErrorElement) {
                    serverErrorElement.textContent = '❌ ERRO: Falha ao cadastrar. ' + error.message;
                    serverErrorElement.classList.remove('hidden');
                } else {
                    alert('❌ ERRO: Falha ao cadastrar. ' + error.message);
                }
            }
        });
    });

// --- FUNÇÃO GLOBAL PARA ALTERNAR VISIBILIDADE DE SENHA ---
window.togglePasswordVisibility = (element) => {
    // Pega o ID do campo alvo a partir do atributo data-target no ícone
    const targetId = element.getAttribute('data-target');
    const input = document.getElementById(targetId);
    
    if (input.type === 'password') {
        input.type = 'text';
        element.classList.remove('fa-eye'); // Ícone de olho fechado
        element.classList.add('fa-eye-slash'); // Ícone de olho aberto
    } else {
        input.type = 'password';
        element.classList.remove('fa-eye-slash');
        element.classList.add('fa-eye');
    }
}
    // Garante que o ajuste inicial é feito após tudo carregar
    window.onload = () => ajustarCampos('');
});