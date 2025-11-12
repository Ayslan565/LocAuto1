package com.locadora.LocAuto.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*; // Importa tudo (GET, PUT, DELETE, etc)
import org.springframework.web.server.ResponseStatusException; 

import com.locadora.LocAuto.Model.Funcionario;
import com.locadora.LocAuto.dto.FuncionarioCadastroDTO; 
import com.locadora.LocAuto.services.FuncionarioService;

@RestController
@RequestMapping("/detalhesfuncionario")
public class ControleFuncionario {

    @Autowired
    private FuncionarioService funcionarioService;

    @PostMapping("/add")
    public ResponseEntity<?> adicionarInfFuncionario(@RequestBody FuncionarioCadastroDTO dto) {
        Funcionario funcionarioSalvo = funcionarioService.adicionarInfFuncionario(dto);
        return ResponseEntity.ok(funcionarioSalvo);
    }
    
    @GetMapping("/listar")
    public Iterable<Funcionario> listarFuncionarios() {
        return funcionarioService.listarFuncionarios();
    }

    // --- NOVOS ENDPOINTS ---

    // 1. Buscar por ID (Usado pelo botão 'olhinho' e 'editar')
    @GetMapping("/{id}")
    public ResponseEntity<Funcionario> buscarPorId(@PathVariable Integer id) {
        return funcionarioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 2. Atualizar (Usado pelo botão 'Salvar' no modal de edição)
    @PutMapping("/{id}")
    public ResponseEntity<Funcionario> atualizarInfFuncionario(
            @PathVariable Integer id, 
            @RequestBody FuncionarioCadastroDTO dto) {
        try {
            Funcionario atualizado = funcionarioService.atualizarInfFuncionario(id, dto);
            return ResponseEntity.ok(atualizado);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).build();
        }
    }

    // 3. Deletar (Usado pelo botão 'lixeira')
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarFuncionario(@PathVariable Integer id) {
        try {
            funcionarioService.deletar(id);
            return ResponseEntity.noContent().build(); 
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).build();
        }
    }
}