package com.locadora.LocAuto.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping; // Importante
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import com.locadora.LocAuto.dto.ClienteCadastroDTO;
import com.locadora.LocAuto.Model.Cliente;
import com.locadora.LocAuto.services.ClienteService;

@RestController
@RequestMapping("/detalhescliente") 
public class ControleCliente {

    @Autowired
    private ClienteService clienteService;

    // ----------------------------------------------------
    // POST (Criação)
    // ----------------------------------------------------

    @PostMapping("/add")
    public ResponseEntity<Cliente> adicionarInfCliente(@RequestBody ClienteCadastroDTO dto) {
        // O Service mapeia o DTO para a Entidade Cliente e salva.
        Cliente clienteSalvo = clienteService.adicionarInfCliente(dto);
        // Retorna 201 Created
        return new ResponseEntity<>(clienteSalvo, HttpStatus.CREATED); 
    }

    // ----------------------------------------------------
    // GET (Leitura e Busca)
    // ----------------------------------------------------

    /**
     * Lista todos os Clientes.
     * O parâmetro 'cpf' é aceito para não quebrar a chamada do frontend, 
     * mas a filtragem (se foi revertida no service) listará todos.
     */
    @GetMapping("/listar")
    public Iterable<Cliente> listarClientes(
        @RequestParam(value = "cpf", required = false) String cpf
    ) {
        return clienteService.listarClientes(); 
    }

    /**
     * Busca um Cliente por ID.
     * Ex: GET /detalhescliente/1
     */
    @GetMapping("/{id}")
    public ResponseEntity<Cliente> buscarClientePorId(@PathVariable Integer id) {
        return clienteService.buscarPorId(id) 
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ----------------------------------------------------
    // DELETE (Exclusão) - NOVO
    // ----------------------------------------------------

    /**
     * Deleta um cliente pelo ID.
     * O Service cuida de remover também o Usuário e a Pessoa associados.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCliente(@PathVariable Integer id) {
        try {
            clienteService.deletar(id);
            return ResponseEntity.noContent().build(); // Retorna 204 No Content
        } catch (ResponseStatusException e) {
            // Retorna erro 400 se tiver contratos ou 404 se não existir
            return ResponseEntity.status(e.getStatusCode()).build();
        }
    }
}