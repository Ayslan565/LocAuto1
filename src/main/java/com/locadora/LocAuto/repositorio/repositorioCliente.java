package com.locadora.LocAuto.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;

import com.locadora.LocAuto.Model.Cliente;

public interface repositorioCliente extends JpaRepository <Cliente, Integer>{

    
}
