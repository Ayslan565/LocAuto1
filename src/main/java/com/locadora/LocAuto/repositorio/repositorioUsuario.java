package com.locadora.LocAuto.repositorio;

import com.locadora.LocAuto.Model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface repositorioUsuario extends JpaRepository<Usuario, Integer> {

    /**
     * Busca um Usuário pelo seu login (e-mail).
     * Essencial para o processo de login do Spring Security.
     * @param login O e-mail/login do usuário.
     * @return Um Optional contendo o Usuário, se encontrado.
     */
    Optional<Usuario> findByLogin(String login);
}