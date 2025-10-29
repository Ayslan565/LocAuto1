package com.locadora.LocAuto;

import org.springframework.beans.factory.annotation.Autowired; // 2. Importar o Autowired
import org.springframework.boot.CommandLineRunner; // 3. Importar a interface de execução
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.locadora.LocAuto.Controller.CredenciaisService;

@SpringBootApplication
public class LocAutoApplication implements CommandLineRunner { // 4. Implementar CommandLineRunner

    // 5. INJETAR O SERVIÇO (Autowired)
    @Autowired 
    private CredenciaisService credenciaisService; 

    public static void main(String[] args) {
        SpringApplication.run(LocAutoApplication.class, args);
    }

    // 6. O método run() é executado APÓS a inicialização do Spring
    @Override
    public void run(String... args) throws Exception {
        // Chamar o método que usa o @Value para provar que funcionou
        credenciaisService.logarCredenciais(); 
    }
}