package com.locadora.LocAuto.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; 
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException; 

import com.locadora.LocAuto.Model.Pessoa;
import com.locadora.LocAuto.repositorio.repositorioPessoa;

@Service
public class PessoasServices {

    @Autowired
    private repositorioPessoa repositorioPessoa;
    
    public Pessoa adicionarInfPessoa(Pessoa pessoa) {
        
        if (pessoa == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, 
                "Dados da Pessoa estão ausentes na requisição. Verifique o JSON aninhado."
            );
        }
        
        Pessoa savedPessoa = repositorioPessoa.save(pessoa);
        
        return savedPessoa;
    }

    // ATUALIZADO: Aceita um parâmetro de filtro 'cpf'
    public Iterable<Pessoa> listarPessoas(String cpf) {
        if (cpf != null && !cpf.isBlank()) {
            return repositorioPessoa.findByCpfStartsWith(cpf);
        }
        return repositorioPessoa.findAll();
    }
}