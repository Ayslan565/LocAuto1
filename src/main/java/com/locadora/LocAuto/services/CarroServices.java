package com.locadora.LocAuto.services;

import com.locadora.LocAuto.Model.Carro;
// ATENÇÃO: Se você moveu os repositórios para a pasta 'jpa', atualize a linha abaixo para:
// import com.locadora.LocAuto.repositorio.jpa.RepositorioCarro;
import com.locadora.LocAuto.repositorio.RepositorioCarro;
import com.locadora.LocAuto.repositorio.RepositorioContrato;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class CarroServices {

    @Autowired
    private RepositorioCarro repositorioCarro;

    @Autowired
    private RepositorioContrato repositorioContrato;

    /**
     * Salva um novo carro.
     * Método usado para criação (POST).
     */
    @Transactional
    public Carro salvar(Carro carro) {
        // Validação básica de formato
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
            
            // Opcional: Verificar se a placa já existe ao CRIAR também, para evitar erro 500
            if(repositorioCarro.findByPlaca(carro.getPlaca()).isPresent()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um carro cadastrado com a placa " + carro.getPlaca());
            }
        }

        return repositorioCarro.save(carro);
    }

    /**
     * Atualiza um carro existente.
     * Método usado para edição (PUT).
     * Inclui validação para evitar erro de "Duplicate entry" na placa.
     */
    @Transactional
    public Carro atualizar(Integer id, Carro carroAtualizado) {
        // 1. Busca o carro no banco
        Carro carroBanco = repositorioCarro.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Carro não encontrado."));

        // 2. Validação de Placa Duplicada
        // Verifica se a placa foi alterada no formulário
        if (!carroBanco.getPlaca().equals(carroAtualizado.getPlaca())) {
            // Se mudou, verifica se a nova placa já pertence a OUTRO carro
            Optional<Carro> carroComMesmaPlaca = repositorioCarro.findByPlaca(carroAtualizado.getPlaca());
            
            if (carroComMesmaPlaca.isPresent()) {
                throw new ResponseStatusException(
                    HttpStatus.CONFLICT, // Retorna 409 Conflict
                    "A placa " + carroAtualizado.getPlaca() + " já está cadastrada em outro veículo."
                );
            }
        }

        // 3. Atualiza os campos permitidos
        carroBanco.setNome(carroAtualizado.getNome());
        carroBanco.setPlaca(carroAtualizado.getPlaca());
        carroBanco.setAnoFabricacao(carroAtualizado.getAnoFabricacao());
        carroBanco.setCor(carroAtualizado.getCor());
        carroBanco.setQuilometragem(carroAtualizado.getQuilometragem());
        
        // Nota: 'status' e 'ativo' geralmente são geridos por regras específicas (aluguel/delete), não pelo update genérico.

        return repositorioCarro.save(carroBanco);
    }
    
    public Optional<Carro> buscarPorId(Integer id) {
        return repositorioCarro.findById(id);
    }

    /**
     * Lista carros com filtros opcionais.
     * Permite buscar por Placa (Gerente) ou Nome/Modelo (Cliente).
     */
    public Iterable<Carro> listarTodos(String placa, String nome) {
        // 1. Filtro por Placa
        if (placa != null && !placa.isBlank()) {
            return repositorioCarro.findByPlacaStartsWithAndAtivoIsTrue(placa);
        }
        // 2. Filtro por Nome (Modelo)
        if (nome != null && !nome.isBlank()) {
            return repositorioCarro.findByNomeContainingIgnoreCaseAndAtivoIsTrue(nome);
        }
        // 3. Sem filtro: retorna todos os ativos
        return repositorioCarro.findAllByAtivoIsTrue();
    }

    /**
     * Realiza a exclusão lógica do carro.
     * Impede a exclusão se o carro estiver alugado ou tiver histórico.
     */
    @Transactional
    public void deletar(Integer id) {
        
        Optional<Carro> carroOpt = repositorioCarro.findById(id);

        if (carroOpt.isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, 
                "Carro não encontrado."
            );
        }
        
        Carro carro = carroOpt.get();

        // Verificação 1: Não pode estar Alugado (status = false)
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

        // Se passar nas duas verificações, inativa o carro (Exclusão Lógica)
        carro.setAtivo(false); 
        repositorioCarro.save(carro); 
    }
}