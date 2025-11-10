package com.locadora.LocAuto.services;

import com.locadora.LocAuto.Model.GrupoUsuario;
import com.locadora.LocAuto.Model.Pessoa;
import com.locadora.LocAuto.Model.Usuario;
import com.locadora.LocAuto.repositorio.repositorioUsuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class GerenteService {

    @Autowired
    private repositorioUsuario repositorioUsuario;

    @Autowired
    private GrupoUsuarioService grupoUsuarioService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Cria um usuário com acesso: valida se login já existe, busca o grupo, hashea a senha e salva.
     */
    @Transactional(propagation = Propagation.REQUIRED)
    public Usuario criarUsuarioComAcesso(String login, String senhaPura, Pessoa pessoa, String nomeGrupo) {

        if (login == null || login.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Login inválido.");
        }

        if (repositorioUsuario.findByLogin(login).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Login já existe.");
        }

        Optional<GrupoUsuario> grupoOpt = grupoUsuarioService.buscarPorNome(nomeGrupo);
        if (grupoOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Grupo de usuário '" + nomeGrupo + "' não encontrado no BD.");
        }

        String senhaCriptografada = passwordEncoder.encode(senhaPura);

        Usuario novoUsuario = new Usuario();
        novoUsuario.setLogin(login);
        novoUsuario.setSenha(senhaCriptografada);
        novoUsuario.setPessoa(pessoa);
        novoUsuario.setGrupoUsuario(grupoOpt.get());

        return repositorioUsuario.save(novoUsuario);
    }

    /**
     * Autentica usuário comparando senha pura com hash armazenado (PasswordEncoder.matches).
     * Retorna true se combinar, false caso contrário.
     */
    public boolean autenticarUsuario(String login, String senhaPura) {
        Optional<Usuario> usuOpt = repositorioUsuario.findByLogin(login);
        if (usuOpt.isEmpty()) {
            return false;
        }
        Usuario usuario = usuOpt.get();
        String senhaHash = usuario.getSenha();
        if (senhaHash == null) return false;
        return passwordEncoder.matches(senhaPura, senhaHash);
    }

    // ... adicione aqui outros métodos gerentes que precisar (ex: alterar senha, bloquear usuário, buscar por login, etc.) ...
}
