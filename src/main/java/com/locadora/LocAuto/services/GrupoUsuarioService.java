package com.locadora.LocAuto.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.locadora.LocAuto.Model.GrupoUsuario;
import com.locadora.LocAuto.repositorio.repositorioGrupoUsuario;

@Service
public class GrupoUsuarioService {

    @Autowired
    private repositorioGrupoUsuario repositorioGrupoUsuario;

    public List<GrupoUsuario> listarTodos() {
        return repositorioGrupoUsuario.findAll();
    }

    public Optional<GrupoUsuario> buscarPorId(Integer id) {
        return repositorioGrupoUsuario.findById(id);
    }
    
    /**
     * Busca um GrupoUsuario pelo nome do grupo (ex: "CLIENTE" ou "GERENTE").
     * Este método é crucial para o cadastro de novos usuários.
     * @param nome O nome do grupo a ser buscado.
     * @return Um Optional contendo o GrupoUsuario, se encontrado.
     */
    public Optional<GrupoUsuario> buscarPorNome(String nome) {
        return repositorioGrupoUsuario.findByNomeGrupo(nome);
    }

    public GrupoUsuario salvar(GrupoUsuario grupo) {
        return repositorioGrupoUsuario.save(grupo);
    }
}