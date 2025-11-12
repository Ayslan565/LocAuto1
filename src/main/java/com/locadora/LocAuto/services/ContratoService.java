package com.locadora.LocAuto.services;

import com.locadora.LocAuto.Model.Carro; 
import com.locadora.LocAuto.Model.Contrato;
import com.locadora.LocAuto.Model.Funcionario; 
import com.locadora.LocAuto.Model.Usuario; 
import com.locadora.LocAuto.Model.Cliente; // 1. IMPORTAR CLIENTE
import com.locadora.LocAuto.Model.Pessoa;  // 1. IMPORTAR PESSOA
import com.locadora.LocAuto.dto.ContratoFormDTO; 
import com.locadora.LocAuto.dto.ContratoRespostaDTO;
import com.locadora.LocAuto.dto.ContratoDetalheDTO;
import com.locadora.LocAuto.repositorio.RepositorioCarro; 
import com.locadora.LocAuto.repositorio.RepositorioContrato;
import com.locadora.LocAuto.repositorio.repositorioFuncionario; 
import com.locadora.LocAuto.repositorio.repositorioUsuario; 
import com.locadora.LocAuto.repositorio.repositorioCliente; // 1. IMPORTAR REPOSITORIO CLIENTE

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication; 
import org.springframework.security.core.context.SecurityContextHolder; 
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; 
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.Date;
import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContratoService {

    @Autowired
    private RepositorioContrato repositorioContrato;
    
    @Autowired
    private CarroServices carroServices; 

    @Autowired
    private RepositorioCarro repositorioCarro; 
    
    @Autowired
    private repositorioUsuario repositorioUsuario; 
    
    @Autowired
    private repositorioFuncionario repositorioFuncionario; 

    // 2. INJETAR REPOSITORIO CLIENTE
    @Autowired
    private repositorioCliente repositorioCliente;

    private BigDecimal calcularValorTotal(Date dataInicio, Date dataFim) {
        if (dataInicio != null && dataFim != null) {
            long diff = dataFim.getTime() - dataInicio.getTime();
            long dias = Math.max(1, diff / (1000 * 60 * 60 * 24)); 
            return new BigDecimal(dias * 150.00); 
        }
        return new BigDecimal("150.00"); 
    }
    
    @Transactional
    public ContratoRespostaDTO salvar(ContratoFormDTO dto) { 
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loginFuncionario = authentication.getName();
        
        Usuario usuarioFuncionario = repositorioUsuario.findByLogin(loginFuncionario)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Funcionário logado não encontrado."));
        
        Funcionario funcionario = repositorioFuncionario.findByPessoa(usuarioFuncionario.getPessoa())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "O usuário logado não é um funcionário válido."));

        // --- CORREÇÃO AQUI ---
        // 3.1 Busca o CLIENTE pelo ID que veio do formulário (ID de tb_cliente)
        Cliente clienteEntidade = repositorioCliente.findById(dto.getIdClienteUsuario())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente selecionado não encontrado."));

        // 3.2 Pega a PESSOA desse cliente
        Pessoa pessoaCliente = clienteEntidade.getPessoa();

        // 3.3 Acha o USUÁRIO vinculado a essa Pessoa (para salvar na FK do contrato)
        Usuario usuarioDoCliente = repositorioUsuario.findByPessoa(pessoaCliente)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário de login associado ao cliente não encontrado."));
        // ---------------------

        Carro carro = repositorioCarro.findById(dto.getIdCarro())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Carro selecionado não encontrado."));
        
        if (carro.getStatus() == null || !carro.getStatus()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O carro selecionado não está disponível para locação.");
        }

        Contrato contrato = new Contrato();
        contrato.setDataInicio(dto.getDataInicio() != null ? dto.getDataInicio() : new Date());
        contrato.setDataFim(dto.getDataFim());
        contrato.setFuncionario(funcionario); 
        contrato.setUsuarioCliente(usuarioDoCliente); // Usa o usuário correto encontrado
        contrato.setCarro(carro);
        contrato.setValorTotal(calcularValorTotal(contrato.getDataInicio(), contrato.getDataFim()));
        contrato.setStatusContrato("ATIVO");
        
        carro.setStatus(false);
        repositorioCarro.save(carro);
        
        Contrato contratoSalvo = repositorioContrato.save(contrato);
        
        return new ContratoRespostaDTO(contratoSalvo.getIdContrato(), contratoSalvo.getStatusContrato());
    }

    public Optional<Contrato> buscarPorId(Integer id) {
        return repositorioContrato.findById(id);
    }

    @Transactional(readOnly = true) 
    public List<ContratoDetalheDTO> listarTodos() { 
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loginUsuario = authentication.getName(); 
        
        Usuario usuarioAutenticado = repositorioUsuario.findByLogin(loginUsuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário autenticado não encontrado no BD."));
        
        String role = usuarioAutenticado.getGrupoUsuario().getNomeGrupo(); 
        List<Contrato> contratos;

        if ("GERENTE".equals(role) || "FUNCIONARIO".equals(role)) {
            contratos = repositorioContrato.findAllCompletos();
        } 
        else if ("CLIENTE".equals(role)) {
            contratos = repositorioContrato.findByUsuarioClienteId(usuarioAutenticado.getId());
        }
        else {
            contratos = List.of(); 
        }
        
        return contratos.stream()
            .map(contrato -> {
                
                String clienteNome = "Cliente Inválido/Excluído";
                if (contrato.getUsuarioCliente() != null && contrato.getUsuarioCliente().getPessoa() != null) {
                    clienteNome = contrato.getUsuarioCliente().getPessoa().getNome();
                }

                String carroNome = "Carro Inválido/Excluído";
                if (contrato.getCarro() != null) {
                    carroNome = contrato.getCarro().getNome();
                }

                return new ContratoDetalheDTO(
                    contrato.getIdContrato(),
                    contrato.getDataInicio(),
                    contrato.getDataFim(),
                    contrato.getValorTotal(),
                    contrato.getStatusContrato(),
                    clienteNome, 
                    carroNome
                );
            })
            .collect(Collectors.toList());
    }

    public void deletar(Integer id) {
        if (!repositorioContrato.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Contrato não encontrado.");
        }
        repositorioContrato.deleteById(id);
    }
    
    @Transactional
    public ContratoDetalheDTO concluirContrato(Integer id) {
        Contrato contrato = repositorioContrato.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contrato não encontrado."));

        Carro carro = contrato.getCarro();
        if (carro == null) {
             contrato.setStatusContrato("CONCLUIDO");
             repositorioContrato.save(contrato);
        } else {
            contrato.setStatusContrato("CONCLUIDO");
            carro.setStatus(true); 
            repositorioContrato.save(contrato);
            repositorioCarro.save(carro);
        }

        return new ContratoDetalheDTO(
                contrato.getIdContrato(),
                contrato.getDataInicio(),
                contrato.getDataFim(),
                contrato.getValorTotal(),
                contrato.getStatusContrato(),
                (contrato.getUsuarioCliente() != null && contrato.getUsuarioCliente().getPessoa() != null) 
                    ? contrato.getUsuarioCliente().getPessoa().getNome() : "Cliente Excluído",
                (contrato.getCarro() != null) ? contrato.getCarro().getNome() : "Carro Excluído"
        );
    }
}

