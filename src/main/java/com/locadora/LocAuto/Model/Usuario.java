package com.locadora.LocAuto.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "tb_usuarios")

public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_usuario;

    @Column(length = 255, nullable = false, unique = true)
    private String login;

    @Column(length = 255, nullable = false)
    private String senha;

    @OneToOne
    @JoinColumn(name = "fk_id_pessoa", referencedColumnName = "Id")
    private Pessoa pessoa;

    @ManyToOne
    @JoinColumn(name = "fk_id_grupo", referencedColumnName = "id_grupo")
    private GrupoUsuario grupo;


    public Usuario(){

    }
    public Integer getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(Integer id_usuario) {
        this.id_usuario = id_usuario;
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

    public GrupoUsuario getGrupo() {
        return grupo;
    }

    public void setGrupo(GrupoUsuario grupo) {
        this.grupo = grupo;
    }

    public Usuario(Integer id_usuario, String login, String senha, Pessoa pessoa, GrupoUsuario grupo) {
        this.id_usuario = id_usuario;
        this.login = login;
        this.senha = senha;
        this.pessoa = pessoa;
        this.grupo = grupo;
    }
}
