package com.locadora.LocAuto.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.locadora.LocAuto.Model.Cliente;
import com.locadora.LocAuto.repositorio.repositorioCliente;

@Service
public class ClienteService {

    // 1. INJEÇÃO DE DEPENDÊNCIA: Necessário para usar o repositório
    @Autowired
    private repositorioCliente repositorioCliente; 

    public void adicionarInfCliente(Cliente cliente) {
        // 2. Lógica de Persistência
        repositorioCliente.save(cliente);
        
        // REMOVIDO: O throw new UnsupportedOperationException (era um stub de erro)
    }

}