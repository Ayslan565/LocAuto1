package com.locadora.LocAuto.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus; 
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping; 
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam; 
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException; 

import com.locadora.LocAuto.Model.Carro;
import com.locadora.LocAuto.services.CarroServices;
import java.util.Optional; // IMPORTAÇÃO NECESSÁRIA

@RestController
@RequestMapping("/detalhesCarros")
public class ControleCarro {
      @Autowired
    public CarroServices carroService;

    @PostMapping("add")
    public Carro adicionarInfCarro(@RequestBody Carro carro) {
        // O serviço 'salvar' já define 'ativo=true' e 'status=true' para carros novos
        return carroService.salvar(carro);
    }
    
    // =================================================================
    // AQUI ESTÁ A CORREÇÃO (Método atualizarCarro)
    // =================================================================
    @PutMapping("/{id}")
    public ResponseEntity<Carro> atualizarCarro(@PathVariable Integer id, @RequestBody Carro carroDoFormulario) {
        
        // 1. Busca o carro completo do banco de dados
        Optional<Carro> carroOpt = carroService.buscarPorId(id);
        
        if (carroOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Carro carroDoBanco = carroOpt.get();

        // 2. Copia APENAS os campos do formulário para o objeto do banco
        //    (Isto preserva os campos 'status' e 'ativo' que já estavam no banco)
        carroDoBanco.setNome(carroDoFormulario.getNome());
        carroDoBanco.setPlaca(carroDoFormulario.getPlaca());
        carroDoBanco.setAnoFabricacao(carroDoFormulario.getAnoFabricacao());
        carroDoBanco.setCor(carroDoFormulario.getCor());
        carroDoBanco.setQuilometragem(carroDoFormulario.getQuilometragem());
        
        // 3. Salva o objeto completo e atualizado
        Carro carroAtualizado = carroService.salvar(carroDoBanco);
        return ResponseEntity.ok(carroAtualizado);
    }

    @GetMapping("/listar")
    public Iterable<Carro> listarCarros(
        @RequestParam(value = "placa", required = false) String placa
    ) {
        return carroService.listarTodos(placa);
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
            // Chama o serviço de exclusão lógica (inativação)
            carroService.deletar(id);
            return ResponseEntity.noContent().build(); 
            
        } catch (ResponseStatusException e) {
            // Retorna o erro 400 (Alugado) ou 404 (Não encontrado)
            return ResponseEntity.status(e.getStatusCode()).body(null);
        }
    }
}