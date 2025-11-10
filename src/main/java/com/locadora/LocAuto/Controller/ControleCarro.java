package com.locadora.LocAuto.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping; // Certifique-se que o import existe
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam; // Certifique-se que o import existe
import org.springframework.web.bind.annotation.RestController;

import com.locadora.LocAuto.Model.Carro;
import com.locadora.LocAuto.services.CarroServices;

@RestController
@RequestMapping("/detalhesCarros")
public class ControleCarro {
      @Autowired
    public CarroServices carroService;

    @PostMapping("add")
    public Carro adicionarInfCarro(@RequestBody Carro carro) {
        carroService.adicionarInfCarro(carro);
        return carroService.salvar(carro);
    }

    @GetMapping("/listar")
    public Iterable<Carro> listarCarros(
        @RequestParam(value = "placa", required = false) String placa
    ) {
        return carroService.listarTodos(placa);
    }
}