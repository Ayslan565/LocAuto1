package com.locadora.LocAuto.services;

import com.locadora.LocAuto.Model.Pessoa;
import com.locadora.LocAuto.repositorio.repositorioPessoa;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PessoasServices {
    
    @Autowired
    private repositorioPessoa repositorioPessoa;
    
    public void adicionarInfPessoa(Pessoa pessoa){
        repositorioPessoa.save(pessoa);
    }
    public Iterable<Pessoa> listarPessoas() {
        return repositorioPessoa.findAll();
    }
} 
