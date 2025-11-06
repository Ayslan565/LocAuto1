package com.locadora.LocAuto.services;

import com.locadora.LocAuto.Model.Contrato;
import com.locadora.LocAuto.repositorio.repositorioContrato;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.Date;
import java.util.Optional;

@Service
public class ContratoService {

    @Autowired
    private repositorioContrato repositorioContrato;
    
    @Autowired
    private CarroServices carroServices; // Usado para verificar a disponibilidade do carro

    /**
     * Calcula o valor total do contrato (Simulação para fins de exemplo).
     */
    private BigDecimal calcularValorTotal(Date dataInicio, Date dataFim) {
        // Em um projeto real, esta função calcularia a diferença de dias * tarifa do carro.
        if (dataInicio != null && dataFim != null) {
            // Valor simulado
            return new BigDecimal("1500.00"); 
        }
        return BigDecimal.ZERO;
    }
    
    @Transactional
    public Contrato salvar(Contrato contrato) {
        // 1. Validação e Regras de Negócio
        
        if (contrato.getDataInicio() == null) {
            contrato.setDataInicio(new Date()); // Define a data de início se não for fornecida
        }
        
        if (contrato.getCarro() == null || contrato.getCarro().getIdCarro() == null) {
             throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Contrato deve estar associado a um Carro válido.");
        }
        
        // 2. Validação de Disponibilidade
        carroServices.buscarPorId(contrato.getCarro().getIdCarro()).ifPresentOrElse(carro -> {
            if (!carro.getStatus()) {
                 throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O carro selecionado não está disponível para locação.");
            }
        }, () -> {
             throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Carro com ID " + contrato.getCarro().getIdCarro() + " não encontrado.");
        });

        // 3. Cálculo do Valor
        contrato.setValorTotal(calcularValorTotal(contrato.getDataInicio(), contrato.getDataFim()));
        
        // 4. Salvar
        // (A Trigger 'trg_carro_alugado_status' cuidará de mudar o status do carro no BD)
        return repositorioContrato.save(contrato);
    }

    public Optional<Contrato> buscarPorId(Integer id) {
        return repositorioContrato.findById(id);
    }

    public Iterable<Contrato> listarTodos() {
        return repositorioContrato.findAll();
    }

    public void deletar(Integer id) {
        if (!repositorioContrato.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Contrato não encontrado.");
        }
        repositorioContrato.deleteById(id);
        // Em um sistema completo, o status do carro deveria ser revertido para TRUE aqui (já que a Trigger não faz rollback).
    }
}