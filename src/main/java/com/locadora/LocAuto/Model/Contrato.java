package com.locadora.LocAuto.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType; // <-- IMPORTAÇÃO ADICIONADA
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
    private Integer idContrato; // Corrigido para camelCase

    @Column(name = "data_inicio")
    private Date dataInicio;
    
    @Column(name = "data_fim")
    private Date dataFim;
    
    @Column(name = "valor_total", precision = 10, scale = 2)
    private BigDecimal valorTotal;

    // --- Relações FK conforme script SQL ---
    
    // CORREÇÃO: Adicionado FetchType.LAZY para evitar que o Hibernate
    // tente carregar o Funcionario (o que o user_cliente não pode fazer).
    @ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name = "fk_id_funcionario", referencedColumnName = "id_funcionarios")
    private Funcionario funcionario;
    
    // CORREÇÃO: Adicionado FetchType.LAZY
    @ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name = "fk_id_carro", referencedColumnName = "id_carro")
    private Carro carro;
    
    // CORREÇÃO: Adicionado FetchType.LAZY
    @ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name = "fk_id_usuario_cliente", referencedColumnName = "id_usuario")
    private Usuario usuarioCliente;


    public Contrato() {
    }

    // Getters and Setters (corrigidos para camelCase)
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