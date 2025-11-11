package com.locadora.LocAuto.repositorio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.locadora.LocAuto.Model.Carro;
import java.util.List;

@Repository
public interface RepositorioCarro extends JpaRepository<Carro, Integer> { // <-- 'R' Maiúsculo
    
    List<Carro> findByPlacaStartsWithAndAtivoIsTrue(String placa);
    
    List<Carro> findAllByAtivoIsTrue();

    long countByStatusAndAtivoIsTrue(boolean status);
    
    // Necessário para o DashboardService (antes da exclusão lógica)
    long countByStatus(boolean status); 
}