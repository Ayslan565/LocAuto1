package com.locadora.LocAuto.Model;
import java.util.Date;

public class Funcionario extends Pessoa {
    private  int id_funcionario;
    private Date Data_Admissao;
    private String Cargo;
    float Salario;


    public Funcionario(int id, String CPF, String nome, Date data_nascimento, String endereco, String email) {
        super(id, CPF, nome, data_nascimento, endereco, email);

    }

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

    public Funcionario(int id, String CPF, String nome, Date data_nascimento, String endereco, String email, int id_funcionario, Date data_Admissao, String cargo, float salario) {
        super(id, CPF, nome, data_nascimento, endereco, email);
        this.id_funcionario = id_funcionario;
        Data_Admissao = data_Admissao;
        Cargo = cargo;
        Salario = salario;
    }
};
