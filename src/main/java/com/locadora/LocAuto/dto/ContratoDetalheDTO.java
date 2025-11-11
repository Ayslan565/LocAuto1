package com.locadora.LocAuto.dto;

import java.math.BigDecimal;
import java.util.Date;

public class ContratoDetalheDTO {
    private Integer idContrato;
    private Date dataInicio;
    private Date dataFim;
    private BigDecimal valorTotal;
    private String statusContrato;
    private String clienteNome;
    private String carroNome;

    public ContratoDetalheDTO(Integer idContrato, Date dataInicio, Date dataFim, BigDecimal valorTotal, String statusContrato, String clienteNome, String carroNome) {
        this.idContrato = idContrato;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.valorTotal = valorTotal;
        this.statusContrato = statusContrato;
        this.clienteNome = clienteNome;
        this.carroNome = carroNome;
    }

    public Integer getIdContrato() { return idContrato; }
    public Date getDataInicio() { return dataInicio; }
    public Date getDataFim() { return dataFim; }
    public BigDecimal getValorTotal() { return valorTotal; }
    public String getStatusContrato() { return statusContrato; }
    public String getClienteNome() { return clienteNome; }
    public String getCarroNome() { return carroNome; }

    public void setIdContrato(Integer idContrato) { this.idContrato = idContrato; }
    public void setDataInicio(Date dataInicio) { this.dataInicio = dataInicio; }
    public void setDataFim(Date dataFim) { this.dataFim = dataFim; }
    public void setValorTotal(BigDecimal valorTotal) { this.valorTotal = valorTotal; }
    public void setStatusContrato(String statusContrato) { this.statusContrato = statusContrato; }
    public void setClienteNome(String clienteNome) { this.clienteNome = clienteNome; }
    public void setCarroNome(String carroNome) { this.carroNome = carroNome; }
}