package com.locadora.LocAuto.services;

import com.locadora.LocAuto.Model.Carro; 
import com.locadora.LocAuto.Model.Contrato;
import com.locadora.LocAuto.Model.Funcionario; 
import com.locadora.LocAuto.Model.Usuario; 
import com.locadora.LocAuto.dto.ContratoFormDTO; 
import com.locadora.LocAuto.repositorio.repositorioCarro; 
import com.locadora.LocAuto.repositorio.repositorioContrato;
import com.locadora.LocAuto.repositorio.repositorioFuncionario; 
import com.locadora.LocAuto.repositorio.repositorioUsuario; 
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

@Service
public class ContratoService {

    @Autowired
    private repositorioContrato repositorioContrato;
    
    @Autowired
    private CarroServices carroServices; 

    @Autowired
    private repositorioCarro repositorioCarro; 
    
    @Autowired
    private repositorioUsuario repositorioUsuario; 
    
    @Autowired
    private repositorioFuncionario repositorioFuncionario; 


    private BigDecimal calcularValorTotal(Date dataInicio, Date dataFim) {
        if (dataInicio != null && dataFim != null) {
            long diff = dataFim.getTime() - dataInicio.getTime();
            long dias = Math.max(1, diff / (1000 * 60 * 60 * 24)); // Pelo menos 1 dia
            return new BigDecimal(dias * 150.00); 
        }
        return new BigDecimal("150.00"); 
    }
    
    @Transactional
    public Contrato salvar(ContratoFormDTO dto) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loginFuncionario = authentication.getName();
        
        Usuario usuarioFuncionario = repositorioUsuario.findByLogin(loginFuncionario)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Funcionário logado não encontrado."));
        
        // Esta linha agora funciona (findByPessoa)
        Funcionario funcionario = repositorioFuncionario.findByPessoa(usuarioFuncionario.getPessoa())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "O usuário logado não é um funcionário válido."));

        Usuario cliente = repositorioUsuario.findById(dto.getIdClienteUsuario())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente selecionado (ID Usuário) não encontrado."));

        Carro carro = repositorioCarro.findById(dto.getIdCarro())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Carro selecionado não encontrado."));
        
        if (carro.getStatus() == null || !carro.getStatus()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O carro selecionado não está disponível para locação.");
        }

        Contrato contrato = new Contrato();
        contrato.setDataInicio(dto.getDataInicio() != null ? dto.getDataInicio() : new Date());
        contrato.setDataFim(dto.getDataFim());
        contrato.setFuncionario(funcionario); 
        contrato.setUsuarioCliente(cliente);
        contrato.setCarro(carro);
        contrato.setValorTotal(calcularValorTotal(contrato.getDataInicio(), contrato.getDataFim()));
        contrato.setStatusContrato("ATIVO");
        
        return repositorioContrato.save(contrato);
    }

    public Optional<Contrato> buscarPorId(Integer id) {
        return repositorioContrato.findById(id);
    }

    @Transactional(readOnly = true) 
    public Iterable<Contrato> listarTodos() {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loginUsuario = authentication.getName(); 
        
        Usuario usuarioAutenticado = repositorioUsuario.findByLogin(loginUsuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário autenticado não encontrado no BD."));
        
        String role = usuarioAutenticado.getGrupoUsuario().getNomeGrupo(); 

        if ("GERENTE".equals(role) || "FUNCIONARIO".equals(role)) {
            return repositorioContrato.findAll();
        } 
        
        if ("CLIENTE".equals(role)) {
            return repositorioContrato.findByUsuarioCliente(usuarioAutenticado);
        }

        return List.of(); 
    }

    public void deletar(Integer id) {
        if (!repositorioContrato.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Contrato não encontrado.");
        }
        repositorioContrato.deleteById(id);
    }
}