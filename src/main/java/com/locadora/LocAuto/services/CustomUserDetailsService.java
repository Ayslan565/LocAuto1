package com.locadora.LocAuto.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.GrantedAuthority;

import com.locadora.LocAuto.Model.Usuario;
import com.locadora.LocAuto.repositorio.repositorioUsuario;

import java.util.Collections;
import java.util.Collection;


@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private repositorioUsuario repositorioUsuario;

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        
        Usuario usuario = repositorioUsuario.findByLogin(login)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + login));

        Collection<? extends GrantedAuthority> authorities = mapRolesToAuthorities(usuario.getGrupo().getNomeGrupo());

        return new org.springframework.security.core.userdetails.User(
                usuario.getLogin(),
                usuario.getSenha(),
                authorities
        );
    }

    private Collection<? extends GrantedAuthority> mapRolesToAuthorities(String nomeGrupo) {
        String roleName = "ROLE_" + nomeGrupo.toUpperCase().replace("USER_", ""); 
        return Collections.singletonList(new SimpleGrantedAuthority(roleName));
    }
}