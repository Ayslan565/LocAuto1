package com.locadora.LocAuto.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import com.locadora.LocAuto.Model.Contrato;
import com.locadora.LocAuto.Model.Usuario; 
import com.locadora.LocAuto.Model.Carro; 
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface RepositorioContrato extends JpaRepository<Contrato, Integer> { // <-- 'R' Maiúsculo
    
    long countByStatusContrato(String status);

    // Corrigido: Removido 'c2_0.ativo' da seleção (ainda faz o JOIN)
    @Query("SELECT c FROM Contrato c " +
           "LEFT JOIN FETCH c.usuarioCliente uc " +
           "LEFT JOIN FETCH uc.pessoa " +
           "LEFT JOIN FETCH c.carro c2_0")
    List<Contrato> findAllCompletos();

    // Corrigido: Removido 'c2_0.ativo' da seleção (ainda faz o JOIN)
    @Query("SELECT c FROM Contrato c " +
           "LEFT JOIN FETCH c.usuarioCliente uc " +
           "LEFT JOIN FETCH uc.pessoa " +
           "LEFT JOIN FETCH c.carro c2_0 " +
           "WHERE c.usuarioCliente = :usuario")
    Iterable<Contrato> findByUsuarioClienteCompleto(@Param("usuario") Usuario usuario);
    
    long countByCarro(Carro carro);
}