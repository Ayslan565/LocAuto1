package com.locadora.LocAuto.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.locadora.LocAuto.Model.Carro;
import com.locadora.LocAuto.services.CarroServices;
import java.util.Optional;

@RestController
@RequestMapping("/detalhesCarros")
public class ControleCarro {

    @Autowired
    public CarroServices carroService;

    @PostMapping("/add")
    public Carro adicionarInfCarro(@RequestBody Carro carro) {
        return carroService.salvar(carro);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Carro> atualizarCarro(@PathVariable Integer id, @RequestBody Carro carroDoFormulario) {
        
        Optional<Carro> carroOpt = carroService.buscarPorId(id);
        
        if (carroOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Carro carroDoBanco = carroOpt.get();

        // Atualiza apenas os campos permitidos, mantendo o ID, Status e Ativo originais
        carroDoBanco.setNome(carroDoFormulario.getNome());
        carroDoBanco.setPlaca(carroDoFormulario.getPlaca());
        carroDoBanco.setAnoFabricacao(carroDoFormulario.getAnoFabricacao());
        carroDoBanco.setCor(carroDoFormulario.getCor());
        carroDoBanco.setQuilometragem(carroDoFormulario.getQuilometragem());
        
        Carro carroAtualizado = carroService.salvar(carroDoBanco);
        return ResponseEntity.ok(carroAtualizado);
    }

    // --- ATUALIZADO: Aceita 'placa' e 'nome' para a busca ---
    @GetMapping("/listar")
    public Iterable<Carro> listarCarros(
        @RequestParam(value = "placa", required = false) String placa,
        @RequestParam(value = "nome", required = false) String nome
    ) {
        // Passa os parâmetros para o serviço decidir qual filtro aplicar
        return carroService.listarTodos(placa, nome);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Carro> buscarCarroPorId(@PathVariable Integer id) {
        return carroService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCarro(@PathVariable Integer id) {
        try {
            carroService.deletar(id);
            return ResponseEntity.noContent().build(); 
            
        } catch (ResponseStatusException e) {
            // Retorna o status correto (400 ou 404) definido no Service
            return ResponseEntity.status(e.getStatusCode()).body(null);
        }
    }
}