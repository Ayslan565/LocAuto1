package com.locadora.LocAuto.repositorio;

import com.locadora.LocAuto.Model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface repositorioCliente extends JpaRepository<Cliente, Integer> {
    
    // O JpaRepository fornece automaticamente os métodos save(), findById(), findAll(), etc.
    
}