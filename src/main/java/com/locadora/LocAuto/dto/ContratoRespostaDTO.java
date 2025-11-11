package com.locadora.LocAuto.dto;

public class ContratoRespostaDTO {
    
    private Integer idContrato;
    private String statusContrato;

    // 1. Construtor vazio (necessário para o Spring)
    public ContratoRespostaDTO() {
    }

    // 2. O CONSTRUTOR QUE FALTAVA (Integer, String)
    public ContratoRespostaDTO(Integer idContrato, String statusContrato) {
        this.idContrato = idContrato;
        this.statusContrato = statusContrato;
    }

    // 3. Getters e Setters (necessários para o Jackson converter em JSON)
    public Integer getIdContrato() {
        return idContrato;
    }

    public void setIdContrato(Integer idContrato) {
        this.idContrato = idContrato;
    }

    public String getStatusContrato() {
        return statusContrato;
    }

    public void setStatusContrato(String statusContrato) {
        this.statusContrato = statusContrato;
    }
}