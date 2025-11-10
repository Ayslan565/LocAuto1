package com.locadora.LocAuto.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; 
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; 
import org.springframework.web.server.ResponseStatusException; 

import com.locadora.LocAuto.Model.Pessoa;
import com.locadora.LocAuto.repositorio.repositorioPessoa;
import java.util.Optional; 
import java.lang.Iterable; 

@Service
public class PessoasServices {

    @Autowired
    private repositorioPessoa repositorioPessoa;
    
    /**
     * Salva ou atualiza uma Pessoa no banco de dados.
     * Usado tanto para POST (adicionar) quanto para PUT (atualizar).
     */
    @Transactional
    public Pessoa adicionarInfPessoa(Pessoa pessoa) {
        
        if (pessoa == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, 
                "Dados da Pessoa estão ausentes na requisição. Verifique o JSON aninhado."
            );
        }
        
        return repositorioPessoa.save(pessoa);
    }
    
    /**
     * Lista todas as Pessoas ou filtra por CPF (usando LIKE / StartsWith).
     * @param cpf O prefixo do CPF a ser filtrado (opcional).
     * @return Uma lista de Pessoas.
     */
    @Transactional(readOnly = true)
    public Iterable<Pessoa> listarPessoas(String cpf) {
        if (cpf != null && !cpf.isBlank()) {
            // Requer que repositorioPessoa tenha o método findByCpfStartsWith(String cpf)
            return repositorioPessoa.findByCpfStartsWith(cpf);
        }
        return repositorioPessoa.findAll();
    }
    
    /**
     * Busca uma Pessoa pelo CPF exato, retornando 404 se não for encontrada.
     * @param cpf O CPF exato a ser buscado.
     * @return A Pessoa encontrada.
     */
    @Transactional(readOnly = true)
    public Pessoa buscarPorCpf(String cpf) {
        return repositorioPessoa.findByCpf(cpf)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, 
                "Pessoa com CPF " + cpf + " não encontrada."
            ));
    }
    
    /**
     * Busca uma Pessoa por ID.
     */
    @Transactional(readOnly = true)
    public Optional<Pessoa> buscarPorId(Integer id) {
        return repositorioPessoa.findById(id);
    }
    
    /**
     * Deleta uma Pessoa pelo ID.
     */
    @Transactional
    public void deletar(Integer id) {
        if (!repositorioPessoa.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pessoa com ID " + id + " não encontrada.");
        }
        repositorioPessoa.deleteById(id);
    }
}