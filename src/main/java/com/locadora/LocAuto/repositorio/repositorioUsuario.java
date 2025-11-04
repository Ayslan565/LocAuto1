package com.locadora.LocAuto.repositorio;

import java.util.Optional; // Importação necessária para o Optional

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.locadora.LocAuto.Model.Usuario;

@Repository
public interface repositorioUsuario extends JpaRepository<Usuario, Integer> {

    Optional<Usuario> findByLogin(String login);
}