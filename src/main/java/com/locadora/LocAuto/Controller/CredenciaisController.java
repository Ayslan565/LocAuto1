package com.locadora.LocAuto.Controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/credenciais")
public class CredenciaisController {

    /**
     * Endpoint que retorna os perfis (roles) do usuário autenticado.
     * Isso é usado pelo JavaScript no frontend para carregar menus e abas dinamicamente.
     * Ex: Retorna ["CLIENTE"] ou ["GERENTE"].
     */
    @GetMapping("/perfil")
    public List<String> getPerfilUsuario() {
        // Obtém o objeto de autenticação do contexto de segurança do Spring
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Checagem básica de segurança (embora o Spring Security já trate o não-autenticado)
        if (authentication == null || !authentication.isAuthenticated()) {
            return List.of(); 
        }

        // Mapeia as GrantedAuthority (Roles) para Strings e remove o prefixo "ROLE_" 
        // para simplificar a lógica do JavaScript.
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(role -> role.replace("ROLE_", "")) 
                .collect(Collectors.toList());
    }
}