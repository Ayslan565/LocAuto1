package com.locadora.LocAuto.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.locadora.LocAuto.Model.GrupoUsuario;
import com.locadora.LocAuto.Model.Pessoa;
import com.locadora.LocAuto.Model.Usuario;
import com.locadora.LocAuto.repositorio.repositorioGrupoUsuario;
import com.locadora.LocAuto.repositorio.repositorioUsuario;

@Service
public class UsuarioService {

    @Autowired
    private repositorioUsuario repositorioUsuario;

    @Autowired
    private repositorioGrupoUsuario repositorioGrupo;

    @Autowired(required = false) 
    private PasswordEncoder passwordEncoder;

    public Usuario criarUsuarioComAcesso(String login, String senhaPura, Pessoa pessoa, String tipoPessoa) {

        String senhaHash;
        if (passwordEncoder != null) {
            senhaHash = passwordEncoder.encode(senhaPura);
        } else {
            senhaHash = senhaPura; 
        }

        String nomeGrupoDB = "user_" + tipoPessoa.toLowerCase();
        Optional<GrupoUsuario> grupoOptional = repositorioGrupo.findByNomeGrupo(nomeGrupoDB);

        if (!grupoOptional.isPresent()) {
            throw new RuntimeException("Grupo de usuário não encontrado: " + nomeGrupoDB);
        }
        GrupoUsuario grupo = grupoOptional.get();

        Usuario novoUsuario = new Usuario();
        novoUsuario.setLogin(login);
        novoUsuario.setSenha(senhaHash);
        novoUsuario.setPessoa(pessoa); 
        novoUsuario.setGrupo(grupo); 
        
        return repositorioUsuario.save(novoUsuario);
    }

    public void criarNovoUsuario(String login, String senhaPura, Pessoa pessoaSalva, String string) {
        throw new UnsupportedOperationException("Unimplemented method 'criarNovoUsuario'");
    }
}