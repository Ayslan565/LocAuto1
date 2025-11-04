package com.locadora.LocAuto.dto;

import com.locadora.LocAuto.Model.Pessoa;

// DTO que mapeia exatamente o JSON enviado pelo cadastro.js
public class ClienteCadastroDTO {

    private Integer idCliente; 

    // Mapeia o objeto "pessoa" que vem aninhado no JSON
    private Pessoa pessoa; 

    // Mapeia o "login" do campo de acesso
    private String login; 
    
    // Mapeia a "senhaPura" para criptografia
    private String senhaPura; 

    public ClienteCadastroDTO() {
    }

    // --- GETTERS e SETTERS ---

    public Integer getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Integer idCliente) {
        this.idCliente = idCliente;
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
}