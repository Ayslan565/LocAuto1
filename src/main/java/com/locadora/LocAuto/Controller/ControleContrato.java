package com.locadora.LocAuto.Controller;

import com.locadora.LocAuto.Model.Contrato;
import com.locadora.LocAuto.services.ContratoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/contratos")
public class ControleContrato {

    @Autowired
    private ContratoService contratoService;

    /**
     * Endpoint GET /api/contratos - Lista todos os contratos.
     */
    @GetMapping
    public Iterable<Contrato> listarTodos() {
        return contratoService.listarTodos();
    }

    /**
     * Endpoint GET /api/contratos/{id} - Busca um contrato por ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Contrato> buscarPorId(@PathVariable Integer id) {
        return contratoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Endpoint POST /api/contratos - Cadastra um novo contrato.
     */
    @PostMapping
    public ResponseEntity<Contrato> cadastrar(@RequestBody Contrato contrato) {
        try {
            Contrato novoContrato = contratoService.salvar(contrato);
            // Retorna 201 Created com o contrato salvo
            return new ResponseEntity<>(novoContrato, HttpStatus.CREATED); 
        } catch (ResponseStatusException e) {
            // Captura as exceções de validação (ex: carro indisponível)
            throw e; 
        }
    }

    /**
     * Endpoint PUT /api/contratos/{id} - Atualiza um contrato existente.
     * @param id ID do contrato a ser atualizado (do path).
     * @param contrato Contrato com os dados atualizados (do corpo da requisição).
     */
    @PutMapping("/{id}")
    public ResponseEntity<Contrato> atualizar(@PathVariable Integer id, @RequestBody Contrato contrato) {
        // Garante que o ID do path seja usado para atualização
        contrato.setIdContrato(id);
        
        // Verifica se o contrato existe antes de salvar
        if (contratoService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Contrato contratoAtualizado = contratoService.salvar(contrato);
        return ResponseEntity.ok(contratoAtualizado);
    }

    /**
     * Endpoint DELETE /api/contratos/{id} - Deleta um contrato.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        try {
            contratoService.deletar(id);
            // Retorna 204 No Content
            return ResponseEntity.noContent().build(); 
        } catch (ResponseStatusException e) {
            // Captura NOT_FOUND (404) do Service
            throw e; 
        }
    }
}