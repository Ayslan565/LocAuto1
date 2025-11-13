package com.locadora.LocAuto.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*; // Importa todas as anotações (GetMapping, PostMapping, etc)
import org.springframework.web.server.ResponseStatusException;

import com.locadora.LocAuto.Model.Pessoa;
import com.locadora.LocAuto.services.PessoasServices;

@RestController
@RequestMapping("/detalhesPessoa")
public class ControlePessoa {

    @Autowired  
    private PessoasServices pessoasServices;

    // Cadastrar
    @PostMapping("/add")
    public Pessoa adicionarInfPessoa(@RequestBody Pessoa pessoa) {
        return pessoasServices.adicionarInfPessoa(pessoa);
    }
     
    // Atualizar
    // CORREÇÃO: Agora chama o método 'atualizar' do service para garantir o log correto
    @PutMapping("/update/{id}")
    public ResponseEntity<Pessoa> atualizarInfPessoa(@PathVariable Integer id, @RequestBody Pessoa pessoa) {
        try {
            Pessoa pessoaAtualizada = pessoasServices.atualizar(id, pessoa);
            return ResponseEntity.ok(pessoaAtualizada);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).build();
        }
    }

    // Listar (com filtro opcional de CPF)
    @GetMapping("/listar")
    public Iterable<Pessoa> listarPessoas(
        @RequestParam(value = "cpf", required = false) String cpf
    ) {
        return pessoasServices.listarPessoas(cpf);
    }
    
    // Buscar por ID (Necessário para carregar o formulário de edição)
    @GetMapping("/{id}")
    public ResponseEntity<Pessoa> buscarPorId(@PathVariable Integer id) {
        return pessoasServices.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Deletar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPessoa(@PathVariable Integer id) {
        try {
            pessoasServices.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).build();
        }
    }
}