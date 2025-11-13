package com.locadora.LocAuto.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.locadora.LocAuto.Model.Carro;
import com.locadora.LocAuto.services.CarroServices;
import java.util.Optional;

@RestController
@RequestMapping("/detalhesCarros")
public class ControleCarro {

    @Autowired
    public CarroServices carroService;

    // --- CADASTRAR ---
    @PostMapping("/add")
    public Carro adicionarInfCarro(@RequestBody Carro carro) {
        return carroService.salvar(carro);
    }
    
    // --- ATUALIZAR (LOG: CarroServices.atualizar) ---
    @PutMapping("/{id}")
    public ResponseEntity<Carro> atualizarCarro(@PathVariable Integer id, @RequestBody Carro carroDoFormulario) {
        try {
            // Chama o método específico 'atualizar' para garantir o log correto e as validações
            Carro carroAtualizado = carroService.atualizar(id, carroDoFormulario);
            return ResponseEntity.ok(carroAtualizado);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).build();
        }
    }

    // --- LISTAR (Suporta filtro por PLACA ou NOME) ---
    @GetMapping("/listar")
    public Iterable<Carro> listarCarros(
        @RequestParam(value = "placa", required = false) String placa,
        @RequestParam(value = "nome", required = false) String nome
    ) {
        // Passa os parâmetros para o serviço decidir qual filtro aplicar
        return carroService.listarTodos(placa, nome);
    }

    // --- BUSCAR POR ID ---
    @GetMapping("/{id}")
    public ResponseEntity<Carro> buscarCarroPorId(@PathVariable Integer id) {
        return carroService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // --- DELETAR ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCarro(@PathVariable Integer id) {
        try {
            carroService.deletar(id);
            return ResponseEntity.noContent().build(); 
            
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(null);
        }
    }
}