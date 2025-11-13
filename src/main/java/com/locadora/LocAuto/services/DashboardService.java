package com.locadora.LocAuto.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.locadora.LocAuto.dto.DashboardResumoDTO;
import com.locadora.LocAuto.repositorio.RepositorioCarro;
import com.locadora.LocAuto.repositorio.repositorioCliente;
import com.locadora.LocAuto.repositorio.RepositorioContrato;
import com.locadora.LocAuto.repositorio.repositorioUsuario;
import com.locadora.LocAuto.Model.Usuario;

@Service
public class DashboardService {

    @Autowired
    private RepositorioCarro repositorioCarro;

    @Autowired
    private repositorioCliente repositorioCliente;
    
    @Autowired
    private RepositorioContrato repositorioContrato;
    
    @Autowired
    private repositorioUsuario repositorioUsuario;

    public DashboardResumoDTO getResumo() {
        // 1. Identificar quem está logado no sistema
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loginUsuario = authentication.getName();
        
        // Busca o usuário completo para saber o ID e o Perfil (Grupo)
        Usuario usuarioAutenticado = repositorioUsuario.findByLogin(loginUsuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));
        
        String role = usuarioAutenticado.getGrupoUsuario().getNomeGrupo();

        // 2. Buscar dados gerais da frota (Iguais para todos os perfis)
        // Usa o método que filtra apenas carros ativos (não excluídos logicamente)
        long disponiveis = repositorioCarro.countByStatusAndAtivoIsTrue(true);
        long alugados = repositorioCarro.countByStatusAndAtivoIsTrue(false);
        
        long clientes; 
        long ativos;
        long inativos; // Novo contador para contratos concluídos

        // 3. Lógica Diferenciada por Perfil
        if ("CLIENTE".equals(role)) {
            // --- VISÃO DO CLIENTE ---
            // Vê apenas os SEUS contratos (filtrado pelo ID do usuário logado)
            ativos = repositorioContrato.countByUsuarioClienteIdAndStatusContrato(usuarioAutenticado.getId(), "ATIVO");
            inativos = repositorioContrato.countByUsuarioClienteIdAndStatusContrato(usuarioAutenticado.getId(), "CONCLUIDO");
            
            // O número total de clientes da loja é irrelevante para o cliente final,
            // então retornamos 1 (representando ele mesmo) ou 0 para não poluir o dashboard.
            clientes = 1; 
        } else {
            // --- VISÃO DO GERENTE / FUNCIONÁRIO ---
            // Vê os totais GERAIS da locadora
            ativos = repositorioContrato.countByStatusContrato("ATIVO");
            inativos = repositorioContrato.countByStatusContrato("CONCLUIDO");
            clientes = repositorioCliente.count();
        }

        // Retorna o DTO com os 5 campos (incluindo o novo 'inativos')
        return new DashboardResumoDTO(disponiveis, alugados, clientes, ativos, inativos);
    }
}