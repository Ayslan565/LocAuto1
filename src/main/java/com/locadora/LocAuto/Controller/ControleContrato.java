package com.locadora.LocAuto.Controller;

import com.locadora.LocAuto.Model.Contrato;
import com.locadora.LocAuto.dto.ContratoFormDTO; 
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

    @GetMapping
    public Iterable<Contrato> listarTodos() {
        return contratoService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Contrato> buscarPorId(@PathVariable Integer id) {
        return contratoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Contrato> cadastrar(@RequestBody ContratoFormDTO dto) { 
        try {
            Contrato novoContrato = contratoService.salvar(dto); 
            return new ResponseEntity<>(novoContrato, HttpStatus.CREATED); 
        } catch (ResponseStatusException e) {
            throw e; 
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Contrato> atualizar(@PathVariable Integer id, @RequestBody ContratoFormDTO dto) {
        
        if (contratoService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Esta é uma simulação, pois o Service precisa de um método de atualização dedicado.
        Contrato contratoExistente = contratoService.buscarPorId(id).get();
        // A lógica de atualização (e a chamada ao service) deve vir aqui.
        
        return ResponseEntity.ok(contratoExistente); 
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        try {
            contratoService.deletar(id);
            return ResponseEntity.noContent().build(); 
        } catch (ResponseStatusException e) {
            throw e; 
        }
    }
}