package com.locadora.LocAuto;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LocAutoApplication {

    public static void main(String[] args) {
        // O bloco de teste de hash foi removido para fins de limpeza do código de produção.
        
        SpringApplication.run(LocAutoApplication.class, args);
    }

    @Override
    public String toString() {
        return "LocAutoApplication []";
    }
}