package com.locadora.LocAuto.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;

import com.locadora.LocAuto.Model.Contrato;

import org.springframework.stereotype.Repository;

@Repository
public interface repositorioContrato extends JpaRepository<Contrato, Integer> {
    
}