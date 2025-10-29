package com.locadora.LocAuto.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.locadora.LocAuto.Model.Contrato;
import com.locadora.LocAuto.services.ContratoService;

@RestController
@RequestMapping("/detalhesContrato")
public class ControleContrato {
    @Autowired
    public ContratoService contratoService;

    @PostMapping("/add")
    public String adicionarInfContrato(@RequestBody Contrato contrato) {
    ContratoService.adicionarInfContrato(contrato);
    return "Sucesso Contrato";
}
}