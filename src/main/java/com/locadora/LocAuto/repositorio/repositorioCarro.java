package com.locadora.LocAuto.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.locadora.LocAuto.Model.Carro;
import java.util.List;

@Repository
public interface RepositorioCarro extends JpaRepository<Carro, Integer> {
    
    List<Carro> findByPlacaStartsWithAndAtivoIsTrue(String placa);
    
    // NOVO: Busca por parte do nome (contendo) ignorando maiúsculas/minúsculas
    List<Carro> findByNomeContainingIgnoreCaseAndAtivoIsTrue(String nome);
    
    List<Carro> findAllByAtivoIsTrue();

    long countByStatusAndAtivoIsTrue(boolean status);
    long countByStatus(boolean status); 
}