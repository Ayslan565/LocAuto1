package com.locadora.LocAuto.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.locadora.LocAuto.Model.Funcionario;
@Repository
public interface repositorioFuncionario extends JpaRepository <Funcionario,Integer> {
    
}
