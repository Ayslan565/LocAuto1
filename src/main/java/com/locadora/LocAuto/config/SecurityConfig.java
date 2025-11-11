package com.locadora.LocAuto.config;

import com.locadora.LocAuto.services.CustomUserDetailsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.security.web.context.DelegatingSecurityContextRepository;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.RequestAttributeSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository; 

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private ObjectMapper objectMapper;

    // --- Handlers de Sucesso e Falha para o Filtro JSON ---
    
    private org.springframework.security.web.authentication.AuthenticationSuccessHandler jsonSuccessHandler() {
        return (request, response, authentication) -> {
            String primary = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .findFirst()
                    .orElse("ROLE_USER");

            response.setStatus(200);
            response.setContentType("application/json");
            response.getWriter().write("{\"success\":true,\"redirect\":\"/index.html?role=" + URLEncoder.encode(primary, StandardCharsets.UTF_8) + "\"}");
        };
    }

    private org.springframework.security.web.authentication.AuthenticationFailureHandler jsonFailureHandler() {
        return (request, response, exception) -> {
            // Este handler é disparado se a autenticação FALHAR (Bad Credentials)
            response.setStatus(401); 
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Credenciais inválidas\",\"message\":\"" + exception.getMessage() + "\"}");
        };
    }

    /**
     * Define o AuthenticationManager como um Bean (Fonte Única).
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }


    /**
     * Configura a Cadeia de Filtros de Segurança do Spring Security.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, AuthenticationManager authenticationManager) throws Exception {

        // 1. Cria o filtro customizado para JSON
        UsernamePasswordAuthenticationFilter jsonAuthFilter = new UsernamePasswordAuthenticationFilter(authenticationManager) {
            private final ObjectMapper mapper = new ObjectMapper();
            @Override
            public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
                try {
                    Map<String, String> creds = mapper.readValue(request.getInputStream(), Map.class);
                    String username = creds.getOrDefault("username", creds.getOrDefault("email", ""));
                    String password = creds.getOrDefault("password", "");
                    
                    request.setAttribute("username", username); 
                    
                    return this.getAuthenticationManager().authenticate(
                            new UsernamePasswordAuthenticationToken(username, password)
                    ); 
                } catch (IOException ex) {
                    throw new RuntimeException(ex);
                }
            }
        };

        // 2. Configura o filtro (URLs e Handlers)
        jsonAuthFilter.setFilterProcessesUrl("/api/credenciais/login");
        jsonAuthFilter.setAuthenticationFailureHandler(jsonFailureHandler()); 
        jsonAuthFilter.setAuthenticationSuccessHandler(jsonSuccessHandler());

        // 3. Configura o HttpSecurity
        http.csrf(AbstractHttpConfigurer::disable);
        
        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED));
        
        http.authorizeHttpRequests(auth -> auth
            // Libera a URL de Login, Cadastro e Estáticos
            // **ATUALIZADO:** Uso de curingas para CSS/JS para garantir que todos os arquivos sejam liberados
            .requestMatchers(
                "/", 
                "/login.html", 
                "/cadastro.html", 
                "/index.html", 
                "/favicon.ico", 
                "/images/**",
                
                "/*.css", // Libera styles.css, login.css, cadastro.css, dashboard.css
                "/*.js",  // Libera script.js, login-script.js, cadastro.js, formHandlers.js
                
                "/api/public/**"
            ).permitAll()
            
            // Libera endpoints POST de cadastro (sintaxe separada)
            .requestMatchers(
                HttpMethod.POST, 
                "/detalhescliente/add", 
                "/detalhesfuncionario/add", 
                "/api/credenciais/login"
            ).permitAll()

            // Define o que exige autenticação
            .requestMatchers("/api/credenciais/perfil").authenticated() 
            
            // Regra Final: Qualquer outra requisição DEVE ser autenticada.
            .anyRequest().authenticated()
        );

        http.exceptionHandling(exceptions -> exceptions
            .authenticationEntryPoint((request, response, authException) -> {
                response.setStatus(401);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Não autorizado\",\"message\":\"Acesso negado. Você precisa se autenticar para acessar este recurso.\"}");
            })
        );
        
        http.logout(logout -> logout
            .logoutUrl("/logout") 
            .logoutSuccessUrl("/login.html?logout=true") 
            .invalidateHttpSession(true) 
            .deleteCookies("JSESSIONID") 
        );

        // 4. CORREÇÃO DEFINITIVA DO "PISCA E EXPULSA" (Manutenção de Sessão)
        SecurityContextRepository repo = new DelegatingSecurityContextRepository(
            new HttpSessionSecurityContextRepository(),
            new RequestAttributeSecurityContextRepository()
        );
        jsonAuthFilter.setSecurityContextRepository(repo);
        

        // 5. Adiciona o filtro customizado na posição correta
        http.addFilterAt(jsonAuthFilter, UsernamePasswordAuthenticationFilter.class);

        // 6. Retorna a cadeia de filtros construída
        return http.build();
    }

    /**
     * Define o Provedor de Autenticação.
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService); 
        provider.setPasswordEncoder(passwordEncoder); 
        return provider;
    }

    /**
     * Configura o CORS.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:8080", "http://127.0.0.1:8080"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}