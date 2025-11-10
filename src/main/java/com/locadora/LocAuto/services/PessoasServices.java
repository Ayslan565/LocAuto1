package com.locadora.LocAuto.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; // Importar
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException; // Importar

import com.locadora.LocAuto.Model.Pessoa;
import com.locadora.LocAuto.repositorio.repositorioPessoa;

@Service
public class PessoasServices {

    @Autowired
    private repositorioPessoa repositorioPessoa;
    
    public Pessoa adicionarInfPessoa(Pessoa pessoa) {
        
        // CORREÇÃO: Validação para evitar o erro "Entity must not be null"
        if (pessoa == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, 
                "Dados da Pessoa estão ausentes na requisição. Verifique o JSON aninhado."
            );
        }
        
        Pessoa savedPessoa = repositorioPessoa.save(pessoa);
        
        return savedPessoa;
    }

    public Iterable<Pessoa> listarPessoas() {
        return repositorioPessoa.findAll();
    }
}