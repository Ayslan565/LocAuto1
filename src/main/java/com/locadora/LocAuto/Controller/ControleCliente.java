package com.locadora.LocAuto.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam; // Certifique-se que o import existe
import org.springframework.web.bind.annotation.RestController;

import com.locadora.LocAuto.dto.ClienteCadastroDTO;
import com.locadora.LocAuto.Model.Cliente;
import com.locadora.LocAuto.services.ClienteService;

@RestController
@RequestMapping("/detalhescliente") 
public class ControleCliente {

    @Autowired
    private ClienteService clienteService;

    @PostMapping("/add")
    public ResponseEntity<?> adicionarInfCliente(@RequestBody ClienteCadastroDTO dto) {
        Cliente clienteSalvo = clienteService.adicionarInfCliente(dto);
        return ResponseEntity.ok(clienteSalvo);
    }

    @GetMapping("/listar")
    public Iterable<Cliente> listarClientes(
        @RequestParam(value = "cpf", required = false) String cpf
    ) {
        return clienteService.listarClientes(); 
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> buscarClientePorId(@PathVariable Integer id) {
        return clienteService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}