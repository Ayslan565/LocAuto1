package com.locadora.LocAuto.Model;
import java.util.Date;

import jakarta.persistence.Entity;
    import jakarta.persistence.Table;
@Entity
@Table (name = "tb_funcionario")
public class Funcionario extends Pessoa {
    
    private  int id_funcionario;
    private Date Data_Admissao;
    private String Cargo;
    float Salario;




    public int getId_funcionario() {
        return id_funcionario;
    }

    public void setId_funcionario(int id_funcionario) {
        this.id_funcionario = id_funcionario;
    }

    public Date getData_Admissao() {
        return Data_Admissao;
    }

    public void setData_Admissao(Date data_Admissao) {
        Data_Admissao = data_Admissao;
    }

    public String getCargo() {
        return Cargo;
    }

    public void setCargo(String cargo) {
        Cargo = cargo;
    }

    public float getSalario() {
        return Salario;
    }

    public void setSalario(float salario) {
        Salario = salario;
    }

    public Funcionario(Integer id, String CPF, String nome, Date data_nasc, String cep, String municipio, String uf, String complemento, String Email, String telefone1, String telefone2, String endereco, int id_funcionario, Date data_Admissao, String cargo, float salario) {
        super(id, CPF, nome, data_nasc, cep, municipio, uf, complemento, Email, telefone1, telefone2, endereco);
        this.id_funcionario = id_funcionario;
        Data_Admissao = data_Admissao;
        Cargo = cargo;
        Salario = salario;
    }
};
