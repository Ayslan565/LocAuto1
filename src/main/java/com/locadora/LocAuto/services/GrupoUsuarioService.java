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
    
    public Optional<GrupoUsuario> buscarPorNome(String nome) {
        return repositorioGrupoUsuario.findByNomeGrupo(nome);
    }

    public GrupoUsuario salvar(GrupoUsuario grupo) {
        return repositorioGrupoUsuario.save(grupo);
    }
}