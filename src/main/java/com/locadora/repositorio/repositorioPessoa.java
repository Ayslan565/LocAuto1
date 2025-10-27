package com.locadora.repositorio;

import org.springframework.stereotype.Repository;

import com.locadora.LocAuto.Model.Pessoa;

import org.springframework.data.repository.CrudRepository;
   
@Repository
public interface repositorioPessoa extends CrudRepository<Pessoa,Integer> { 
    
}
