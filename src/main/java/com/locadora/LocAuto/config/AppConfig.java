package com.locadora.LocAuto.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.locadora.LocAuto.services.CustomUserDetailsService;

@Configuration
public class AppConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService; // Injeta o serviço

    /**
     * Define o PasswordEncoder como um Bean para injeção em toda a aplicação (SecurityConfig e Services).
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Define o Provedor de Autenticação (DaoAuthenticationProvider).
     * Este Bean é detectado automaticamente pelo Spring Security e usa o UserDetailsService e o PasswordEncoder.
     */
    @Bean
    public AuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder()); // Reusa o bean de encoder
        return provider;
    }
}