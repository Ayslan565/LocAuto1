package com.locadora.LocAuto.config;

// import org.springframework.beans.factory.annotation.Autowired; // Removido
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.factory.PasswordEncoderFactories; 

// import com.locadora.LocAuto.services.CustomUserDetailsService; // Removido

@Configuration
@EnableAspectJAutoProxy(proxyTargetClass = true)
public class AppConfig {

    // O userDetailsService não é mais necessário aqui
    // @Autowired
    // private CustomUserDetailsService userDetailsService; 

    /**
     * Define o PasswordEncoder (BCrypt/Delegating).
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
}