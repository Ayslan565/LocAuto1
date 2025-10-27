package com.locadora.LocAuto.Model;

import java.util.Date;

public class Cliente extends Pessoa{
    private int id_cliente;
    private int fk_idPessoa;

    public Cliente(int id_cliente, int id, String CPF, String nome, Date data_nascimento, String endereco, String email) {
        super(id, CPF, nome, data_nascimento, endereco, email);
        this.fk_idPessoa = id;
        this.id_cliente = id_cliente;
    }

        
    

}
