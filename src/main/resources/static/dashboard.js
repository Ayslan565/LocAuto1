// =================================================================
// DASHBOARD.JS - Funções do Dashboard e KPIs (Atualizado)
// =================================================================

let graficoFrota = null;
let graficoContratos = null; // Variável para o segundo gráfico

/**
 * Carrega os KPIs e Gráficos do Dashboard
 */
async function loadDashboardData() {
    const kpiClientesCard = document.getElementById('kpi-clientes-card');
    
    // Oculta card de clientes para o perfil CLIENTE (não relevante para ele)
    if (currentUserRole === 'CLIENTE') {
        if (kpiClientesCard) kpiClientesCard.style.display = 'none';
    } else {
        if (kpiClientesCard) kpiClientesCard.style.display = 'flex'; 
    }
    
    try {
        const response = await fetch('/api/dashboard/resumo');
        if (!response.ok) throw new Error('Falha ao buscar resumo.');
        const data = await response.json();
        
        // --- Preenchimento dos KPIs de Frota ---
        document.getElementById('kpi-carros-disponiveis').innerText = data.carrosDisponiveis;
        document.getElementById('kpi-carros-alugados').innerText = data.carrosAlugados;
        
        // --- Preenchimento dos KPIs de Contratos Separados ---
        // Card Azul: Apenas contratos ativos
        document.getElementById('kpi-contratos-ativos').innerText = data.contratosAtivos;
        
        // Card Verde: Apenas contratos concluídos (inativos)
        // Certifique-se de que o ID no HTML é 'kpi-contratos-concluidos'
        const kpiConcluidos = document.getElementById('kpi-contratos-concluidos');
        if (kpiConcluidos) {
            kpiConcluidos.innerText = data.contratosInativos;
        }
        
        // --- Preenchimento do KPI de Clientes ---
        if (currentUserRole !== 'CLIENTE') {
            document.getElementById('kpi-clientes').innerText = data.clientesCadastrados;
        }

        renderDashboardCharts(data);
        
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        // Fallback visual em caso de erro
        const ids = ['kpi-carros-disponiveis', 'kpi-carros-alugados', 'kpi-contratos-ativos', 'kpi-contratos-concluidos'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if(el) el.innerText = '-';
        });
    }
}

/**
 * Renderiza os gráficos do dashboard
 */
function renderDashboardCharts(data) {
    // --- GRÁFICO 1: FROTA (Doughnut) ---
    const ctxFrota = document.getElementById('graficoFrota').getContext('2d');
    
    if (graficoFrota) {
        graficoFrota.destroy();
    }
    
    graficoFrota = new Chart(ctxFrota, {
        type: 'doughnut',
        data: {
            labels: ['Disponíveis', 'Alugados'],
            datasets: [{
                data: [data.carrosDisponiveis, data.carrosAlugados],
                // Azul Primário e Cinza Escuro
                backgroundColor: ['#007bff', '#6c757d'], 
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } }
        }
    });

    // --- GRÁFICO 2: CONTRATOS (Pie) ---
    const ctxContratos = document.getElementById('graficoContratos').getContext('2d');
    
    if (graficoContratos) {
        graficoContratos.destroy();
    }

    graficoContratos = new Chart(ctxContratos, {
        type: 'pie',
        data: {
            labels: ['Ativos', 'Concluídos'],
            datasets: [{
                data: [data.contratosAtivos, data.contratosInativos],
                // Azul (Ativo) e Verde (Concluído) para combinar com os cards
                backgroundColor: ['#007bff', '#28a745'], 
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
                legend: { position: 'bottom' },
                title: { 
                    display: true, 
                    text: (currentUserRole === 'CLIENTE' ? 'Meus Contratos' : 'Volume de Contratos') 
                }
            }
        }
    });
}