package com.locadora.LocAuto.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.locadora.LocAuto.Model.Carro;
import com.locadora.LocAuto.repositorio.repositorioCarro;
@Service
public class CarroServices {
    @Autowired
    private repositorioCarro repoCarro; 

    
    public void adicionarInfCarro(Carro carro) {
        repoCarro.save(carro); 
    }

    // 3. Método de Listagem Corrigido
    public Iterable<Carro> listarCarro() {
        return repoCarro.findAll(); 
    }
}