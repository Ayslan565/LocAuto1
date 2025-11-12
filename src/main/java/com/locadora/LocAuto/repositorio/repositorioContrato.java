package com.locadora.LocAuto.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import com.locadora.LocAuto.Model.Contrato;
import com.locadora.LocAuto.Model.Usuario; 
import com.locadora.LocAuto.Model.Carro; 
import com.locadora.LocAuto.Model.Funcionario; 
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface RepositorioContrato extends JpaRepository<Contrato, Integer> { 
    
    long countByStatusContrato(String status);

    // Busca para Gerentes/Funcionários (Traz tudo)
    @Query("SELECT c FROM Contrato c " +
           "LEFT JOIN FETCH c.usuarioCliente uc " +
           "LEFT JOIN FETCH uc.pessoa " +
           "LEFT JOIN FETCH c.carro c2_0")
    List<Contrato> findAllCompletos();

    // --- NOVO MÉTODO DE BUSCA POR ID (Para o Cliente) ---
    // Garante que traga apenas os contratos onde o ID do usuário cliente bate com o logado
    @Query("SELECT c FROM Contrato c " +
           "LEFT JOIN FETCH c.usuarioCliente uc " +
           "LEFT JOIN FETCH uc.pessoa " +
           "LEFT JOIN FETCH c.carro c2_0 " +
           "WHERE uc.id = :id")
    List<Contrato> findByUsuarioClienteId(@Param("id") Integer id);
    
    long countByCarro(Carro carro);

    long countByFuncionario(Funcionario funcionario);
}