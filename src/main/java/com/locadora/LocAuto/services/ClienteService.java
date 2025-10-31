package com.locadora.LocAuto.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.locadora.LocAuto.Model.Cliente;
import com.locadora.LocAuto.Model.Pessoa;
import com.locadora.LocAuto.repositorio.repositorioCliente;
import com.locadora.LocAuto.repositorio.repositorioPessoa;

@Service
public class ClienteService {

    // 1. INJEÇÃO DE DEPENDÊNCIA: Necessário para usar o repositório
    @Autowired
    private repositorioCliente repositorioCliente; 
    @Autowired
    private repositorioPessoa repositorioPessoa;

    public void adicionarInfCliente(Cliente cliente) {
        Pessoa pessoa = cliente.getPessoa();
        if (pessoa == null) {
            throw new IllegalArgumentException("Dados de Pessoa (relacionamento) ausentes.");
        }
        Pessoa pessoaSalva = repositorioPessoa.save(pessoa);
        cliente.setPessoa(pessoaSalva);
        // 2. Lógica de Persistência
        repositorioCliente.save(cliente);
        
        // REMOVIDO: O throw new UnsupportedOperationException (era um stub de erro)
    }

}