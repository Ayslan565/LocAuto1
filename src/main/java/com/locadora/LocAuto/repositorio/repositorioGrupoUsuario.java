package com.locadora.LocAuto.repositorio;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.locadora.LocAuto.Model.GrupoUsuario;

@Repository
public interface repositorioGrupoUsuario extends JpaRepository<GrupoUsuario,Integer>{

    void save(repositorioGrupoUsuario repositoriogrupousuario);

    Optional<GrupoUsuario> findByNomeGrupo(String nome);
    
}
