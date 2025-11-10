package com.locadora.LocAuto.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.locadora.LocAuto.Model.Funcionario;
import com.locadora.LocAuto.Model.Pessoa;
import com.locadora.LocAuto.dto.FuncionarioCadastroDTO; 
import com.locadora.LocAuto.repositorio.repositorioFuncionario;

import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
import java.util.Date;

@Service
public class FuncionarioService {

    @Autowired
    private repositorioFuncionario repositorioFuncionario;
    
    @Autowired
    private PessoasServices pessoasServices;
    
    @Autowired
    private UsuarioService usuarioService;

    /**
     * Valida se a pessoa atingiu a maioridade (18 anos).
     * Reutilizada do ClienteService.
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
                "Funcionário deve ter no mínimo 18 anos para se cadastrar."
            );
        }
    }

    /**
     * Fluxo transacional para salvar Pessoa, Funcionario e criar o registro de Usuário.
     */
    @Transactional 
    public Funcionario adicionarInfFuncionario(FuncionarioCadastroDTO dto) {
        
        String login = dto.getLogin();
        String senhaPura = dto.getSenhaPura();
        String nomeGrupo = dto.getTipoCadastro(); // "FUNCIONARIO" ou "GERENTE"
        Pessoa pessoa = dto.getPessoa(); 
        
        // 0. Pré-validação do Login 
        if (usuarioService.loginExiste(login)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, 
                "O login (e-mail) já está cadastrado no sistema."
            );
        }
        
        // NOVO: 0.5. Validação de Regra de Negócio (Maioridade)
        validarMaioridade(pessoa.getData_nasc());


        Pessoa pessoaSalva;
        Funcionario funcionarioSalvo;
        
        try {
            // 1. Salvar Pessoa 
            pessoaSalva = pessoasServices.adicionarInfPessoa(pessoa); 
            
            // 2. Salvar Funcionário (Garante o registro na tb_funcionario)
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
        
        // 3. Criar o Usuário (Login, Senha Criptografada e Perfil)
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

    public Iterable<Funcionario> listarFuncionarios() {
        return repositorioFuncionario.findAll();
    }
}