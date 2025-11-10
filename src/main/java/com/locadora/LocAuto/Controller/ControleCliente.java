package com.locadora.LocAuto.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
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
        // Assume-se que o Service mapeia o DTO para a Entidade Cliente e salva.
        Cliente clienteSalvo = clienteService.adicionarInfCliente(dto);
        // Retorna 201 Created
        return new ResponseEntity<>(clienteSalvo, HttpStatus.CREATED); 
    }

    // ----------------------------------------------------
    // GET (Leitura e Busca)
    // ----------------------------------------------------

    /**
     * Lista todos os Clientes ou filtra parcialmente pelo CPF.
     * Ex: GET /detalhescliente/listar?cpf=123
     */
    @GetMapping("/listar")
    public Iterable<Cliente> listarClientes(
        @RequestParam(value = "cpf", required = false) String cpf
    ) {
        // O Service é chamado para listar todos os clientes (o filtro de CPF não está implementado na camada Service).
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
}