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

    /**
     * Salva ou atualiza um carro no sistema.
     * @param carro A entidade Carro a ser salva.
     * @return O carro salvo.
     */
    public Carro salvar(Carro carro) {
        // Lógica de validação básica de negócio pode ser inserida aqui
        if (carro.getPlaca() == null || carro.getPlaca().length() != 7) {
             throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, 
                "A placa é obrigatória e deve ter 7 caracteres."
            );
        }
        
        // O status inicial deve ser TRUE (Disponível) se for um novo carro
        if (carro.getIdCarro() == null) {
            carro.setStatus(true);
        }

        return repositorioCarro.save(carro);
    }
    
    /**
     * Busca um carro pelo ID.
     * @param id O ID do carro.
     * @return O Optional contendo o carro.
     */
    public Optional<Carro> buscarPorId(Integer id) {
        return repositorioCarro.findById(id);
    }

    /**
     * Retorna todos os carros.
     * @return Uma lista de carros.
     */
    public Iterable<Carro> listarTodos() {
        return repositorioCarro.findAll();
    }

    /**
     * Deleta um carro pelo ID.
     * @param id O ID do carro a ser deletado.
     */
    public void deletar(Integer id) {
        if (!repositorioCarro.existsById(id)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, 
                "Carro não encontrado."
            );
        }
        repositorioCarro.deleteById(id);
    }
}