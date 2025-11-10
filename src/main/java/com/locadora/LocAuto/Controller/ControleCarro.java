package com.locadora.LocAuto.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity; // Importar para usar ResponseEntity
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable; // Importar para usar @PathVariable
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping; // Importar para usar @PutMapping
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam; 
import org.springframework.web.bind.annotation.RestController;

import com.locadora.LocAuto.Model.Carro;
import com.locadora.LocAuto.services.CarroServices;

@RestController
@RequestMapping("/detalhesCarros")
public class ControleCarro {
      @Autowired
    public CarroServices carroService;

    // POST /detalhesCarros/add (Para criação de novos carros)
    @PostMapping("add")
    public Carro adicionarInfCarro(@RequestBody Carro carro) {
        carroService.adicionarInfCarro(carro);
        return carroService.salvar(carro);
    }
    
    /**
     * PUT /detalhesCarros/{id} (Para atualização de um carro existente)
     */
    @PutMapping("/{id}")
    public ResponseEntity<Carro> atualizarCarro(@PathVariable Integer id, @RequestBody Carro carro) {
        if (carroService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        carro.setIdCarro(id); // Garante que o ID do objeto é o do PathVariable
        // O método salvar no Service é reutilizado para o update.
        Carro carroAtualizado = carroService.salvar(carro);
        return ResponseEntity.ok(carroAtualizado);
    }

    // GET /detalhesCarros/listar?placa=... (Para listagem e busca)
    @GetMapping("/listar")
    public Iterable<Carro> listarCarros(
        @RequestParam(value = "placa", required = false) String placa
    ) {
        return carroService.listarTodos(placa);
    }

    /**
     * NOVO: GET /detalhesCarros/{id} (Para carregar dados de edição)
     */
    @GetMapping("/{id}")
    public ResponseEntity<Carro> buscarCarroPorId(@PathVariable Integer id) {
        return carroService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}