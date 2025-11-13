// =================================================================
// DASHBOARD.JS - Funções do Dashboard e KPIs
// =================================================================

let graficoFrota = null;

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
        
        document.getElementById('kpi-carros-disponiveis').innerText = data.carrosDisponiveis;
        document.getElementById('kpi-carros-alugados').innerText = data.carrosAlugados;
        document.getElementById('kpi-contratos-ativos').innerText = data.contratosAtivos; 
        
        if (currentUserRole !== 'CLIENTE') {
            document.getElementById('kpi-clientes').innerText = data.clientesCadastrados;
        }

        renderDashboardCharts(data);
        
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        document.getElementById('kpi-carros-disponiveis').innerText = '-';
        document.getElementById('kpi-carros-alugados').innerText = '-';
        document.getElementById('kpi-contratos-ativos').innerText = '-';
    }
}

/**
 * Renderiza os gráficos do dashboard
 */
function renderDashboardCharts(data) {
    const ctx = document.getElementById('graficoFrota').getContext('2d');
    if (graficoFrota) {
        graficoFrota.destroy();
    }
    graficoFrota = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Disponíveis', 'Alugados'],
            datasets: [{
                label: 'Status da Frota',
                data: [data.carrosDisponiveis, data.carrosAlugados],
                backgroundColor: ['rgba(0, 123, 255, 0.7)', 'rgba(108, 117, 125, 0.7)'],
                borderColor: ['rgba(0, 123, 255, 1)', 'rgba(108, 117, 125, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } }
        }
    });
}
