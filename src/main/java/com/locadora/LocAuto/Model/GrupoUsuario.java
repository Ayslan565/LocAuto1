package com.locadora.LocAuto.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_grupos_usuarios")
public class GrupoUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_grupo")
    private Integer id;

    @Column(name = "nome_grupo", unique = true, nullable = false, length = 50)
    private String nomeGrupo;

    @Column(name = "descricao", columnDefinition = "TEXT")
    private String descricao;

    // Construtores
    public GrupoUsuario() {}

    public GrupoUsuario(Integer id, String nomeGrupo, String descricao) {
        this.id = id;
        this.nomeGrupo = nomeGrupo;
        this.descricao = descricao;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNomeGrupo() {
        return nomeGrupo;
    }

    public void setNomeGrupo(String nomeGrupo) {
        this.nomeGrupo = nomeGrupo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}