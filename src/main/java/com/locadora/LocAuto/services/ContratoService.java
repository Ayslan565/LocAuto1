package com.locadora.LocAuto.services;

import com.locadora.LocAuto.Model.Carro; 
import com.locadora.LocAuto.Model.Contrato;
import com.locadora.LocAuto.Model.Funcionario; 
import com.locadora.LocAuto.Model.Usuario; 
import com.locadora.LocAuto.dto.ContratoFormDTO; 
import com.locadora.LocAuto.dto.ContratoRespostaDTO;
import com.locadora.LocAuto.dto.ContratoDetalheDTO;
import com.locadora.LocAuto.repositorio.RepositorioCarro; 
import com.locadora.LocAuto.repositorio.RepositorioContrato;
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
        
        // Tranca o carro
        carro.setStatus(false);
        repositorioCarro.save(carro);
        
        Contrato contratoSalvo = repositorioContrato.save(contrato);
        
        // Retorna o DTO de Resposta Corrigido
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
        Iterable<Contrato> contratos;

        // CORREÇÃO (N+1): Usa os novos métodos otimizados do repositório
        if ("GERENTE".equals(role) || "FUNCIONARIO".equals(role)) {
            contratos = repositorioContrato.findAllCompletos();
        } 
        else if ("CLIENTE".equals(role)) {
            contratos = repositorioContrato.findByUsuarioClienteCompleto(usuarioAutenticado);
        }
        else {
            contratos = List.of(); 
        }
        
        // CORREÇÃO (Dados Órfãos):
        // Mapeia para DTOs com checagem de segurança para dados órfãos (nulls)
        return ((List<Contrato>) contratos).stream()
            .map(contrato -> {
                
                // Checagem de segurança para Cliente (Usuario)
                String clienteNome = "Cliente Inválido/Excluído";
                if (contrato.getUsuarioCliente() != null && contrato.getUsuarioCliente().getPessoa() != null) {
                    clienteNome = contrato.getUsuarioCliente().getPessoa().getNome();
                }

                // Checagem de segurança para Carro
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
                    clienteNome, // Nome seguro
                    carroNome      // Nome seguro
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
    
    /**
     * NOVO MÉTODO: Conclui um contrato e libera o carro.
     * Esta é a regra de negócio que substitui a necessidade de uma trigger.
     */
    @Transactional
    public ContratoDetalheDTO concluirContrato(Integer id) {
        // 1. Encontra o contrato ou falha
        Contrato contrato = repositorioContrato.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contrato não encontrado."));

        // 2. Pega o carro associado
        Carro carro = contrato.getCarro();
        if (carro == null) {
            // Se o carro foi excluído (dado órfão), apenas marca o contrato como concluído
             contrato.setStatusContrato("CONCLUIDO");
             repositorioContrato.save(contrato);
        } else {
             // 3. Atualiza os status
            contrato.setStatusContrato("CONCLUIDO");
            carro.setStatus(true); // true = Disponível

            // 4. Salva as duas entidades na mesma transação
            repositorioContrato.save(contrato);
            repositorioCarro.save(carro);
        }

        // 5. Retorna o DTO atualizado para o frontend
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