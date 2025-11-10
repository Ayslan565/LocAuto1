package com.locadora.LocAuto.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.dao.DataIntegrityViolationException;

import com.locadora.LocAuto.Model.Cliente;
import com.locadora.LocAuto.Model.Pessoa;
import com.locadora.LocAuto.dto.ClienteCadastroDTO; 

import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
import java.util.Date;
import java.util.Optional; // ADICIONADO: Necessário para buscarPorId

@Service
public class ClienteService {

    @Autowired
    private com.locadora.LocAuto.repositorio.repositorioCliente repositorioCliente; 
    
    @Autowired
    private PessoasServices pessoasServices;
    
    @Autowired
    private UsuarioService usuarioService;

    /**
     * Valida se a pessoa atingiu a maioridade (18 anos).
     */
    private void validarMaioridade(Date dataNasc) {
        if (dataNasc == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Data de nascimento é obrigatória para cadastro."
            );
        }

        LocalDate dataNascLocal = dataNasc.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate hoje = LocalDate.now();
        Period idade = Period.between(dataNascLocal, hoje);

        if (idade.getYears() < 18) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Cliente deve ter no mínimo 18 anos para se cadastrar."
            );
        }
    }

    /**
     * Fluxo transacional para salvar Pessoa, Cliente e criar o registro de Usuário.
     */
    @Transactional 
    public Cliente adicionarInfCliente(ClienteCadastroDTO dto) {
        
        // 0. Pré-validação do Login
        if (usuarioService.loginExiste(dto.getLogin())) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, 
                "O login (e-mail) já está cadastrado no sistema."
            );
        }

        Pessoa pessoa = dto.getPessoa();
        
        // 0.5. Validação de Regra de Negócio (Maioridade)
        validarMaioridade(pessoa.getData_nasc());


        Pessoa pessoaSalva;
        Cliente clienteSalvo;
        
        try {
            // 1. Salvar Pessoa
            pessoaSalva = pessoasServices.adicionarInfPessoa(pessoa); 
            
            // 2. Salvar Cliente (Garante o registro na tb_cliente)
            Cliente cliente = new Cliente();
            
            cliente.setPessoa(pessoaSalva); // Anexa a Pessoa salva ao Cliente
            clienteSalvo = repositorioCliente.save(cliente);

        } catch (DataIntegrityViolationException e) {
             String msg = "Erro de integridade de dados na Pessoa (Verifique campos obrigatórios, CPF e Email).";
             if (e.getMessage().toLowerCase().contains("cpf")) {
                 msg = "O CPF informado já está cadastrado no sistema.";
             } else if (e.getMessage().toLowerCase().contains("email")) {
                 msg = "O Email informado já está cadastrado no sistema.";
             }
             throw new ResponseStatusException(HttpStatus.BAD_REQUEST, msg);

        } catch (Exception e) {
             e.printStackTrace();
             throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno ao salvar Pessoa/Cliente: " + e.getMessage());
        }
        
        // 3. Criar o Usuário (Login, Senha Criptografada e Perfil)
        usuarioService.criarUsuarioComAcesso(
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
    
    /**
     * Busca um Cliente pelo ID usando o repositório.
     * Necessário para o endpoint GET /{id} e para o formulário de edição no frontend.
     * @param id O ID do Cliente.
     * @return Um Optional contendo o Cliente, se encontrado.
     */
    public Optional<Cliente> buscarPorId(Integer id) {
        return repositorioCliente.findById(id);
    }
}