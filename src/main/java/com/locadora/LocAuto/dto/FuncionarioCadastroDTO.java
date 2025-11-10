package com.locadora.LocAuto.dto;

import com.locadora.LocAuto.Model.Pessoa;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;

// DTO que mapeia os dados do cadastro de Funcionário/Gerente
public class FuncionarioCadastroDTO {

    // --- Dados da Entidade Funcionario ---
    private Integer id_funcionario;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date data_admissao;
    
    private String cargo;
    private Double salario; // Usamos Double aqui para mapear corretamente o número do JS
    
    // --- Dados Comuns (Requisito de Cadastro) ---
    private Pessoa pessoa;
    private String login;
    private String senhaPura;
    private String tipoCadastro; // Usado para mapear para "FUNCIONARIO" ou "GERENTE" no BD

    // Construtor Vazio (Necessário para a desserialização do JSON pelo Spring/Jackson)
    public FuncionarioCadastroDTO() {
    }

    // --- Getters e Setters ---

    public Integer getId_funcionario() {
        return id_funcionario;
    }

    public void setId_funcionario(Integer id_funcionario) {
        this.id_funcionario = id_funcionario;
    }

    public Date getData_admissao() {
        return data_admissao;
    }

    public void setData_admissao(Date data_admissao) {
        this.data_admissao = data_admissao;
    }

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }

    public Double getSalario() {
        return salario;
    }

    public void setSalario(Double salario) {
        this.salario = salario;
    }

    public Pessoa getPessoa() {
        return pessoa;
    }

    public void setPessoa(Pessoa pessoa) {
        this.pessoa = pessoa;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getSenhaPura() {
        return senhaPura;
    }

    public void setSenhaPura(String senhaPura) {
        this.senhaPura = senhaPura;
    }

    public String getTipoCadastro() {
        return tipoCadastro;
    }

    public void setTipoCadastro(String tipoCadastro) {
        this.tipoCadastro = tipoCadastro;
    }
}