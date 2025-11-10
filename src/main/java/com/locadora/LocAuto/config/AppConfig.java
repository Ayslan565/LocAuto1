package com.locadora.LocAuto.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.factory.PasswordEncoderFactories; 

import com.locadora.LocAuto.services.CustomUserDetailsService;

@Configuration
public class AppConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    /**
     * Define o PasswordEncoder (BCrypt/Delegating).
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
}