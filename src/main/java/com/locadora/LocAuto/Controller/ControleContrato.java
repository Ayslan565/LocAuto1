package com.locadora.LocAuto.Controller;

import com.locadora.LocAuto.Model.Contrato;
import com.locadora.LocAuto.dto.ContratoFormDTO; 
import com.locadora.LocAuto.dto.ContratoRespostaDTO; 
import com.locadora.LocAuto.dto.ContratoDetalheDTO;
import com.locadora.LocAuto.services.ContratoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List; 

@RestController
@RequestMapping("/api/contratos")
public class ControleContrato {

    @Autowired
    private ContratoService contratoService;

    @GetMapping
    public List<ContratoDetalheDTO> listarTodos() { 
        return contratoService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Contrato> buscarPorId(@PathVariable Integer id) {
        return contratoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ContratoRespostaDTO> cadastrar(@RequestBody ContratoFormDTO dto) { 
        try {
            ContratoRespostaDTO novoContratoDTO = contratoService.salvar(dto); 
            return new ResponseEntity<>(novoContratoDTO, HttpStatus.CREATED); 
        } catch (ResponseStatusException e) {
            throw e; 
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Contrato> atualizar(@PathVariable Integer id, @RequestBody ContratoFormDTO dto) {
        
        if (contratoService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Contrato contratoExistente = contratoService.buscarPorId(id).get();
        
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
    
    /**
     * NOVO ENDPOINT: Marca um contrato como concluído.
     * Usamos PatchMapping, pois é uma atualização parcial.
     */
    @PatchMapping("/{id}/concluir")
    public ResponseEntity<ContratoDetalheDTO> concluirContrato(@PathVariable Integer id) {
        try {
            ContratoDetalheDTO contratoAtualizado = contratoService.concluirContrato(id);
            return ResponseEntity.ok(contratoAtualizado);
        } catch (ResponseStatusException e) {
            throw e; 
        }
    }
}