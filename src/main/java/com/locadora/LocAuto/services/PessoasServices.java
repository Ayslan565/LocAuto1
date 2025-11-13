package com.locadora.LocAuto.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.locadora.LocAuto.Model.Pessoa;
import com.locadora.LocAuto.repositorio.repositorioPessoa;

import java.util.Optional;

@Service
public class PessoasServices {

    @Autowired
    private repositorioPessoa repositorioPessoa;

    @Transactional
    public Pessoa adicionarInfPessoa(Pessoa pessoa) {
        if (pessoa == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dados da Pessoa ausentes.");
        }
        return repositorioPessoa.save(pessoa);
    }

    // --- MÉTODO DE ATUALIZAÇÃO ---
    @Transactional
    public Pessoa atualizar(Integer id, Pessoa pessoaAtualizada) {
        Pessoa pessoaBanco = repositorioPessoa.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pessoa não encontrada."));

        // Atualiza os campos com base nos dados recebidos
        pessoaBanco.setNome(pessoaAtualizada.getNome());
        pessoaBanco.setcpf(pessoaAtualizada.getcpf());
        pessoaBanco.setEmail(pessoaAtualizada.getEmail());
        pessoaBanco.setData_nasc(pessoaAtualizada.getData_nasc());
        pessoaBanco.setTelefone1(pessoaAtualizada.getTelefone1());
        pessoaBanco.setTelefone2(pessoaAtualizada.getTelefone2());
        pessoaBanco.setCep(pessoaAtualizada.getCep());
        pessoaBanco.setUf(pessoaAtualizada.getUf());
        pessoaBanco.setMunicipio(pessoaAtualizada.getMunicipio());
        pessoaBanco.setEndereco(pessoaAtualizada.getEndereco());
        pessoaBanco.setComplemento(pessoaAtualizada.getComplemento());

        return repositorioPessoa.save(pessoaBanco);
    }

    @Transactional(readOnly = true)
    public Iterable<Pessoa> listarPessoas(String cpf) {
        if (cpf != null && !cpf.isBlank()) {
            return repositorioPessoa.findByCpfStartsWith(cpf);
        }
        return repositorioPessoa.findAll();
    }

    @Transactional(readOnly = true)
    public Pessoa buscarPorCpf(String cpf) {
        return repositorioPessoa.findByCpf(cpf)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "CPF não encontrado."));
    }

    @Transactional(readOnly = true)
    public Optional<Pessoa> buscarPorId(Integer id) {
        return repositorioPessoa.findById(id);
    }

    @Transactional
    public void deletar(Integer id) {
        if (!repositorioPessoa.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ID não encontrado.");
        }
        repositorioPessoa.deleteById(id);
    }
}