package com.locadora.LocAuto.repositorio;

import org.springframework.stereotype.Repository;

import com.locadora.LocAuto.Model.Pessoa;

import org.springframework.data.jpa.repository.JpaRepository;
   
@Repository
public interface repositorioPessoa extends JpaRepository<Pessoa,Integer> { 
    
}
