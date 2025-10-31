package com.locadora.LocAuto.Model;


import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;


@Entity
@Table (name = "tb_cliente")
public class Cliente { 
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_cliente; 
    
    @OneToOne(cascade = {CascadeType.MERGE, CascadeType.PERSIST})  
  @JoinColumn(name = "fk_id_pessoa", referencedColumnName = "Id", nullable = false) 
    private Pessoa pessoa;

    public void setId_cliente(Integer id_cliente) {
        this.id_cliente = id_cliente;
    }

    public Cliente() {
    }
    
    public Cliente(Pessoa pessoa) {
        this.pessoa = pessoa;
    }


    
    public Integer getId_cliente() {
        return id_cliente;
    }

    public Pessoa getPessoa() {
        return pessoa;
    }

    public void setPessoa(Pessoa pessoa) {
        this.pessoa = pessoa; 
    }

}