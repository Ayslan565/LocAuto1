package com.locadora.LocAuto.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.locadora.LocAuto.Model.Cliente;

import com.locadora.LocAuto.services.ClienteService;


@RestController
public class ControleCliente {
        @Autowired
    public ClienteService clienteService;

    @PostMapping("add")
    public String adicionarInfCliente(@RequestBody Cliente cliente) {
    ClienteService.adicionarInfCliente(cliente);
    return "Sucesso Cliente";
}
}
