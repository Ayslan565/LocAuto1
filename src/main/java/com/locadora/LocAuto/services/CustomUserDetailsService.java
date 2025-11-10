package com.locadora.LocAuto.services;

import com.locadora.LocAuto.Model.Usuario;
import com.locadora.LocAuto.repositorio.repositorioUsuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
// IMPORTAÇÃO REMOVIDA: org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private repositorioUsuario repositorioUsuario;

    // ANOTAÇÃO REMOVIDA: @Transactional
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        
        Usuario usuario = repositorioUsuario.findByLogin(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + username));

        String nomeGrupo = null;
        if (usuario.getGrupoUsuario() != null) {
            nomeGrupo = usuario.getGrupoUsuario().getNomeGrupo();
        }

        List<GrantedAuthority> authorities = Collections.emptyList();
        if (nomeGrupo != null && !nomeGrupo.isBlank()) {
            authorities = Collections.singletonList(
                    new SimpleGrantedAuthority("ROLE_" + nomeGrupo.toUpperCase())
            );
        }

        String senhaHashedDoBanco = usuario.getSenha();

        return new User(
                usuario.getLogin(),      // Username
                senhaHashedDoBanco,      // Senha hasheada lida do BD (BCrypt)
                authorities              // Permissões
        );
    }
}