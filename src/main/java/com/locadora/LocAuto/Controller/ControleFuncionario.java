package com.locadora.LocAuto.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}