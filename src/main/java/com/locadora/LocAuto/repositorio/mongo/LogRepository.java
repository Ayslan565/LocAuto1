package com.locadora.LocAuto.repositorio.mongo;

import com.locadora.LocAuto.Model.LogSistema;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LogRepository extends MongoRepository<LogSistema, String> {
    // Métodos customizados do MongoDB podem ser adicionados aqui, se necessário.
}