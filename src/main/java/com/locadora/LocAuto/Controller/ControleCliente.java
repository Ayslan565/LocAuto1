package com.locadora.LocAuto.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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

}
