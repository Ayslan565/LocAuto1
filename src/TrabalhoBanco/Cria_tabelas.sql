-- 1 Para Rodar na hr de criar bd

CREATE TABLE IF NOT EXISTS tb_pessoa(
    id_pessoa int primary key,
    cpf varchar(11) not null UNIQUE,
    nome varchar(255) not null,
    data_nasc date,
    cep varchar(8),
    municipio varchar(255),
    uf varchar(2),
    complemento varchar(255),
    email varchar(255),
    telefone1 double,
    telefone2 double
);

CREATE TABLE IF NOT EXISTS tb_carro(
    id_carro int primary key,
    placa varchar(7) UNIQUE,
    quilometragem double,
    cor varchar(255),
    status boolean,
    ano_fabricacao year,
    nome varchar(255)
);


CREATE TABLE IF NOT EXISTS tb_grupos_usuarios (
    id_grupo INT PRIMARY KEY,
    nome_grupo VARCHAR(50) NOT NULL UNIQUE,
    descricao TEXT
);


CREATE TABLE IF NOT EXISTS tb_usuarios (
    id_usuario INT PRIMARY KEY,
    login VARCHAR(255) NOT NULL UNIQUE, 
    senha VARCHAR(255) NOT NULL,           
    fk_id_pessoa INT,
    fk_id_grupo INT,
    
    FOREIGN KEY (fk_id_pessoa) REFERENCES tb_pessoa(id_pessoa),
    FOREIGN KEY (fk_id_grupo) REFERENCES tb_grupos_usuarios(id_grupo)
);

CREATE TABLE IF NOT EXISTS tb_contrato(
    id_contrato int primary key ,
    data_inicio date not null,
    data_fim date,
    valor_total decimal(10, 2),
    
    fk_id_usuario_cliente INT,
    fk_id_carro int,
    
    FOREIGN KEY (fk_id_usuario_cliente) REFERENCES tb_usuarios(id_usuario),
    FOREIGN KEY (fk_id_carro) REFERENCES tb_carro(id_carro)
);

CREATE TABLE IF NOT EXISTS tb_funcionario(
    id_funcionarios int primary key ,
    data_admissao date not null,
    cargo varchar(255) not null,
    salario double not null,
    
  
    fk_id_pessoa int,
    
    FOREIGN KEY (fk_id_pessoa) REFERENCES tb_pessoa(id_pessoa)
);