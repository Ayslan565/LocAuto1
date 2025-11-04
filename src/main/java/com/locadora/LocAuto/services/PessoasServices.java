package com.locadora.LocAuto.services;

import com.locadora.LocAuto.Model.Pessoa;
import com.locadora.LocAuto.repositorio.repositorioPessoa; // Assumindo a interface RepositorioPessoa (PascalCase)

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PessoasServices {
    
    @Autowired
    private repositorioPessoa repositorioPessoa; 
    

    public Pessoa adicionarInfPessoa(Pessoa pessoa){
        return repositorioPessoa.save(pessoa);
    }
    
    public Iterable<Pessoa> listarPessoas() {
        return repositorioPessoa.findAll();
    }
    
}