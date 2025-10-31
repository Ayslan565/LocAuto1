package com.locadora.LocAuto.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.locadora.LocAuto.Model.Carro;
import com.locadora.LocAuto.services.CarroServices;

@RestController
@RequestMapping("/detalhesCarros")
public class ControleCarro {
      @Autowired
    public CarroServices carroService;

    @PostMapping("add")
    public String adicionarInfCarro(@RequestBody Carro carro) {
    carroService.adicionarInfCarro(carro);
    return "Sucesso Carro";
    
}}
