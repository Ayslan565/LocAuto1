package com.locadora.LocAuto.services;

import com.locadora.LocAuto.Model.Carro;
import com.locadora.LocAuto.repositorio.repositorioCarro;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class CarroServices {

    @Autowired
    private repositorioCarro repositorioCarro;

    public Carro salvar(Carro carro) {
        if (carro.getPlaca() == null || carro.getPlaca().length() != 7) {
             throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, 
                "A placa é obrigatória e deve ter 7 caracteres."
            );
        }
        
        if (carro.getIdCarro() == null) {
            carro.setStatus(true);
        }

        return repositorioCarro.save(carro);
    }
    
    public Optional<Carro> buscarPorId(Integer id) {
        return repositorioCarro.findById(id);
    }

    // ATUALIZADO: Aceita um parâmetro de filtro 'placa'
    public Iterable<Carro> listarTodos(String placa) {
        if (placa != null && !placa.isBlank()) {
            return repositorioCarro.findByPlacaStartsWith(placa);
        }
        return repositorioCarro.findAll();
    }

    public void deletar(Integer id) {
        if (!repositorioCarro.existsById(id)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, 
                "Carro não encontrado."
            );
        }
        repositorioCarro.deleteById(id);
    }

    public void adicionarInfCarro(Carro carro) {
    }
}