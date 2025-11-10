package com.locadora.LocAuto.repositorio;

import org.springframework.stereotype.Repository;
import com.locadora.LocAuto.Model.Pessoa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional; // Importar para buscar um único registro

@Repository
public interface repositorioPessoa extends JpaRepository<Pessoa, Integer> { 
    
    // 1. Pesquisa Parcial/Filtro (Retorna uma lista de Pessoas)
    // Usado pelo Service para listar pessoas com CPF que começam com o valor fornecido.
    List<Pessoa> findByCpfStartsWith(String cpf);
    
    // 2. Pesquisa Exata (Retorna um Optional, pois deve haver no máximo um CPF)
    // Usado pelo Service para buscar uma única pessoa pelo CPF exato.
    Optional<Pessoa> findByCpf(String cpf); 
}