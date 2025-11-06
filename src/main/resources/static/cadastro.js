// cadastro.js - Script para a página de cadastro

document.addEventListener('DOMContentLoaded', () => {

    // Elementos DOM (Acesso direto, pois o script deve estar no final do body)
    const tipoSelectHidden = document.getElementById('tipoCadastro');
    const tipoBotoes = document.querySelectorAll('.tipo-selecao button');
    const camposEspecificosDiv = document.getElementById('camposEspecificos');
    const clienteDiv = document.getElementById('clienteFields');
    const funcionarioDiv = document.getElementById('funcionarioFields');
    const form = document.getElementById('cadastroForm');
    const passwordErrorElement = document.getElementById('passwordError');

    // Campos específicos que devem ser tornados obrigatórios para FUNCIONARIO/GERENTE
    const camposFuncionario = ['cargo', 'dataAdmissao', 'salario'];
    const camposCliente = ['observacoes'];

    // --- FUNÇÕES DE INTERFACE ---
    window.selecionarTipo = (tipo, botaoClicado) => {
        // 1. Atualiza o campo oculto e limpa o erro de senha
        if (tipoSelectHidden) tipoSelectHidden.value = tipo;
        if (passwordErrorElement) passwordErrorElement.classList.add('hidden');

        // 2. Remove a classe 'selected' de todos os botões
        tipoBotoes.forEach(btn => btn.classList.remove('selected'));

        // 3. Adiciona a classe 'selected' ao botão clicado
        if (botaoClicado) botaoClicado.classList.add('selected');

        // 4. Ajusta a visibilidade dos campos
        ajustarCampos(tipo);
    };

    const ajustarCampos = (tipo) => {

        // Função auxiliar para remover 'required' e limpar valor
        const resetAtributos = (campos) => {
            campos.forEach(id => {
                const input = document.getElementById(id);
                if (input) {
                    input.removeAttribute('required');
                    if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
                        // Não limpamos o valor aqui, pois queremos preservar os dados
                        // input.value = ''; 
                    }
                }
            });
        };

        // 1. Reseta e oculta tudo
        if (camposEspecificosDiv) camposEspecificosDiv.classList.add('hidden');
        if (clienteDiv) clienteDiv.classList.add('hidden');
        if (funcionarioDiv) funcionarioDiv.classList.add('hidden');

        resetAtributos(camposFuncionario.concat(camposCliente));

        if (tipo) {
            if (camposEspecificosDiv) camposEspecificosDiv.classList.remove('hidden');

            if (tipo === 'CLIENTE') {
                if (clienteDiv) clienteDiv.classList.remove('hidden');

            } else if (tipo === 'FUNCIONARIO' || tipo === 'GERENTE') {
                if (funcionarioDiv) funcionarioDiv.classList.remove('hidden');

                // Torna campos de trabalho obrigatórios
                camposFuncionario.forEach(id => {
                    const input = document.getElementById(id);
                    if (input) input.setAttribute('required', 'required');
                });
            }
        }
    };

    // --- LÓGICA DE ENVIO (FETCH) ---
    if (form) form.addEventListener('submit', function(event) {
        event.preventDefault();

        const tipo = tipoSelectHidden ? tipoSelectHidden.value : '';
        const senha = document.getElementById('senha') ? document.getElementById('senha').value : '';
        const confirmacaoSenha = document.getElementById('confirmacaoSenha') ? document.getElementById('confirmacaoSenha').value : '';
        const email = document.getElementById('email') ? document.getElementById('email').value : '';

        if (!tipo) {
            alert('ERRO: Por favor, selecione o Tipo de Pessoa a cadastrar.');
            return;
        }
        
        // --- VALIDAÇÃO DE SENHA ---
        if (senha !== confirmacaoSenha) {
            if (passwordErrorElement) passwordErrorElement.classList.remove('hidden');
            alert('ERRO: A Senha e a Confirmação de Senha devem ser idênticas.');
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
        let porta = 8080; // Assumindo a porta 8080 do Spring Boot

        
        if (tipo === 'CLIENTE') {
            dadosFinais = {
                "idCliente": null,
                "pessoa": dadosPessoa,
                "login": login,
                "senhaPura": senha,
            };
            endpoint = `http://localhost:${porta}/detalhescliente/add`; // Endpoint Cliente
            
        } else if (tipo === 'FUNCIONARIO' || tipo === 'GERENTE') {
             // DTO para Funcionario (FuncionarioCadastroDTO)
             dadosFinais = {
                 "id_funcionario": null,
                 "data_admissao": getVal('dataAdmissao'),
                 "cargo": getVal('cargo'),
                 "salario": getVal('salario'),
                 "pessoa": dadosPessoa, // Pessoa aninhada
                 "login": login,
                 "senhaPura": senha,
                 "tipoCadastro": tipo // Indica se é FUNCIONARIO ou GERENTE
             };
             endpoint = `http://localhost:${porta}/detalhesfuncionario/add`; // Endpoint Funcionário
             
        } else {
             alert('ERRO INTERNO: Tipo de cadastro não mapeado.');
             return;
        }
        
        console.log(`Enviando para: ${endpoint} (Tipo: ${tipo})`, dadosFinais);

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
            return response.text().then(errorMessage => {
                // Tenta extrair a mensagem de erro detalhada do servidor
                let serverError = errorMessage.match(/\[(.*?)\]/);
                let displayMessage = serverError ? serverError[1] : `Erro no servidor: Status ${response.status}`;
                throw new Error(displayMessage);
            });
        })
        .then(data => {
            // Exibe uma mensagem de sucesso
            alert(`✅ Cadastro de ${tipo} realizado com sucesso!`);
            
            // REDIRECIONAMENTO APÓS SUCESSO
            window.location.href = '/index.html'; // Redireciona para a página inicial ou de login.
        })
        .catch(error => {
            console.error('Falha na requisição:', error);
            alert('❌ ERRO: Falha ao cadastrar. ' + error.message);
        });
    });

    // Garante que o ajuste inicial é feito após tudo carregar
    window.onload = () => ajustarCampos('');
});

// Nota: O código de Mock Data e Renderização de Tabela (originalmente abaixo desta linha)
// foi omitido aqui, pois é de navegabilidade (index.js), mas deve ser mantido no seu
// script principal para fins de demonstração (se não for index.js).