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
    
    @Autowired 
    private PasswordEncoder passwordEncoder; 

    /**
     * Configura o UserDetailsService e o PasswordEncoder para o Spring Security.
     */
    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        // Esta configuração será ignorada pelo Spring Security se o AppConfig for configurado,
        // mas é mantida por segurança caso AppConfig não seja lido primeiro.
        auth.userDetailsService(userDetailsService)
            .passwordEncoder(passwordEncoder); 
    }

    /**
     * Configuração das regras de autorização HTTP (URL access).
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Desabilita CSRF para API's REST
            .authorizeHttpRequests(auth -> auth
                // CRÍTICO: Libera o root e todas as páginas estáticas para evitar loop de redirecionamento
                .requestMatchers("/", "/login.html", "/cadastro.html", "/cadastro.js", "/styles.css", "/api/public/**").permitAll()
                
                // Libera o POST de cadastro para clientes/funcionários
                .requestMatchers(HttpMethod.POST, "/detalhescliente/add").permitAll() 
                .requestMatchers(HttpMethod.POST, "/detalhesfuncionario/add").permitAll() 
                
                // Endpoint de permissões precisa de autenticação
                .requestMatchers("/api/credenciais/perfil").authenticated()

                // QUALQUER OUTRA REQUISIÇÃO (incluindo /index.html) DEVE SER AUTENTICADA
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login.html") 
                .defaultSuccessUrl("/index.html", true) // Redireciona para o PROTEGIDO /index.html
                .permitAll()
            )
            .logout(logout -> logout
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                .logoutSuccessUrl("/login.html") // Redireciona para a tela de login após logout
                .permitAll()
            );

        return http.build();
    }
}