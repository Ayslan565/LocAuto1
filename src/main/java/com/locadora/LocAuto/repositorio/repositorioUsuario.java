package com.locadora.LocAuto.repositorio;

import com.locadora.LocAuto.Model.Usuario;
import com.locadora.LocAuto.Model.Pessoa; // Importação necessária
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

    /**
     * Busca o usuário vinculado a uma pessoa específica.
     * Útil para recuperar o login a partir de um Cliente ou Funcionário
     * (para exibir na lista em vez do email de contato).
     * @param pessoa A entidade Pessoa associada.
     * @return Um Optional contendo o Usuário, se encontrado.
     */
    Optional<Usuario> findByPessoa(Pessoa pessoa);
}