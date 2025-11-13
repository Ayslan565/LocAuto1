// =================================================================
// TABLES.JS - Funções de Renderização de Tabelas
// =================================================================

/**
 * Renderiza a view de Contratos
 */
async function renderContratosView() {
    const showNewButton = (currentUserRole === 'GERENTE' || currentUserRole === 'FUNCIONARIO');

    const view = document.getElementById('contratos-view');
    view.innerHTML = `
        <div class="crud-header">
            <h3>Gerenciar Contratos</h3>
            ${showNewButton ? `
            <button class="btn primary" onclick="showForm('contratos-view', 'create')">
                <i class="fas fa-plus"></i> Novo Contrato
            </button>` : ''}
        </div>
        
        <div class="card">
            <h4>Contratos em Andamento</h4>
            <table class="data-table">
                <thead>
                    ${getTableHeader('Contrato')}
                </thead>
                <tbody>
                    <tr><td colspan="8" style="text-align:center;">Carregando seus contratos...</td></tr>
                </tbody>
            </table>
        </div>
    `;

    const tableBody = document.querySelector('#contratos-view .data-table tbody');
    if (!tableBody) return;

    try {
        const response = await fetch('/api/contratos'); 
        if (!response.ok) {
             tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: red;">Erro no servidor ao buscar contratos (${response.status})</td></tr>`;
             return;
        }
        const contratos = await response.json();
        tableBody.innerHTML = getTableRows('contrato', contratos);
    } catch (error) {
        console.error('Falha ao buscar contratos:', error);
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: red;">Falha de rede ao tentar carregar contratos.</td></tr>`;
    }
}

/**
 * Renderiza views genéricas (Clientes, Funcionários, Carros)
 */
async function renderDataView(viewId, entityName, endpoint, filterParamName = null) {
    const view = document.getElementById(viewId);
    const showNewButton = (currentUserRole === 'GERENTE' || currentUserRole === 'FUNCIONARIO');
    
    let searchBarHtml = '';
    if (filterParamName) {
        let placeholder = `Buscar por ${filterParamName}...`;
        if (filterParamName === 'cpf') placeholder = 'Buscar por CPF... (ex: 111)';
        if (filterParamName === 'placa') placeholder = 'Buscar por Placa... (ex: ABC)';
        if (filterParamName === 'nome') placeholder = 'Buscar por Nome/Modelo...';
        
        searchBarHtml = `
            <div class="search-area">
                <input type="text" id="${viewId}-search-input" placeholder="${placeholder}">
                <button class="btn primary" id="${viewId}-search-button">Buscar</button>
            </div>
        `;
    }

    view.innerHTML = `
        <div class="crud-header">
            <h3>Gerenciar ${entityName}s</h3>
            ${(showNewButton && entityName !== 'Cliente' && entityName !== 'Funcionário') ? `
            <button class="btn primary" onclick="showForm('${viewId}', 'create')">
                <i class="fas fa-plus"></i> Novo ${entityName}
            </button>` : ''}
        </div>
        
        ${searchBarHtml} 
        
        <div class="card">
            <h4>Lista de ${entityName}s</h4>
            <table class="data-table" id="${viewId}-table">
                <thead>
                    ${getTableHeader(entityName)}
                </thead>
                <tbody>
                    <tr><td colspan="8" style="text-align:center;">Carregando dados...</td></tr>
                </tbody>
            </table>
        </div>
    `;

    if (filterParamName) {
        document.getElementById(`${viewId}-search-button`).addEventListener('click', () => {
            const searchTerm = document.getElementById(`${viewId}-search-input`).value;
            fetchDataAndRenderTable(viewId, endpoint, filterParamName, searchTerm);
        });
        
        document.getElementById(`${viewId}-search-input`).addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                document.getElementById(`${viewId}-search-button`).click();
            }
        });
    }

    fetchDataAndRenderTable(viewId, endpoint, null, null);
}

/**
 * Busca dados e renderiza a tabela
 */
async function fetchDataAndRenderTable(viewId, endpoint, filterParamName, searchTerm) {
    const tableBody = document.querySelector(`#${viewId} .data-table tbody`);
    if (!tableBody) return;
    tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Buscando...</td></tr>';

    let url = endpoint;
    if (filterParamName && searchTerm) {
        url += `?${filterParamName}=${encodeURIComponent(searchTerm)}`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorMsg = response.status === 404 
                ? `API não encontrada (${url}).`
                : `Erro no servidor (${response.status})`;
            tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: red;">${errorMsg}</td></tr>`;
            return;
        }
        
        const data = await response.json();
        tableBody.innerHTML = getTableRows(viewId.replace('-view', ''), data);
    } catch (error) {
        console.error(`Falha ao buscar ${viewId}:`, error);
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: red;">Falha de rede ao buscar ${url}.</td></tr>`;
    }
}

/**
 * Gera o cabeçalho da tabela baseado na Entidade e no Perfil
 */
function getTableHeader(entityName) {
    if (entityName === 'Cliente') {
        return `<tr><th>ID</th><th>Nome</th><th>CPF</th><th>Telefone</th><th>Email</th><th>Ações</th></tr>`;
    } else if (entityName === 'Funcionário') {
        return `<tr><th>ID</th><th>Nome</th><th>Cargo</th><th>Admissão</th><th>Salário</th><th>Ações</th></tr>`;
    } else if (entityName === 'Carro') {
         if (currentUserRole === 'CLIENTE') {
             return `<tr><th>ID</th><th>Modelo</th><th>Ano</th><th>Cor</th><th>KM</th><th>Status</th><th>Ações</th></tr>`;
         }
         return `<tr><th>ID</th><th>Modelo</th><th>Placa</th><th>Ano</th><th>Cor</th><th>KM</th><th>Status</th><th>Ações</th></tr>`;
    } else if (entityName === 'Contrato') {
         if (currentUserRole === 'CLIENTE') {
             return `<tr><th>ID Contrato</th><th>Carro</th><th>Início</th><th>Fim Prev.</th><th>Valor Total</th><th>Status</th><th>Ações</th></tr>`;
         }
         return `<tr><th>ID Contrato</th><th>Cliente</th><th>Carro</th><th>Início</th><th>Fim Prev.</th><th>Valor Total</th><th>Status</th><th>Ações</th></tr>`;
    }
    return '';
}

/**
 * Gera as linhas da tabela
 */
function getTableRows(entityName, data) {
    entityName = entityName.replace('s-view', '').replace('s', '');

    if (!data || data.length === 0) return `<tr><td colspan="8" style="text-align:center;">Nenhum registro encontrado.</td></tr>`;
    
    let html = '';
    
    data.forEach(item => {
        let cells = '';
        let actions = ''; 

        let entityId = item.id || item.id_cliente || item.idFuncionarios || item.idCarro || item.idContrato;
        
        // --- Botões de Ação Genéricos ---
        
        if (entityName === 'cliente' || entityName === 'funcionario' || entityName === 'carro') {
            const idParaAcao = entityName === 'cliente' ? item.id_cliente : entityId;
            actions += `<button class="btn small view-details" onclick="showForm('${entityName}s-view', 'view', ${idParaAcao})"><i class="fas fa-eye"></i></button>`;
        }
        
        if (currentUserRole === 'GERENTE' || currentUserRole === 'FUNCIONARIO') {
            if (entityName !== 'contrato') {
                 const idParaAcao = entityName === 'cliente' ? item.id_cliente : entityId;
                 actions += `<button class="btn small edit" onclick="showForm('${entityName}s-view', 'edit', ${idParaAcao})"><i class="fas fa-edit"></i></button>`;
            }
        }
        
        if (currentUserRole === 'GERENTE') {
            if (entityName !== 'contrato') {
                const idParaAcao = entityName === 'cliente' ? item.id_cliente : entityId;
                if (actions) actions += ' '; 
                
                let deleteName = entityName;
                if (entityName === 'funcionário') deleteName = 'funcionario';
                
                actions += `<button class="btn small delete" onclick="confirmDelete(${idParaAcao}, '${deleteName}')"><i class="fas fa-trash"></i></button>`;
            }
        }

        // --- Fallback Visualização Carro (para Cliente) ---
        if (actions === '') {
            if (entityName === 'carro' && currentUserRole === 'CLIENTE') {
                const statusTxt = item.status ? 'Disponível' : 'Alugado';
                const statusClass = item.status ? 'available' : 'rented';
                actions = `<span class="status-badge ${statusClass}">${statusTxt}</span>`;
            } else {
                actions = `<span style="color: var(--secondary-color);"><i>Visualização</i></span>`;
            }
        }
        
        // --- Renderização das Colunas por Entidade ---
        
        if (entityName === 'cliente') {
            cells = `<td>${item.id_cliente}</td>
                     <td>${item.pessoa?.nome || 'N/D'}</td>
                     <td>${item.pessoa?.CPF || 'N/D'}</td>
                     <td>${item.pessoa?.telefone1 || 'N/D'}</td>
                     <td>${item.pessoa?.email || 'N/D'}</td>`;
        
        } else if (entityName === 'funcionario') {
            const salario = item.salario || 0;
            const salarioFormatado = salario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            const admissao = item.dataAdmissao ? new Date(item.dataAdmissao).toLocaleDateString('pt-BR') : 'N/D';
            
            cells = `<td>${item.idFuncionarios}</td><td>${item.pessoa?.nome || 'N/D'}</td><td>${item.cargo}</td><td>${admissao}</td><td>${salarioFormatado}</td>`;
        
        } else if (entityName === 'carro') {
            const statusTxt = item.status ? 'Disponível' : 'Alugado';
            const statusColor = item.status ? 'var(--success-color)' : 'var(--danger-color)';
            const statusStyle = `style="color: ${statusColor}; font-weight: bold;"`;
            
            if (currentUserRole === 'CLIENTE') {
                cells = `
                    <td>${item.idCarro}</td>
                    <td>${item.nome}</td>
                    <td>${item.anoFabricacao}</td>
                    <td>${item.cor}</td>
                    <td>${item.quilometragem}</td>
                    <td ${statusStyle}>${statusTxt}</td>`;
            } else {
                cells = `
                    <td>${item.idCarro}</td>
                    <td>${item.nome}</td>
                    <td>${item.placa}</td>
                    <td>${item.anoFabricacao}</td>
                    <td>${item.cor}</td>
                    <td>${item.quilometragem}</td>
                    <td ${statusStyle}>${statusTxt}</td>`;
            }
        
        } else if (entityName === 'contrato') {
             // ========================================================
             // LÓGICA DO SEMÁFORO (CORES DE FUNDO) PARA CONTRATOS
             // ========================================================
             const valor = item.valorTotal || 0;
             const valorFormatado = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
             const dtInicio = item.dataInicio ? new Date(item.dataInicio).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'N/D';
             const dtFim = item.dataFim ? new Date(item.dataFim).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'N/D';
             
             let rowStyle = ''; // Define a cor do FUNDO da linha (tr)
             let statusTxt = item.statusContrato || 'ATIVO';
             let statusStyle = ''; // Define a cor do TEXTO do status

             // Só aplicamos a cor de alerta se o contrato ainda estiver ATIVO
             if (statusTxt === 'ATIVO' && item.dataFim) {
                 const hoje = new Date();
                 hoje.setHours(0, 0, 0, 0); // Zera hoje para meia-noite

                 let dataEntrega;
                 
                 // Lógica de Data Robusta para corrigir bugs de Fuso Horário
                 if (typeof item.dataFim === 'string') {
                     // 1. Remove a parte da hora (tudo depois do T), ficando apenas "yyyy-MM-dd"
                     const dataLimpa = item.dataFim.split('T')[0];
                     const partesData = dataLimpa.split('-');
                     
                     // 2. Cria a data usando o construtor local (Ano, Mês-1, Dia)
                     dataEntrega = new Date(partesData[0], partesData[1] - 1, partesData[2]);
                 
                 } else if (typeof item.dataFim === 'number') {
                     // Caso venha como Timestamp
                     dataEntrega = new Date(item.dataFim);
                 } else {
                     // Fallback
                     dataEntrega = new Date(item.dataFim);
                 }
                 
                 // Garante que a data de entrega também seja meia-noite
                 dataEntrega.setHours(0, 0, 0, 0);

                 if (hoje.getTime() > dataEntrega.getTime()) {
                     // Passou da data: FUNDO VERMELHO CLARO
                     rowStyle = 'style="background-color: #ffe6e6;"'; 
                     statusTxt = 'ATRASADO';
                     statusStyle = 'style="color: #dc3545; font-weight: bold;"'; 
                 } else if (hoje.getTime() === dataEntrega.getTime()) {
                     // É hoje: FUNDO AMARELO CLARO
                     rowStyle = 'style="background-color: #fff3cd;"'; 
                     statusTxt = 'ENTREGA HOJE';
                     statusStyle = 'style="color: #856404; font-weight: bold;"'; // Texto escuro para contraste
                 } else {
                     // Futuro: FUNDO PADRÃO (Branco/Transparente)
                     rowStyle = ''; 
                     statusStyle = 'style="color: #28a745; font-weight: bold;"'; // Texto verde
                 }
             } else if (statusTxt === 'CONCLUIDO') {
                 // Se concluído: FUNDO CINZA
                 rowStyle = 'style="background-color: #f0f0f0;"';
                 statusStyle = 'style="color: #6c757d;"';
             }
             
             // Lógica do Checkbox
             if (currentUserRole === 'GERENTE' || currentUserRole === 'FUNCIONARIO') {
                 const isConcluido = (item.statusContrato === 'CONCLUIDO');
                 if (isConcluido) {
                     // Garante fundo cinza se já estiver marcado
                     rowStyle = 'style="background-color: #f0f0f0;"'; 
                     actions = `<input type="checkbox" checked disabled>`;
                 } else {
                     actions = `<input type="checkbox" onchange="handleConcluirContrato(this, ${item.idContrato})">`;
                 }
             } else {
                 actions = `<span style="color: var(--secondary-color);"><i>Visualização</i></span>`;
             }
             
             // Aplica statusStyle na célula correta
             if (currentUserRole === 'CLIENTE') {
                 cells = `<td>${item.idContrato}</td><td>${item.carroNome || 'N/D'}</td><td>${dtInicio}</td><td>${dtFim}</td><td>${valorFormatado}</td><td ${statusStyle}>${statusTxt}</td>`;
             } else {
                 cells = `<td>${item.idContrato}</td><td>${item.clienteNome || 'N/D'}</td><td>${item.carroNome || 'N/D'}</td><td>${dtInicio}</td><td>${dtFim}</td><td>${valorFormatado}</td><td ${statusStyle}>${statusTxt}</td>`;
             }
             
             // Aplica rowStyle na tag <tr>
             html += `<tr ${rowStyle}>${cells}<td>${actions}</td></tr>`;
             return; // Retorna para evitar duplicidade
        }
        
        html += `<tr>${cells}<td>${actions}</td></tr>`;
    });
    return html;
}