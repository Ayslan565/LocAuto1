package com.locadora.LocAuto.Controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service // Spring gerencia e injeta esta classe
public class CredenciaisService {

    // A senha é injetada aqui
    @Value("${spring.datasource.password}")
    private String senhaDoBanco;

    // A URL também pode ser injetada
    @Value("${spring.datasource.url}")
    private String urlDoBanco;

    // Método para provar que a injeção funcionou
    public void logarCredenciais() {
        System.out.println("--- CONFIGURAÇÃO INJETADA ---");
        System.out.println("URL: " + urlDoBanco);
        System.out.println("Senha: " + senhaDoBanco);
        System.out.println("------------------------------");
    }
}