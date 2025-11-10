package com.locadora.LocAuto.repositorio;

import org.springframework.stereotype.Repository;
import com.locadora.LocAuto.Model.Pessoa;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

@Repository
public interface repositorioPessoa extends JpaRepository<Pessoa,Integer> { 
    
    // Usado para o filtro de CPF
    List<Pessoa> findByCpfStartsWith(String cpf);
}