package com.locadora.LocAuto.repositorio;

import com.locadora.LocAuto.Model.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface repositorioFuncionario extends JpaRepository<Funcionario, Integer> {
    
    // Métodos específicos (se necessários) seriam adicionados aqui, 
    // mas o JpaRepository já fornece o save() e findAll() necessários.
}