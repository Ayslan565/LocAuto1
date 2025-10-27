package com.locadora.LocAuto.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.locadora.LocAuto.Model.Pessoa;
import com.locadora.LocAuto.services.PessoasServices;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/detalhesPessoa")
public class ControlePessoa {
    @Autowired  //Faz uma auto injeção nas proximas classes
    public PessoasServices pessoasServices;

    @PostMapping("/add")
    public String adicionarInfPessoa(@RequestBody Pessoa pessoa) {
        //TODO: process POST request
        pessoasServices.adicionarInfPessoa(pessoa);
        return "Sucesso pai!";
    }
    
}
