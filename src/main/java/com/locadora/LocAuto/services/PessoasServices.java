package com.locadora.LocAuto.services;

import com.locadora.LocAuto.Model.Pessoa;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.locadora.repositorio.repositorioPessoa;

@Service
public class PessoasServices {
    
    @Autowired
    private repositorioPessoa repositorioPessoa;
    
    public void adicionarInfPessoa(Pessoa pessoa){
        repositorioPessoa.save(pessoa);
    }
} 
