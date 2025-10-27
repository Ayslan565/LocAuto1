package com.locadora.LocAuto.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
//Chama sem precisar de resposta sem manter o status da requisição
// STATLLESS -> sempre envia login e senha ou token de autenticação (Toda reuisição), STATFULL -> Mantém o estado do Servidor

@RestController

//Escuta todas as requisições (Post, get, delete, put, options,head)
@RequestMapping

public class ConexaoFront {
    @GetMapping("/api/index")
    public String resposta() {
        return "Resposta aqui!";
    }
}
