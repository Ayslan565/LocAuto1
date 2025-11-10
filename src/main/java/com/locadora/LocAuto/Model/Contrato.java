package com.locadora.LocAuto.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType; 
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Column; 
import java.util.Date;
import java.math.BigDecimal;

@Entity
@Table (name= "tb_contrato")
public class Contrato {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    @Column(name = "id_contrato")
    private Integer idContrato; 

    @Column(name = "data_inicio")
    private Date dataInicio;
    
    @Column(name = "data_fim")
    private Date dataFim;
    
    @Column(name = "valor_total", precision = 10, scale = 2)
    private BigDecimal valorTotal;

    // CAMPO CRÍTICO: FALTA DESTE CAMPO CAUSOU O ERRO.
    @Column(name = "status_contrato")
    private String statusContrato;

    // --- Relações FK conforme script SQL ---
    
    @ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name = "fk_id_funcionario", referencedColumnName = "id_funcionarios")
    private Funcionario funcionario;
    
    @ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name = "fk_id_carro", referencedColumnName = "id_carro")
    private Carro carro;
    
    @ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name = "fk_id_usuario_cliente", referencedColumnName = "id_usuario")
    private Usuario usuarioCliente;


    public Contrato() {
    }

    // Getters and Setters
    public Integer getIdContrato() {
        return idContrato;
    }
    
    public void setIdContrato(Integer idContrato) {
        this.idContrato = idContrato;
    }

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

    public BigDecimal getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }

    // GETTER E SETTER NECESSÁRIOS PARA O SPRING DATA JPA
    public String getStatusContrato() {
        return statusContrato;
    }

    public void setStatusContrato(String statusContrato) {
        this.statusContrato = statusContrato;
    }

    public Funcionario getFuncionario() {
        return funcionario;
    }

    public void setFuncionario(Funcionario funcionario) {
        this.funcionario = funcionario;
    }

    public Carro getCarro() {
        return carro;
    }

    public void setCarro(Carro carro) {
        this.carro = carro;
    }

    public Usuario getUsuarioCliente() {
        return usuarioCliente;
    }

    public void setUsuarioCliente(Usuario usuarioCliente) {
        this.usuarioCliente = usuarioCliente;
    }
}