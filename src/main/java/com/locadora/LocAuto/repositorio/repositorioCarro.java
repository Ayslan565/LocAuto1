package com.locadora.LocAuto.repositorio;
import org.springframework.data.jpa.repository.JpaRepository;

import com.locadora.LocAuto.Model.Carro;

public interface repositorioCarro extends JpaRepository<Carro, Integer> {}
