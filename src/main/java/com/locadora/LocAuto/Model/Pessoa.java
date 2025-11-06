package com.locadora.LocAuto.Model;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue; // Adicionado
import jakarta.persistence.GenerationType; // Adicionado
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.Table;
import jakarta.persistence.InheritanceType;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table (name = "tb_pessoa")

@Inheritance(strategy = InheritanceType.JOINED)
public class Pessoa {
@Id 
@GeneratedValue(strategy = GenerationType.IDENTITY) // NOVO: Geração automática de ID pelo BD
@Column(name = "id_pessoa") 
protected Integer Id;

    // --- Campos do banco de dados (tb_pessoa) ---

    @Column(length = 14) 
    @JsonProperty("CPF")
    protected String cpf;

    @Column(length = 100)
    protected String nome;

    @JsonFormat(pattern = "yyyy-MM-dd")
    protected Date data_nasc;

    @Column(length = 10) // CEP tem 8 dígitos + hífen
    protected String cep;

    @Column(length = 50)
    protected String municipio;

    @Column(length = 2) // UF tem 2 letras
    protected String uf;

    @Column(length = 100)
    protected String complemento;

    @Column(length = 100)
    protected String email;

    @Column(name = "telefone1", length = 15) 
    protected String telefone1;

    @Column(name = "telefone2", length = 15)
    protected String telefone2;

    @Column(length = 255)
    protected String endereco;

    // --- Construtores ---

    public Pessoa() {
    }
    public Pessoa(Integer id, String cpf, String nome, Date data_nasc, String cep, String municipio, String uf,
                  String complemento, String email, String telefone1, String telefone2, String endereco) {
        this.Id = id;
        this.cpf = cpf;
        this.nome = nome;
        this.data_nasc = data_nasc;
        this.cep = cep;
        this.municipio = municipio;
        this.uf = uf;
        this.complemento = complemento;
        this.email = email;
        this.telefone1 = telefone1;
        this.telefone2 = telefone2;
        this.endereco = endereco;
    }

    // --- Getters e Setters
    public Integer getId() {
        return Id;
    }   

    public void setId(Integer id) {
        Id = id;
    }

    public String getcpf() {
        return cpf;
    }

    public void setcpf(String cpf) {
        this.cpf = cpf;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Date getData_nasc() {
        return data_nasc;
    }

    public void setData_nasc(Date data_nasc) {
        this.data_nasc = data_nasc;
    }

    public String getCep() {
        return cep;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }

    public String getMunicipio() {
        return municipio;
    }

    public void setMunicipio(String municipio) {
        this.municipio = municipio;
    }

    public String getUf() {
        return uf;
    }

    public void setUf(String uf) {
        this.uf = uf;
    }

    public String getComplemento() {
        return complemento;
    }

    public void setComplemento(String complemento) {
        this.complemento = complemento;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone1() {
        return telefone1;
    }

    public void setTelefone1(String telefone1) {
        this.telefone1 = telefone1;
    }

    public String getTelefone2() {
        return telefone2;
    }

    public void setTelefone2(String telefone2) {
        this.telefone2 = telefone2;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    @Override
    public String toString() {
        return "Pessoa{" +
                "Id=" + Id +
                ", cpf='" + cpf + '\'' +
                ", nome='" + nome + '\'' +
                ", data_nasc=" + data_nasc +
                ", cep='" + cep + '\'' +
                ", municipio='" + municipio + '\'' +
                ", uf='" + uf + '\'' +
                ", complemento='" + complemento + '\'' +
                ", email='" + email + '\'' +
                ", telefone1='" + telefone1 + '\'' +
                ", telefone2='" + telefone2 + '\'' +
                ", endereco='" + endereco + '\'' +
                '}';
    }
}