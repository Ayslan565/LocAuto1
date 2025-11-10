package com.locadora.LocAuto.config;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class DataSourceConfig {

    private String databaseUrl = "jdbc:mysql://127.0.0.1:3306/locauto?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&useLegacyDatetimeCode=false";
    
    @Bean
    public DataSource administradorTiDataSource() {
        return DataSourceBuilder.create()
                .url(databaseUrl)
                .username("administrador_TI") 
                .password("1234")         
                .build();
    }
    
    // (Os outros DataSources 'gerenteDataSource', 'funcionarioDataSource', etc. 
    // podem continuar aqui, não faz mal)
    @Bean
    public DataSource gerenteDataSource() {
        return DataSourceBuilder.create()
                .url(databaseUrl)
                .username("user_gerente") 
                .password("1234")         
                .build();
    }

    @Bean
    public DataSource funcionarioDataSource() {
        return DataSourceBuilder.create()
                .url(databaseUrl)
                .username("user_funcionario") 
                .password("1234")           
                .build();
    }

    @Bean
    public DataSource clienteDataSource() {
        return DataSourceBuilder.create()
                .url(databaseUrl)
                .username("user_cliente") 
                .password("1234")         
                .build();
    }


    @Bean
    @Primary 
    public DataSource dataSource() {
        
        // --- REMOVEMOS O TENANTROUTINGDATASOURCE ---
        
        // APLICAÇÃO USARÁ APENAS O ADMINISTRADOR_TI
        // Isto resolve o erro 401 no cadastro E o loop "pisca e expulsa" no login.
        return administradorTiDataSource();
    }
}