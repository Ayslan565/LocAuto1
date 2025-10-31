package com.locadora.LocAuto.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController; // Removemos o import de @RequestMapping

import com.locadora.LocAuto.Model.Cliente;
import com.locadora.LocAuto.services.ClienteService;


@RestController
// REMOVA ESTA LINHA: @RequestMapping("/detalhescliente") 
@CrossOrigin(origins = "*")
public class ControleCliente {

    @Autowired
    public ClienteService clienteService;

    // Mapeamento direto para a URL COMPLETA que o JavaScript envia.
    @PostMapping("/detalhescliente/add") 
    public String adicionarInfCliente(@RequestBody Cliente cliente) {
        clienteService.adicionarInfCliente(cliente);
        return "Sucesso Cliente";
    }
}