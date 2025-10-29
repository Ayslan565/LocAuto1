package com.locadora.LocAuto.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.locadora.LocAuto.Model.Carro;

@Service
public class CarroService {
            @Autowired
    public CarroService carroService;

    @PostMapping("add")
    public static String adicionarInfCarro(@RequestBody Carro carro) {
    CarroService.adicionarInfCarro(carro);
    return "Sucesso Carro";
}
}
