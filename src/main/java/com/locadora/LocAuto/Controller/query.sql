CREATE SCHEMA IF NOT EXISTS LocAuto DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE LocAuto;

CREATE TABLE IF NOT EXISTS tb_pessoa (
  id_pessoa INT NOT NULL AUTO_INCREMENT,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  nome VARCHAR(255) NOT NULL,
  data_nasc DATE NULL,
  cep VARCHAR(9) NULL,
  municipio VARCHAR(255) NULL,
  uf VARCHAR(2) NULL,
  complemento VARCHAR(255) NULL,
  email VARCHAR(255) NULL,
  telefone1 DOUBLE NULL,
  telefone2 DOUBLE NULL,
  PRIMARY KEY (id_pessoa)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS tb_cliente (
  id_cliente INT NOT NULL AUTO_INCREMENT,
  fk_id_pessoa INT NOT NULL,
  
  PRIMARY KEY (id_cliente),
  
  CONSTRAINT fk_cliente_pessoa
    FOREIGN KEY (fk_id_pessoa)
    REFERENCES tb_pessoa (id_pessoa)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS tb_carro (
  id_carro INT NOT NULL AUTO_INCREMENT,
  placa VARCHAR(10) NOT NULL UNIQUE,
  modelo VARCHAR(100) NOT NULL,
  marca VARCHAR(100) NULL,
  ano INT NULL,
  status BOOLEAN NOT NULL DEFAULT TRUE,
  
  PRIMARY KEY (id_carro)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS tb_contrato (
  id_contrato INT NOT NULL AUTO_INCREMENT,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  valor_total DECIMAL(10,2) NOT NULL,
  status_contrato VARCHAR(20) NOT NULL,
  
  fk_funcionario_id INT NOT NULL,
  fk_cliente_usuario_id INT NOT NULL,
  fk_carro_id INT NOT NULL,
  
  PRIMARY KEY (id_contrato),
  
  CONSTRAINT fk_contrato_funcionario
    FOREIGN KEY (fk_funcionario_id)
    REFERENCES tb_pessoa (id_pessoa)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
    
  CONSTRAINT fk_contrato_cliente
    FOREIGN KEY (fk_cliente_usuario_id)
    REFERENCES tb_cliente (id_cliente)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
    
  CONSTRAINT fk_contrato_carro
    FOREIGN KEY (fk_carro_id)
    REFERENCES tb_carro (id_carro)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB ;