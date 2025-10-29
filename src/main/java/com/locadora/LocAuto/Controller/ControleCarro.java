package com.locadora.LocAuto.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.locadora.LocAuto.Model.Carro;
import com.locadora.LocAuto.services.CarroServices;

public class ControleCarro {
      @Autowired
    public CarroServices carroService;

    @PostMapping("add")
    public String adicionarInfCarro(@RequestBody Carro carro) {
    CarroServices.adicionarInfCarro(carro);
    return "Sucesso Carro";
    
}}
