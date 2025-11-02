

/* 1. Inserir Pessoas */
INSERT INTO tb_pessoa (cpf, nome, data_nasc, email, telefone1) VALUES 
('11122233344', 'Ana Silva', '1990-05-15', 'ana.silva@email.com', 11987654321),
('55566677788', 'Bruno Costa', '1985-10-20', 'bruno.costa@locauto.com', 21912345678),
('99988877766', 'Carla Dias', '1980-01-30', 'carla.dias@locauto.com', 31956781234),
('12345678900', 'Daniel Moreira', '1995-03-22', 'daniel.moreira@email.com', 71988887777),
('44455566677', 'Eduardo Lima', '1992-07-10', 'eduardo.lima@locauto.com', 41977776666);

/* 2. Inserir Carros */
INSERT INTO tb_carro (placa, quilometragem, cor, status, ano_fabricacao, nome) VALUES 
('ABC1234', 50000, 'Preto', true, 2022, 'Onix'),
('XYZ7890', 15000, 'Branco', true, 2023, 'Kwid');

/* 3. Inserir Grupos */
INSERT INTO tb_grupos_usuarios (nome_grupo, descricao) VALUES
('CLIENTE', 'Usuário final que aluga carros'),
('FUNCIONARIO', 'Funcionário que gerencia contratos e clientes'),
('GERENTE', 'Administrador do sistema com acesso total');

/* 4. Inserir Usuários */
INSERT INTO tb_usuarios (login, senha, fk_id_pessoa, fk_id_grupo) VALUES
('ana.silva@email.com', '1234', 1, 1),
('daniel.moreira@email.com', '1234', 4, 1),
('bruno.costa@locauto.com', '1234', 2, 2), 
('eduardo.lima@locauto.com', '1234', 5, 2),
('carla.dias@locauto.com', '1234', 3, 3);   

/* 5. Inserir Funcionários*/

INSERT INTO tb_funcionario (data_admissao, cargo, salario, fk_id_pessoa) VALUES 
('2023-01-15', 'Atendente', 3000.00, 2), 
('2024-02-20', 'Atendente', 3000.00, 5); 

/* 6. Inserir Contratos*/

INSERT INTO tb_contrato (data_inicio, data_fim, valor_total, fk_id_usuario_cliente, fk_id_carro) VALUES 
('2025-10-01', '2025-10-10', 1200.50, 1, 1),
('2025-10-05', '2025-10-15', 1800.00, 2, 2);