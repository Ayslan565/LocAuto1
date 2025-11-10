document.addEventListener('DOMContentLoaded', () => {

    const tipoSelectHidden = document.getElementById('tipoCadastro');
    const tipoBotoes = document.querySelectorAll('.tipo-selecao button');
    const camposEspecificosDiv = document.getElementById('camposEspecificos');
    const funcionarioDiv = document.getElementById('funcionarioFields');
    const form = document.getElementById('cadastroForm');
    const passwordErrorElement = document.getElementById('passwordError');
    const serverErrorElement = document.getElementById('serverError'); 
    
    const camposFuncionario = ['cargo', 'dataAdmissao', 'salario'];
    
    window.selecionarTipo = (tipo, botaoClicado) => {
        if (tipoSelectHidden) tipoSelectHidden.value = tipo;
        if (passwordErrorElement) passwordErrorElement.classList.add('hidden');
        if (serverErrorElement) serverErrorElement.classList.add('hidden'); 

        tipoBotoes.forEach(btn => btn.classList.remove('selected'));

        if (botaoClicado) botaoClicado.classList.add('selected');

        ajustarCampos(tipo);
    };

    const ajustarCampos = (tipo) => {

        const resetAtributos = (campos) => {
            campos.forEach(id => {
                const input = document.getElementById(id);
                if (input) {
                    input.removeAttribute('required');
                }
            });
        };

        if (camposEspecificosDiv) camposEspecificosDiv.classList.add('hidden');
        if (funcionarioDiv) funcionarioDiv.classList.add('hidden');
        resetAtributos(camposFuncionario);

        if (tipo === 'CLIENTE') {
            
        } else if (tipo === 'FUNCIONARIO' || tipo === 'GERENTE') {
            
            if (camposEspecificosDiv) camposEspecificosDiv.classList.remove('hidden');
            if (funcionarioDiv) funcionarioDiv.classList.remove('hidden');

            camposFuncionario.forEach(id => {
                const input = document.getElementById(id);
                if (input) input.setAttribute('required', 'required');
            });
        }
    };

    if (form) form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (serverErrorElement) serverErrorElement.classList.add('hidden'); 

        const tipo = tipoSelectHidden ? tipoSelectHidden.value : '';
        const senha = document.getElementById('senha') ? document.getElementById('senha').value : '';
        const confirmacaoSenha = document.getElementById('confirmacaoSenha') ? document.getElementById('confirmacaoSenha').value : '';
        const email = document.getElementById('email') ? document.getElementById('email').value : '';

        if (!tipo) {
            alert('ERRO: Por favor, selecione o Tipo de Pessoa a cadastrar.');
            return;
        }
        
        if (senha !== confirmacaoSenha) {
            if (passwordErrorElement) passwordErrorElement.classList.remove('hidden');
            return; 
        } else {
            if (passwordErrorElement) passwordErrorElement.classList.add('hidden');
        }

        const getVal = (id) => document.getElementById(id) ? document.getElementById(id).value : '';

        const login = email; 

        const dadosPessoa = {
            "Id": null,
            "CPF": getVal('cpf'),
            "nome": getVal('nome'),
            "data_nasc": getVal('data_nasc') || null, 
            "email": email, 
            "telefone1": getVal('telefone1') || null, 
            "telefone2": getVal('telefone2') || null, 
            "cep": getVal('cep') || null,
            "endereco": getVal('endereco') || null, 
            "complemento": getVal('complemento') || null,
            "municipio": getVal('municipio') || null, 
            "uf": getVal('uf') || null,
        };
        
        let dadosFinais = {};
        let endpoint = '';
        let porta = 8080; 

        
        if (tipo === 'CLIENTE') {
            dadosFinais = {
                "idCliente": null,
                "pessoa": dadosPessoa,
                "login": login,
                "senhaPura": senha,
            };
            endpoint = `http://localhost:${porta}/detalhescliente/add`; 
            
        } else if (tipo === 'FUNCIONARIO' || tipo === 'GERENTE') {
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
                let displayMessage = `Erro desconhecido. Status: ${response.status}.`;
                
                let statusMatch = errorMessage.match(/\[(.*?)\]/);
                
                if (statusMatch && statusMatch[1]) {
                    displayMessage = statusMatch[1];
                } else if (response.status === 400 || response.status === 500) {
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
            alert(`Cadastro de ${tipo} realizado com sucesso! Redirecionando para o login.`);
            
            window.location.href = '/login.html'; 
        })
        .catch(error => {
            console.error('Falha na requisição:', error);
            
            const errorKeywords = error.message.toLowerCase();
            const isDuplicateError = errorKeywords.includes("cpf já está cadastrado") || 
                                     errorKeywords.includes("e-mail já está cadastrado") || 
                                     errorKeywords.includes("login já está cadastrado");

            if (isDuplicateError) {
                alert('ERRO: Usuário já no sistema.');
                
                if (serverErrorElement) {
                    serverErrorElement.textContent = 'ERRO: ' + error.message;
                    serverErrorElement.classList.remove('hidden');
                }

            } else {
                if (serverErrorElement) {
                    serverErrorElement.textContent = 'ERRO: Falha ao cadastrar. ' + error.message;
                    serverErrorElement.classList.remove('hidden');
                } else {
                    alert('ERRO: Falha ao cadastrar. ' + error.message);
                }
            }
        });
    });

window.togglePasswordVisibility = (element) => {
    const targetId = element.getAttribute('data-target');
    const input = document.getElementById(targetId);
    
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
    window.onload = () => ajustarCampos('');
});