package com.locadora.LocAuto.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.dao.DataIntegrityViolationException;

import com.locadora.LocAuto.Model.Cliente;
import com.locadora.LocAuto.Model.Pessoa;
import com.locadora.LocAuto.Model.Usuario; 
import com.locadora.LocAuto.dto.ClienteCadastroDTO; 
import com.locadora.LocAuto.repositorio.repositorioCliente; 
import com.locadora.LocAuto.repositorio.repositorioUsuario;
import com.locadora.LocAuto.repositorio.repositorioPessoa; // Necessário para deletar
import com.locadora.LocAuto.repositorio.RepositorioContrato; // Necessário para verificar contratos antes de deletar

import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
import java.util.Date;
import java.util.Optional; 
import java.util.List;

@Service
public class ClienteService {

    @Autowired
    private repositorioCliente repositorioCliente; 
    
    @Autowired
    private PessoasServices pessoasServices;
    
    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private repositorioUsuario repositorioUsuario; 

    // Injeções adicionais para a funcionalidade de exclusão
    @Autowired
    private repositorioPessoa repositorioPessoa;

    @Autowired
    private RepositorioContrato repositorioContrato;

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

    /**
     * Lista todos os clientes.
     * Corrige o email visualizado trocando pelo login da tabela de usuários.
     */
    public Iterable<Cliente> listarClientes() {
        // 1. Busca todos os clientes
        Iterable<Cliente> clientes = repositorioCliente.findAll();

        // 2. Itera sobre a lista para substituir o email da Pessoa pelo Login do Usuário
        for (Cliente cliente : clientes) {
            Pessoa pessoa = cliente.getPessoa();
            if (pessoa != null) {
                Optional<Usuario> usuarioOpt = repositorioUsuario.findByPessoa(pessoa);
                if (usuarioOpt.isPresent()) {
                    // Define o email visual da pessoa como o login do usuário
                    pessoa.setEmail(usuarioOpt.get().getLogin());
                }
            }
        }

        return clientes;
    }
    
    /**
     * Busca um Cliente pelo ID.
     */
    public Optional<Cliente> buscarPorId(Integer id) {
        return repositorioCliente.findById(id);
    }

    /**
     * Deleta um Cliente, seu Usuário de acesso e seus dados de Pessoa.
     * Impede a exclusão se houver contratos vinculados.
     */
    @Transactional
    public void deletar(Integer id) {
        // 1. Busca o Cliente
        Cliente cliente = repositorioCliente.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado."));

        Pessoa pessoa = cliente.getPessoa();
        Optional<Usuario> usuarioOpt = repositorioUsuario.findByPessoa(pessoa);

        // 2. Verifica se o usuário tem contratos
        if (usuarioOpt.isPresent()) {
            List<?> contratos = repositorioContrato.findByUsuarioClienteId(usuarioOpt.get().getId());
            if (!contratos.isEmpty()) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, 
                    "Este cliente possui contratos registrados e não pode ser excluído."
                );
            }
        }

        // 3. Remove na ordem correta (Filhos -> Pai) para evitar erro de FK
        
        // Remove o registro da tabela tb_cliente
        repositorioCliente.delete(cliente);
        
        // Remove o login (tb_usuarios)
        if (usuarioOpt.isPresent()) {
            repositorioUsuario.delete(usuarioOpt.get());
        }

        // Remove os dados pessoais (tb_pessoa)
        repositorioPessoa.delete(pessoa);
    }
}