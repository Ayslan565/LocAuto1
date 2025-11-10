package com.locadora.LocAuto.repositorio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.locadora.LocAuto.Model.Carro;
import java.util.List;

@Repository
public interface repositorioCarro extends JpaRepository<Carro, Integer> {
    
    List<Carro> findByPlacaStartsWith(String placa);
    
    // Usado para o Dashboard
    long countByStatus(boolean status);
}