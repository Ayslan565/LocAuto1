package com.locadora.LocAuto.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.locadora.LocAuto.Model.Cliente;
import com.locadora.LocAuto.Model.Pessoa;
import com.locadora.LocAuto.dto.ClienteCadastroDTO; 
import com.locadora.LocAuto.repositorio.repositorioCliente; 
import com.locadora.LocAuto.services.PessoasServices;
import com.locadora.LocAuto.services.UsuarioService;

@Service
public class ClienteService {

    @Autowired
    private repositorioCliente repositorioCliente;
    
    @Autowired
    private PessoasServices pessoasServices;
    
    @Autowired
    private UsuarioService usuarioService;

    public Cliente adicionarInfCliente(ClienteCadastroDTO dto) {
        
        Pessoa pessoa = dto.getPessoa();
        Pessoa pessoaSalva = pessoasServices.adicionarInfPessoa(pessoa); 
        
        Cliente cliente = new Cliente();
        
        cliente.setId(pessoaSalva.getId()); 

        Cliente clienteSalvo = repositorioCliente.save(cliente);

        usuarioService.criarNovoUsuario(
            dto.getLogin(), 
            dto.getSenhaPura(), 
            pessoaSalva, 
            "CLIENTE"
        );
        
        return clienteSalvo;
    }

    public Iterable<Cliente> listarClientes() {
        return repositorioCliente.findAll();
    }
}