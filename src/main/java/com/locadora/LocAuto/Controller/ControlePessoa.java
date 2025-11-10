package com.locadora.LocAuto.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam; // IMPORTAR
import org.springframework.web.bind.annotation.RestController;

import com.locadora.LocAuto.Model.Pessoa;
import com.locadora.LocAuto.services.PessoasServices;

@RestController
@RequestMapping("/detalhesPessoa")
public class ControlePessoa {
    @Autowired  
    public PessoasServices pessoasServices;

    @PostMapping("/add")
    public Pessoa adicionarInfPessoa(@RequestBody Pessoa pessoa) {
        return pessoasServices.adicionarInfPessoa(pessoa);
    }
     
    @PutMapping("/update/{id}")
    public Pessoa atualizarInfPessoa(@PathVariable Integer id, @RequestBody Pessoa pessoa) {
        pessoa.setId(id);
        return pessoasServices.adicionarInfPessoa(pessoa); 
    }

    // ATUALIZADO: Aceita um parâmetro de busca "cpf"
    @GetMapping("/listar")
    public Iterable<Pessoa> listarPessoas(
        @RequestParam(value = "cpf", required = false) String cpf
    ) {
        return pessoasServices.listarPessoas(cpf);
    }
}