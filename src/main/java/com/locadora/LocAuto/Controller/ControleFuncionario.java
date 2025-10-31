package com.locadora.LocAuto.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.locadora.LocAuto.Model.Funcionario;
import com.locadora.LocAuto.services.FuncionarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/detalhesFuncionario")
public class ControleFuncionario {
    @Autowired
    public FuncionarioService funcionarioService;

    @PostMapping("/add")
    public String adicionarInfFuncionario(@RequestBody Funcionario funcionario) {
    funcionarioService.adicionarInfFuncionario(funcionario);
    return "Sucesso Funcionario";
    }
    
}
