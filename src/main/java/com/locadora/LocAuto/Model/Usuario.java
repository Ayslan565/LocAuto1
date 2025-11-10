package com.locadora.LocAuto.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer id;

    @Column(name = "login", unique = true, nullable = false, length = 255)
    private String login;

    @Column(name = "senha", nullable = false, length = 255)
    private String senha; // Armazena a senha criptografada (BCrypt)

    // Ligação com tb_pessoa (FK)
    @OneToOne
    @JoinColumn(name = "fk_id_pessoa", referencedColumnName = "id_pessoa", nullable = false)
    private Pessoa pessoa;

    // Ligação com tb_grupos_usuarios (FK)
    @OneToOne
    @JoinColumn(name = "fk_id_grupo", referencedColumnName = "id_grupo", nullable = false)
    private GrupoUsuario grupoUsuario;

    // Construtores
    public Usuario() {}

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public Pessoa getPessoa() {
        return pessoa;
    }

    public void setPessoa(Pessoa pessoa) {
        this.pessoa = pessoa;
    }

    public GrupoUsuario getGrupoUsuario() {
        return grupoUsuario;
    }

    public void setGrupoUsuario(GrupoUsuario grupoUsuario) {
        this.grupoUsuario = grupoUsuario;
    }
}