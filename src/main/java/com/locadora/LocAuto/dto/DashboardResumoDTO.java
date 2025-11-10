package com.locadora.LocAuto.dto;

public class DashboardResumoDTO {
    
    private long carrosDisponiveis;
    private long carrosAlugados;
    private long clientesCadastrados;
    private long contratosAtivos;

    public DashboardResumoDTO(long carrosDisponiveis, long carrosAlugados, long clientesCadastrados, long contratosAtivos) {
        this.carrosDisponiveis = carrosDisponiveis;
        this.carrosAlugados = carrosAlugados;
        this.clientesCadastrados = clientesCadastrados;
        this.contratosAtivos = contratosAtivos;
    }

    public long getCarrosDisponiveis() {
        return carrosDisponiveis;
    }
    public long getCarrosAlugados() {
        return carrosAlugados;
    }
    public long getClientesCadastrados() {
        return clientesCadastrados;
    }
    public long getContratosAtivos() {
        return contratosAtivos;
    }
}       