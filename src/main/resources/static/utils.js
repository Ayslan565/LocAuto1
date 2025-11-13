// =================================================================
// UTILS.JS - Funções Utilitárias e Helpers
// =================================================================

let currentUserRole = null;

/**
 * Calcula o valor total estimado da locação no formulário
 */
window.calcularValorLocacao = () => {
    const inicioStr = document.getElementById('contrato-data-inicio').value;
    const fimStr = document.getElementById('contrato-data-fim').value;
    const valorInput = document.getElementById('contrato-valor-total');
    const taxaDiaria = 150.00;

    if (!inicioStr || !fimStr) {
        valorInput.value = '0,00';
        return;
    }

    try {
        const dataInicio = new Date(inicioStr);
        const dataFim = new Date(fimStr);
        
        // Zera as horas para cálculo de dias cheios
        dataInicio.setHours(0, 0, 0, 0);
        dataFim.setHours(0, 0, 0, 0);

        if (dataFim < dataInicio) {
            valorInput.value = 'Data Fim Inválida';
            return;
        }

        const diffTime = Math.abs(dataFim.getTime() - dataInicio.getTime());
        // Soma 1 dia para contar o dia da retirada também
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 

        const valorTotal = diffDays * taxaDiaria;
        
        valorInput.value = valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    } catch (e) {
        valorInput.value = 'Erro de Cálculo';
    }
};

/**
 * Helper para obter valor de um elemento por ID
 */
function getVal(id) {
    return document.getElementById(id).value || null;
}
