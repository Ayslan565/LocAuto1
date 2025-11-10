package com.locadora.LocAuto.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import com.locadora.LocAuto.Model.Contrato;
import com.locadora.LocAuto.Model.Usuario; 
import org.springframework.stereotype.Repository;

@Repository
public interface repositorioContrato extends JpaRepository<Contrato, Integer> {
    
    Iterable<Contrato> findByUsuarioCliente(Usuario usuarioCliente);
    
    // Usado para o Dashboard (Contratos Ativos)
    long countByStatusContrato(String status);
}