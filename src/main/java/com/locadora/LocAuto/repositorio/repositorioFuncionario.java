package com.locadora.LocAuto.repositorio;

import com.locadora.LocAuto.Model.Funcionario;
import com.locadora.LocAuto.Model.Pessoa; 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional; 

@Repository
public interface repositorioFuncionario extends JpaRepository<Funcionario, Integer> {
    
    // Corrige o erro de compilação no ContratoService.salvar()
    Optional<Funcionario> findByPessoa(Pessoa pessoa);
}r