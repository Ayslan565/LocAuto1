package com.locadora.LocAuto.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.locadora.LocAuto.Model.GrupoUsuario;
import com.locadora.LocAuto.services.GrupoUsuarioService;

@RestController
@RequestMapping("/detalhesGrupoPessoa")
public class ControleGrupoUsuario {

    @Autowired
    private GrupoUsuarioService grupoUsuarioService;

    @PostMapping("/add")
    public ResponseEntity<GrupoUsuario> adicionarInfGrupoUsuario(@RequestBody GrupoUsuario grupoUsuario) {
        // CORREÇÃO: Delega a persistência ao Service
        GrupoUsuario grupoSalvo = grupoUsuarioService.salvar(grupoUsuario);
        return ResponseEntity.ok(grupoSalvo);
    }

    @GetMapping("/listar")
    public List<GrupoUsuario> listarGrupos() {
        // CORREÇÃO: Lista GruposUsuario e chama o método correto do Service
        return grupoUsuarioService.listarTodos();
    }
}