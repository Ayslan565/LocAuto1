package com.locadora.LocAuto.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    /**
     * Endpoint que recebe o cadastro completo de Funcionário ou Gerente (baseado no tipoCadastro do DTO).
     * Mapeado para POST /detalhesfuncionario/add
     */
    @PostMapping("/add")
    public ResponseEntity<?> adicionarInfFuncionario(@RequestBody FuncionarioCadastroDTO dto) {
        
        // 1. O FuncionarioService trata o fluxo de salvar Pessoa, Funcionário e Usuário.
        Funcionario funcionarioSalvo = funcionarioService.adicionarInfFuncionario(dto);
        
        // 2. Retorna a entidade Funcionário salva com status 200 OK
        return ResponseEntity.ok(funcionarioSalvo);
    }
}