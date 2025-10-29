package com.locadora.LocAuto.services;


import org.springframework.stereotype.Service;


import com.locadora.LocAuto.Model.Carro;
@Service
public class CarroServices {
    
    public void adicionarInfPessoa(Carro carro){
        com.locadora.LocAuto.repositorio.repositorioCarro.save(carro);
    }
    public Iterable<Carro> listarCarro() {
        return com.locadora.LocAuto.repositorio.repositorioCarro.findAll();
    }
    public static void adicionarInfCarro(Carro carro) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'adicionarInfCarro'");
    }}