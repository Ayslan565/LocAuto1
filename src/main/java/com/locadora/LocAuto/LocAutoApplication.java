package com.locadora.LocAuto;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableJpaRepositories(
    // 1. Diz ao MySQL (JPA) para olhar a pasta raiz dos repositórios...
    basePackages = "com.locadora.LocAuto.repositorio",
    // 2. ...MAS OBRIGA ele a ignorar a pasta 'mongo' (Isso é crucial!)
    excludeFilters = @ComponentScan.Filter(type = FilterType.REGEX, pattern = "com\\.locadora\\.LocAuto\\.repositorio\\.mongo\\..*")
)
@EnableMongoRepositories(
    // 3. Diz ao MongoDB para olhar APENAS a pasta 'mongo'
    basePackages = "com.locadora.LocAuto.repositorio.mongo"
)
public class LocAutoApplication {

    public static void main(String[] args) {
        SpringApplication.run(LocAutoApplication.class, args);
    }
}