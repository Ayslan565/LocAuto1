package com.locadora.LocAuto.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.locadora.LocAuto.Model.Carro;

import java.util.List;
import java.util.Optional; // Importação obrigatória para o findByPlaca

@Repository
public interface RepositorioCarro extends JpaRepository<Carro, Integer> {
    
    // Busca parcial por placa (para filtros de pesquisa)
    List<Carro> findByPlacaStartsWithAndAtivoIsTrue(String placa);
    
    // Busca parcial por nome/modelo (para filtros de pesquisa)
    List<Carro> findByNomeContainingIgnoreCaseAndAtivoIsTrue(String nome);
    
    // Lista apenas carros que não foram excluídos logicamente
    List<Carro> findAllByAtivoIsTrue();

    // Contagens para o Dashboard
    long countByStatusAndAtivoIsTrue(boolean status);
    long countByStatus(boolean status); 

    // --- NOVO MÉTODO ---
    // Busca exata por placa para validação de duplicidade antes de salvar/atualizar
    Optional<Carro> findByPlaca(String placa);
}