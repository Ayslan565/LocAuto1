package com.locadora.LocAuto.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.locadora.LocAuto.Model.Funcionario;
import com.locadora.LocAuto.Model.Pessoa;
import com.locadora.LocAuto.Model.Usuario; 
import com.locadora.LocAuto.dto.FuncionarioCadastroDTO; 
import com.locadora.LocAuto.repositorio.repositorioFuncionario;
import com.locadora.LocAuto.repositorio.RepositorioContrato; 
import com.locadora.LocAuto.repositorio.repositorioUsuario; 
import com.locadora.LocAuto.repositorio.repositorioPessoa; 

import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
import java.util.Date;
import java.util.Optional; 

@Service
public class FuncionarioService {

    @Autowired
    private repositorioFuncionario repositorioFuncionario;
    
    @Autowired
    private PessoasServices pessoasServices;
    
    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private repositorioUsuario repositorioUsuario;

    @Autowired
    private repositorioPessoa repositorioPessoa;

    @Autowired
    private RepositorioContrato repositorioContrato;

    // Validação de maioridade
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
                "Funcionário deve ter no mínimo 18 anos para se cadastrar."
            );
        }
    }

    // Cadastro de Funcionário
    @Transactional 
    public Funcionario adicionarInfFuncionario(FuncionarioCadastroDTO dto) {
        
        String login = dto.getLogin();
        String senhaPura = dto.getSenhaPura();
        String nomeGrupo = dto.getTipoCadastro(); 
        Pessoa pessoa = dto.getPessoa(); 
        
        if (usuarioService.loginExiste(login)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, 
                "O login (e-mail) já está cadastrado no sistema."
            );
        }
        
        validarMaioridade(pessoa.getData_nasc());

        Pessoa pessoaSalva;
        Funcionario funcionarioSalvo;
        
        try {
            pessoaSalva = pessoasServices.adicionarInfPessoa(pessoa); 
            
            Funcionario novoFuncionario = new Funcionario();
            novoFuncionario.setPessoa(pessoaSalva); 
            novoFuncionario.setCargo(dto.getCargo());
            novoFuncionario.setDataAdmissao(dto.getData_admissao());
            novoFuncionario.setSalario(dto.getSalario());
            
            funcionarioSalvo = repositorioFuncionario.save(novoFuncionario);

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
             throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno ao salvar Pessoa/Funcionário: " + e.getMessage());
        }
        
        try {
            usuarioService.criarUsuarioComAcesso(
                login, 
                senhaPura, 
                pessoaSalva, 
                nomeGrupo
            );
        } catch (RuntimeException e) {
            String warn = "Aviso: falha ao criar usuário para pessoa id=" + pessoaSalva.getId() + ": " + e.getMessage();
            System.err.println(warn);
        }

        return funcionarioSalvo;
    }

    // Listar todos
    public Iterable<Funcionario> listarFuncionarios() {
        return repositorioFuncionario.findAll();
    }

    // Buscar por ID (NECESSÁRIO PARA O BOTÃO OLHINHO/EDITAR)
    public Optional<Funcionario> buscarPorId(Integer id) {
        return repositorioFuncionario.findById(id);
    }

    // Atualizar Funcionário (NECESSÁRIO PARA O BOTÃO SALVAR DO MODAL)
    @Transactional
    public Funcionario atualizarInfFuncionario(Integer id, FuncionarioCadastroDTO dto) {
        
        // 1. Busca o funcionário existente
        Funcionario func = repositorioFuncionario.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário não encontrado."));
        
        // 2. Atualiza os dados da Pessoa (usando o ID da pessoa já associada)
        Pessoa pessoaParaAtualizar = dto.getPessoa();
        pessoaParaAtualizar.setId(func.getPessoa().getId()); // Garante que atualiza a mesma pessoa
        
        // Salva a pessoa atualizada
        Pessoa pessoaAtualizada = pessoasServices.adicionarInfPessoa(pessoaParaAtualizar);

        // 3. Atualiza os dados do Funcionário
        func.setPessoa(pessoaAtualizada);
        func.setCargo(dto.getCargo());
        func.setSalario(dto.getSalario());
        func.setDataAdmissao(dto.getData_admissao());

        // 4. Salva o funcionário atualizado
        return repositorioFuncionario.save(func);
    }

    // Deletar Funcionário
    @Transactional
    public void deletar(Integer id) {
        // 1. Acha o funcionário
        Funcionario funcionario = repositorioFuncionario.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário não encontrado."));

        // 2. Verifica se ele tem contratos
        long totalContratos = repositorioContrato.countByFuncionario(funcionario);
        if (totalContratos > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                "Este funcionário está vinculado a " + totalContratos + " contrato(s) e não pode ser excluído.");
        }

        // 3. Busca a Pessoa e o Usuario associados
        Pessoa pessoa = funcionario.getPessoa();
        Optional<Usuario> usuarioOpt = repositorioUsuario.findByPessoa(pessoa);

        // 4. Deleta as entidades na ordem correta (filhos primeiro)
        repositorioFuncionario.delete(funcionario);
        
        if (usuarioOpt.isPresent()) {
            repositorioUsuario.delete(usuarioOpt.get());
        }

        // 5. Deleta a Pessoa (pai)
        repositorioPessoa.delete(pessoa);
    }
}