package com.locadora.LocAuto.Model;


import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_grupos_usuarios")
public class GrupoUsuario {
    @Id
    private  Integer id_grupo;

    @Column(name = "nome_grupo", length = 50, nullable = false, unique = true)
    private String nomeGrupo;

    @Column(name = "descricao", columnDefinition = "Text")
    private String descricao;


    public GrupoUsuario(String descricao, String nomeGrupo, Integer id_grupo) {
        this.descricao = descricao;
        this.nomeGrupo = nomeGrupo;
        this.id_grupo = id_grupo;
    }

    public Integer getId_grupo() {
        return id_grupo;
    }

    public void setId_grupo(Integer id_grupo) {
        this.id_grupo = id_grupo;
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

    public GrupoUsuario(Integer id_grupo, String nomeGrupo, String descricao) {
        this.id_grupo = id_grupo;
        this.nomeGrupo = nomeGrupo;
        this.descricao = descricao;
    }

    public GrupoUsuario() {
    }

    public void adicionarInfGrupoUsuario(GrupoUsuario grupoUsuario) {
        throw new UnsupportedOperationException("Unimplemented method 'adicionarInfGrupoUsuario'");
    }

    public GrupoUsuario salvar(GrupoUsuario grupoUsuario) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'salvar'");
    }

    public List<GrupoUsuario> listarTodos() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'listarTodos'");
    }

}
