package com.locadora.LocAuto.Model;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
@Entity

@Table (name = "tb_cliente")
public class Cliente extends Pessoa{

    private Integer id_cliente;


    public Cliente(Integer id_cliente) {
        this.id_cliente = id_cliente;
    }


    public Integer getId_cliente() {
        return id_cliente;
    }

    public void setId_cliente(Integer id_cliente) {
        this.id_cliente = id_cliente;
    }

    public Cliente(Integer id, String CPF, String nome, Date data_nasc, String cep, String municipio, String uf, String complemento, String Email, String telefone1, String telefone2, String endereco, Integer id_cliente) {
        super(id, CPF, nome, data_nasc, cep, municipio, uf, complemento, Email, telefone1, telefone2, endereco);
        this.id_cliente = id_cliente;
    }

}