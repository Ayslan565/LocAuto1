package com.locadora.LocAuto.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.locadora.LocAuto.dto.DashboardResumoDTO;
import com.locadora.LocAuto.repositorio.RepositorioCarro; // Corrigido
import com.locadora.LocAuto.repositorio.repositorioCliente; // (Pode corrigir este também)
import com.locadora.LocAuto.repositorio.RepositorioContrato; // Corrigido

@Service
public class DashboardService {

    @Autowired
    private RepositorioCarro repositorioCarro; // Corrigido

    @Autowired
    private repositorioCliente repositorioCliente;
    
    @Autowired
    private RepositorioContrato repositorioContrato; // Corrigido

    public DashboardResumoDTO getResumo() {
        // Corrigido para usar o método que filtra por 'ativo=true'
        long disponiveis = repositorioCarro.countByStatusAndAtivoIsTrue(true);
        long alugados = repositorioCarro.countByStatusAndAtivoIsTrue(false);
        
        long clientes = repositorioCliente.count();
        long ativos = repositorioContrato.countByStatusContrato("ATIVO"); 

        return new DashboardResumoDTO(disponiveis, alugados, clientes, ativos);
    }
}