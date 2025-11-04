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
                        input.value = ''; // Limpa o valor ao trocar de tipo
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
        if (tipo !== 'CLIENTE') {
             alert('ERRO: Este teste está configurado apenas para o tipo CLIENTE no endpoint /detalhescliente/add.');
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


        // 2. CONSTRUÇÃO DA PESSOA ANINHADA (Keys em PascalCase/Maiúsculo para o Java)
        const dadosPessoa = {
            "Id": null,
            "CPF": getVal('cpf'),
            "nome": getVal('nome'),
            "data_nasc": getVal('data_nasc'),
            "Email": email,
            "telefone1": getVal('telefone1'),
            "cep": getVal('cep'),
            "endereco": getVal('endereco'),
            "complemento": getVal('complemento'),
            "municipio": getVal('municipio'),
            "uf": getVal('uf'),
            // Note: telefone2 não existe no HTML, mas seria adicionado aqui se existisse
        };

        // 3. CONSTRUÇÃO DO OBJETO CLIENTE RAIZ
        const dadosFinais = {
            "idCliente": null,
            "pessoa": dadosPessoa, // Objeto aninhado para o OneToOne
        };

        // 4. ENDPOINT: Usamos o caminho relativo, assumindo que o Spring está servindo a API e o HTML.
        const endpoint = '/detalhescliente/add'; 

        console.log(`Enviando para: ${endpoint}`, dadosFinais);

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
                 // Tratamento de erro 404/405/500
                 throw new Error(`Erro no servidor: Status ${response.status}. Mensagem: ${errorMessage.substring(0, 100)}...`);
            });
        })
        .then(data => {
            alert(`[SUCESSO] Cadastro de Cliente finalizado! Resposta: ${data}`);

            // Limpa o formulário e reseta o estado
            form.reset();
            tipoBotoes.forEach(btn => btn.classList.remove('selected'));
            if (tipoSelectHidden) tipoSelectHidden.value = '';
            ajustarCampos('');
        })
        .catch(error => {
            console.error('Falha na requisição:', error);
            alert('ERRO: Falha ao cadastrar. Verifique o console. ' + error.message);
        });
    });

    // Garante que o ajuste inicial é feito após tudo carregar
    window.onload = () => ajustarCampos('');
}); 