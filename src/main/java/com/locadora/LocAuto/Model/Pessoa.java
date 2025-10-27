package com.locadora.LocAuto.Model;

import java.util.Date;

public class Pessoa {
    protected int Id ;
    protected String CPF;
    protected String nome;
    protected Date Data_nascimento;
    protected String Endereco;
    protected String Email;

    public int getId() {
        return Id;
    }

    public void setId(int id) {
        Id = id;
    }

    public String getCPF() {
        return CPF;
    }

    public void setCPF(String CPF) {
        this.CPF = CPF;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Date getData_nascimento() {
        return Data_nascimento;
    }

    public void setData_nascimento(Date data_nascimento) {
        Data_nascimento = data_nascimento;
    }

    public String getEndereco() {
        return Endereco;
    }

    public void setEndereco(String endereco) {
        Endereco = endereco;
    }

    public String getEmail() {
        return Email;
    }

    public void setEmail(String email) {
        Email = email;
    }

    public Pessoa(int id, String CPF, String nome, Date data_nascimento, String endereco, String email) {
        Id = id;
        this.CPF = CPF;
        this.nome = nome;
        Data_nascimento = data_nascimento;
        Endereco = endereco;
        Email = email;
    }


    public String verPessoa() {
        return "Pessoa{" +
                "Id=" + Id +
                ", CPF='" + CPF + '\'' +
                ", nome='" + nome + '\'' +
                ", Data_nascimento=" + Data_nascimento +
                ", Endereco='" + Endereco + '\'' +
                ", Email='" + Email + '\'' +
                '}';
    }
}
