package com.locadora.LocAuto.services;

import com.locadora.LocAuto.Model.GrupoUsuario;
import com.locadora.LocAuto.Model.Pessoa;
import com.locadora.LocAuto.Model.Usuario;
import com.locadora.LocAuto.repositorio.repositorioUsuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder; // Importação essencial
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private repositorioUsuario repositorioUsuario;

    @Autowired
    private GrupoUsuarioService grupoUsuarioService; 
    
    @Autowired 
    private PasswordEncoder passwordEncoder; // Injeção do PasswordEncoder (BCrypt)

    /**
     * Verifica se um login (e-mail) já está em uso no sistema.
     * @param login O e-mail/login a ser verificado.
     * @return true se o login existir, false caso contrário.
     */
    public boolean loginExiste(String login) {
        return repositorioUsuario.findByLogin(login).isPresent();
    }

    /**
     * Cria um novo registro na tabela tb_usuarios após as validações de Pessoa/Cliente/Funcionario.
     * Salva a senha criptografada.
     * @param login O login (e-mail) do usuário.
     * @param senhaPura A senha fornecida em texto puro.
     * @param pessoa A entidade Pessoa já salva no banco.
     * @param nomeGrupo O perfil de acesso ("CLIENTE", "FUNCIONARIO", etc.).
     * @return O objeto Usuario salvo.
     */
    @Transactional(propagation = Propagation.REQUIRED) 
    public Usuario criarUsuarioComAcesso(String login, String senhaPura, Pessoa pessoa, String nomeGrupo) {

        if (loginExiste(login)) {
            // A camada superior (ClienteService ou FuncionarioService) trata o CONFLICT 
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Login já existe.");
        }

        Optional<GrupoUsuario> grupoOpt = grupoUsuarioService.buscarPorNome(nomeGrupo); 
        
        if (grupoOpt.isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR, 
                "Grupo de usuário '" + nomeGrupo + "' não encontrado no BD."
            );
        }
        
        // CORREÇÃO CRÍTICA: Criptografa a senha antes de salvar.
        String senhaCriptografada = passwordEncoder.encode(senhaPura);
        
        Usuario novoUsuario = new Usuario();
        novoUsuario.setLogin(login);
        novoUsuario.setSenha(senhaCriptografada); // Salva o hash BCrypt
        novoUsuario.setPessoa(pessoa); 
        novoUsuario.setGrupoUsuario(grupoOpt.get()); 

        return repositorioUsuario.save(novoUsuario);
    }
}