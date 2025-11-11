package com.locadora.LocAuto.services;

import com.locadora.LocAuto.Model.Carro;
// =================================================================
// 1. CORREÇÃO: Imports com 'R' maiúsculo
// =================================================================
import com.locadora.LocAuto.repositorio.RepositorioCarro; 
import com.locadora.LocAuto.repositorio.RepositorioContrato;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class CarroServices {

    // =================================================================
    // 2. CORREÇÃO: Tipos de variável com 'R' maiúsculo
    // =================================================================
    @Autowired
    private RepositorioCarro repositorioCarro;

    @Autowired
    private RepositorioContrato repositorioContrato;

    public Carro salvar(Carro carro) {
        if (carro.getPlaca() == null || carro.getPlaca().length() != 7) {
             throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, 
                "A placa é obrigatória e deve ter 7 caracteres."
            );
        }
        
        // Garante que um carro novo sempre seja 'Disponível' E 'Ativo'
        if (carro.getIdCarro() == null) {
            carro.setStatus(true); // Disponível
            carro.setAtivo(true);  // Ativo (Visível)
        }

        return repositorioCarro.save(carro);
    }
    
    public Optional<Carro> buscarPorId(Integer id) {
        return repositorioCarro.findById(id);
    }

    public Iterable<Carro> listarTodos(String placa) {
        // Usa os métodos que só buscam carros ATIVOS (ativo=true)
        if (placa != null && !placa.isBlank()) {
            return repositorioCarro.findByPlacaStartsWithAndAtivoIsTrue(placa);
        }
        return repositorioCarro.findAllByAtivoIsTrue();
    }

    public void deletar(Integer id) {
        
        Optional<Carro> carroOpt = repositorioCarro.findById(id);

        if (carroOpt.isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, 
                "Carro não encontrado."
            );
        }
        
        Carro carro = carroOpt.get();

        // Verificação 1: Não pode estar Alugado
        if (carro.getStatus() == null || !carro.getStatus()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, 
                "Este carro está alugado e não pode ser excluído."
            );
        }

        // Verificação 2: Não pode ter histórico de contratos
        long totalContratos = repositorioContrato.countByCarro(carro);
        if (totalContratos > 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, 
                "Este carro está vinculado a " + totalContratos + " contrato(s) no histórico e não pode ser excluído."
            );
        }

        // Se passar nas duas verificações, inativa o carro
        carro.setAtivo(false); 
        repositorioCarro.save(carro); 
    }

    public void adicionarInfCarro(Carro carro) {
        // Método placeholder
    }
}