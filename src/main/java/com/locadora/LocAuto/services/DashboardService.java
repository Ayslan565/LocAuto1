package com.locadora.LocAuto.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.locadora.LocAuto.dto.DashboardResumoDTO;
import com.locadora.LocAuto.repositorio.repositorioCarro;
import com.locadora.LocAuto.repositorio.repositorioCliente;
import com.locadora.LocAuto.repositorio.repositorioContrato;

@Service
public class DashboardService {

    @Autowired
    private repositorioCarro repositorioCarro;

    @Autowired
    private repositorioCliente repositorioCliente;
    
    @Autowired
    private repositorioContrato repositorioContrato; 

    public DashboardResumoDTO getResumo() {
        long disponiveis = repositorioCarro.countByStatus(true);
        long alugados = repositorioCarro.countByStatus(false);
        long clientes = repositorioCliente.count();
        long ativos = repositorioContrato.countByStatusContrato("ATIVO"); 

        return new DashboardResumoDTO(disponiveis, alugados, clientes, ativos);
    }
}