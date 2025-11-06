package com.locadora.LocAuto.config;

import com.locadora.LocAuto.services.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.password.PasswordEncoder; 
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService;
    
    // Injeta o PasswordEncoder que agora é definido em AppConfig
    @Autowired 
    private PasswordEncoder passwordEncoder; 

    // O método @Bean public PasswordEncoder passwordEncoder() DEVE TER SIDO REMOVIDO DESTA CLASSE
    

    /**
     * Configura o UserDetailsService e o PasswordEncoder para o Spring Security.
     */
    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService)
            .passwordEncoder(passwordEncoder); // Usa o campo injetado
    }

    /**
     * Configuração das regras de autorização HTTP (URL access).
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Desabilita CSRF para API's REST
            .authorizeHttpRequests(auth -> auth
                // Permite acesso irrestrito ao cadastro e arquivos estáticos
                .requestMatchers(HttpMethod.POST, "/detalhescliente/add").permitAll() 
                .requestMatchers(HttpMethod.POST, "/detalhesfuncionario/add").permitAll() 
                .requestMatchers("/cadastro.html", "/cadastro.js", "/styles.css", "/api/public/**").permitAll()
                
                // Permite acesso ao endpoint de credenciais SOMENTE se autenticado
                .requestMatchers("/api/credenciais/perfil").authenticated()

                // Qualquer outra requisição deve ser autenticada
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login.html") 
                .defaultSuccessUrl("/index.html", true) 
                .permitAll()
            )
            .logout(logout -> logout
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                .logoutSuccessUrl("/login.html")
                .permitAll()
            );

        return http.build();
    }
}