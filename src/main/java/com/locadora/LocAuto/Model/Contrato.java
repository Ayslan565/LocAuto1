package com.locadora.LocAuto.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

@Entity
@Table (name= "tb_contrato")
public class Contrato {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ID_Contrato;

    @ManyToOne
    @JoinColumn(name = "funcionario_id")
    private Funcionario funcionario;
    
    @ManyToOne
    @JoinColumn(name = "carro_id")
    private Carro carro;
    
    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    public Integer getID_Contrato() {
        return ID_Contrato;
    }
    
    public void setID_Contrato(Integer ID_Contrato) {
        this.ID_Contrato = ID_Contrato;
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

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Contrato() {
    }
}