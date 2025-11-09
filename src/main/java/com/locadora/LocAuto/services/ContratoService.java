package com.locadora.LocAuto.services;

import com.locadora.LocAuto.Model.Contrato;
import com.locadora.LocAuto.Model.Usuario; // NOVO
import com.locadora.LocAuto.repositorio.repositorioContrato;
import com.locadora.LocAuto.repositorio.repositorioUsuario; // NOVO
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication; // NOVO
import org.springframework.security.core.context.SecurityContextHolder; // NOVO
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
    private CarroServices carroServices; // Usado para verificar a disponibilidade do carro

    @Autowired
    private repositorioUsuario repositorioUsuario; // NOVO: Injeção para buscar o usuário logado

    /**
     * Calcula o valor total do contrato (Simulação para fins de exemplo).
     */
    private BigDecimal calcularValorTotal(Date dataInicio, Date dataFim) {
        if (dataInicio != null && dataFim != null) {
            // Valor simulado
            return new BigDecimal("1500.00"); 
        }
        return BigDecimal.ZERO;
    }
    
    @Transactional
    public Contrato salvar(Contrato contrato) {
        // 1. Validação e Regras de Negócio
        
        if (contrato.getDataInicio() == null) {
            contrato.setDataInicio(new Date()); // Define a data de início se não for fornecida
        }
        
        if (contrato.getCarro() == null || contrato.getCarro().getIdCarro() == null) {
             throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Contrato deve estar associado a um Carro válido.");
        }
        
        // 2. Validação de Disponibilidade
        carroServices.buscarPorId(contrato.getCarro().getIdCarro()).ifPresentOrElse(carro -> {
            if (!carro.getStatus()) {
                 throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O carro selecionado não está disponível para locação.");
            }
        }, () -> {
             throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Carro com ID " + contrato.getCarro().getIdCarro() + " não encontrado.");
        });

        // 3. Cálculo do Valor
        contrato.setValorTotal(calcularValorTotal(contrato.getDataInicio(), contrato.getDataFim()));
        
        // 4. Salvar
        // (A Trigger 'trg_carro_alugado_status' cuidará de mudar o status do carro no BD)
        return repositorioContrato.save(contrato);
    }

    public Optional<Contrato> buscarPorId(Integer id) {
        // Lógica de autorização de leitura pode ser adicionada aqui se necessário
        return repositorioContrato.findById(id);
    }

    /**
     * MÉTODO ATUALIZADO: Filtra a lista de contratos com base no perfil do usuário logado.
     * @return Uma lista filtrada de contratos (Iterable).
     */
    public Iterable<Contrato> listarTodos() {
        
        // 1. Obter a autenticação do contexto
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loginUsuario = authentication.getName(); 
        
        // 2. Buscar a entidade completa do usuário (necessário para o filtro do JPA)
        Usuario usuarioAutenticado = repositorioUsuario.findByLogin(loginUsuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário autenticado não encontrado no BD."));
        
        // 3. Extrair a Role para aplicação da lógica de negócio (Segurança em Nível de Dados)
        String role = usuarioAutenticado.getGrupoUsuario().getNomeGrupo(); 

        if ("GERENTE".equals(role)) {
            // Gerente tem acesso total
            return repositorioContrato.findAll();
        } 
        
        if ("CLIENTE".equals(role)) {
            // Cliente só vê os seus contratos (usa o método findByUsuarioCliente que precisa ser criado no Repositório)
            // É CRÍTICO que o repositório tenha: Iterable<Contrato> findByUsuarioCliente(Usuario usuarioCliente);
            return repositorioContrato.findByUsuarioCliente(usuarioAutenticado);
        }
        
        if ("FUNCIONARIO".equals(role)) {
            // Funcionário: Lógica de negócio não definida, mas geralmente veria todos, exceto os privados.
            // Por segurança, vamos apenas dar acesso total temporário ou filtrar se a regra for definida.
            // Para este exemplo, funcionário vê todos os contratos abertos:
            return repositorioContrato.findAll();
        }

        // Se o perfil não for mapeado, retorna lista vazia por segurança
        return List.of(); 
    }

    public void deletar(Integer id) {
        if (!repositorioContrato.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Contrato não encontrado.");
        }
        // Lógica de autorização (ex: se for CLIENTE, só pode deletar se o contrato pertencer a ele)
        // ...
        
        repositorioContrato.deleteById(id);
        // Em um sistema completo, o status do carro deveria ser revertido para TRUE aqui (já que a Trigger não faz rollback).
    }
}