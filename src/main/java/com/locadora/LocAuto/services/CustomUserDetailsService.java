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

import java.util.Collections;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private repositorioUsuario repositorioUsuario;

    /**
     * Carrega as informações do usuário pelo login (e-mail) para autenticação.
     * Esta é a parte essencial do Spring Security.
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        
        // 1. Buscar o usuário pelo login (username é o campo 'login' na tb_usuarios)
        Usuario usuario = repositorioUsuario.findByLogin(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + username));

        // 2. Mapear a permissão (Grupo) do banco para o formato de ROLE do Spring Security
        String nomeGrupo = usuario.getGrupoUsuario().getNomeGrupo();
        
        // As roles devem ser prefixadas com "ROLE_" (convenção do Spring Security)
        List<GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + nomeGrupo.toUpperCase())
        );

        // 3. Retornar um objeto UserDetails que o Spring Security usará para validar a senha
        return new User(
                usuario.getLogin(),      // Username
                usuario.getSenha(),      // Senha (já criptografada do BD)
                authorities              // Permissões
        );
    }
}