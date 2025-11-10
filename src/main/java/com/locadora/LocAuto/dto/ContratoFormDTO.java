package com.locadora.LocAuto.dto;

import java.util.Date;
import com.fasterxml.jackson.annotation.JsonFormat;

public class ContratoFormDTO {

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date dataInicio;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date dataFim;
    
    private Integer idCarro;
    private Integer idClienteUsuario; 

    public Date getDataInicio() {
        return dataInicio;
    }
    public void setDataInicio(Date dataInicio) {
        this.dataInicio = dataInicio;
    }
    public Date getDataFim() {
        return dataFim;
    }
    public void setDataFim(Date dataFim) {
        this.dataFim = dataFim;
    }
    public Integer getIdCarro() {
        return idCarro;
    }
    public void setIdCarro(Integer idCarro) {
        this.idCarro = idCarro;
    }
    public Integer getIdClienteUsuario() {
        return idClienteUsuario;
    }
    public void setIdClienteUsuario(Integer idClienteUsuario) {
        this.idClienteUsuario = idClienteUsuario;
    }
}