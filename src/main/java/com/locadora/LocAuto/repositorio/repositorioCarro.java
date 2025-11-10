package com.locadora.LocAuto.repositorio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.locadora.LocAuto.Model.Carro;
@Repository
public interface repositorioCarro extends JpaRepository<Carro, Integer> {
    
    // Assumindo que a busca por placa é útil
    // Optional<Carro> findByPlaca(String placa);
}

// Arquivo: LocAuto/src/main/java/com/locadora/LocAuto/repositorio/repositorioContrato.java
