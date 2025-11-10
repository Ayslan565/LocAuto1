package com.locadora.LocAuto.config;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

// Importação necessária para a verificação do "porteiro"
import com.locadora.LocAuto.services.CustomUserDetailsService; 

public class TenantRoutingDataSource extends AbstractRoutingDataSource {

    @Override
    protected Object determineCurrentLookupKey() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // 1. REGRA DO "PORTEIRO" (A CORREÇÃO DO LOOP "PISCA E EXPULSA")
        // Se o "porteiro" (CustomUserDetailsService) estiver a verificar as credenciais...
        for (StackTraceElement ste : Thread.currentThread().getStackTrace()) {
            // Usamos .contains() para funcionar mesmo se o Spring criar um "Proxy"
            if (ste.getClassName().contains("CustomUserDetailsService")) {
                // ... retorna 'null'. O 'DataSourceConfig' usará o padrão (administrador_TI).
                return null;
            }
        }
        
        // 2. REGRA DO UTILIZADOR LOGADO (OPERAÇÃO NORMAL DO DASHBOARD)
        // Se o usuário estiver LOGADO e NÃO for anónimo
        if (authentication != null && 
            authentication.isAuthenticated() &&
            !authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ANONYMOUS"))) 
        {
            // Determina a role para usar o usuário restrito (CLIENTE, FUNCIONARIO, GERENTE)
            String role = authentication.getAuthorities().stream()
                                .map(GrantedAuthority::getAuthority)
                                .findFirst()
                                .orElse("ROLE_CLIENTE"); // Fallback

            if (role.equals("ROLE_GERENTE")) {
                return TenantDatabase.GERENTE;
            } else if (role.equals("ROLE_FUNCIONARIO")) {
                return TenantDatabase.FUNCIONARIO;
            } else if (role.equals("ROLE_CLIENTE")) {
                return TenantDatabase.CLIENTE;
            }
        }

        // 3. CASO PADRÃO (CADASTRO E LOGIN)
        // Se for anónimo (a fazer cadastro) ou null (a fazer login),
        // retorna 'null' para usar o 'defaultTargetDataSource' (administrador_TI).
        return null;
    }
}