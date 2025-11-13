package com.locadora.LocAuto.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.locadora.LocAuto.Model.Contrato;
import com.locadora.LocAuto.Model.Carro; 
import com.locadora.LocAuto.Model.Funcionario; 
import java.util.List;

@Repository
public interface RepositorioContrato extends JpaRepository<Contrato, Integer> { 
    
    // Contagem geral por status (Para Gerente/Funcionário)
    long countByStatusContrato(String status);

    // --- NOVO MÉTODO ESSENCIAL PARA O DASHBOARD DO CLIENTE ---
    // Conta contratos filtrando por ID do Cliente E Status (ex: Ativo ou Concluído)
    long countByUsuarioClienteIdAndStatusContrato(Integer id, String status);

    // Busca para GERENTE e FUNCIONARIO (Traz tudo com os nomes preenchidos - JOIN FETCH)
    @Query("SELECT c FROM Contrato c " +
           "LEFT JOIN FETCH c.usuarioCliente uc " +
           "LEFT JOIN FETCH uc.pessoa " +
           "LEFT JOIN FETCH c.carro c2_0")
    List<Contrato> findAllCompletos();

    // --- BUSCA PARA O CLIENTE (LISTA NA TABELA) ---
    // Traz apenas os contratos onde o ID do usuário (tb_usuarios.id_usuario) é igual ao passado
    @Query("SELECT c FROM Contrato c " +
           "LEFT JOIN FETCH c.usuarioCliente uc " +
           "LEFT JOIN FETCH uc.pessoa " +
           "LEFT JOIN FETCH c.carro c2_0 " +
           "WHERE uc.id = :id")
    List<Contrato> findByUsuarioClienteId(@Param("id") Integer id);
    
    // Contagens auxiliares para validação de exclusão (Integridade Referencial)
    long countByCarro(Carro carro);
    long countByFuncionario(Funcionario funcionario);
}