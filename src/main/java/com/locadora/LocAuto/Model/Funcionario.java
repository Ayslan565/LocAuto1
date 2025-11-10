package com.locadora.LocAuto.Model;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_funcionario")
public class Funcionario {
    
    // 1. Chave Primária própria da tabela tb_funcionario
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_funcionarios")
    private Integer idFuncionarios;
    
    // 2. Associação OneToOne com Pessoa (Chave Estrangeira)
    @OneToOne
    @JoinColumn(name = "fk_id_pessoa", referencedColumnName = "id_pessoa", nullable = false)
    private Pessoa pessoa;
    
    // 3. Campos Específicos do Funcionário (Corrigido para camelCase)
    @Column(name = "data_admissao", nullable = false)
    private Date dataAdmissao;
    
    @Column(name = "cargo", nullable = false)
    private String cargo;
    
    // Usar Double para evitar erros de precisão com float
    @Column(name = "salario", nullable = false)
    private Double salario;

    // Construtores
    public Funcionario() {
    }

    public Funcionario(Pessoa pessoa, Date dataAdmissao, String cargo, Double salario) {
        this.pessoa = pessoa;
        this.dataAdmissao = dataAdmissao;
        this.cargo = cargo;
        this.salario = salario;
    }

    // Getters and Setters (Herdado de Pessoa e local)
    
    // Getters e Setters da Chave Primária (idFuncionarios)
    public Integer getIdFuncionarios() {
        return idFuncionarios;
    }

    public void setIdFuncionarios(Integer idFuncionarios) {
        this.idFuncionarios = idFuncionarios;
    }
    
    // Getters e Setters da Associação (Pessoa)
    public Pessoa getPessoa() {
        return pessoa;
    }

    public void setPessoa(Pessoa pessoa) {
        this.pessoa = pessoa;
    }

    // Getters e Setters dos Atributos
    public Date getDataAdmissao() {
        return dataAdmissao;
    }

    public void setDataAdmissao(Date dataAdmissao) {
        this.dataAdmissao = dataAdmissao;
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
}