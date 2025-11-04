/*VIWES*/
-- 4º na hr de criar bd 

/* VIEW CLIENTE */
CREATE VIEW VW_Cliente AS
SELECT
    CT.data_inicio, CT.data_fim, CT.valor_total,
    P_Cli.cpf AS cpf_cliente,
    C.nome AS nome_carro,
    C.placa AS placa_carro,
    C.ano_fabricacao

FROM
    tb_contrato AS CT
INNER JOIN
    tb_carro AS C ON CT.fk_id_carro = C.id_carro
INNER JOIN
    tb_usuarios AS U ON CT.fk_id_usuario_cliente = U.id_usuario
INNER JOIN
    tb_pessoa AS P_Cli ON U.fk_id_pessoa = P_Cli.id_pessoa;

/* VIEWs FUNCIONARIO */
CREATE VIEW VW_Func_Clientes AS
SELECT 
    P.nome, P.telefone1, P.telefone2, P.email, P.cep, P.municipio, P.uf, P.complemento
FROM 
    tb_pessoa AS P
INNER JOIN 
    tb_usuarios AS U ON P.id_pessoa = U.fk_id_pessoa
INNER JOIN
    tb_grupos_usuarios AS G ON U.fk_id_grupo = G.id_grupo
WHERE
    G.nome_grupo = 'CLIENTE';

CREATE VIEW VW_Func_Contratos AS
SELECT
    CT.data_inicio, CT.data_fim, CT.valor_total,
    P_Cli.cpf AS cpf_cliente,
    C.nome AS nome_carro,
    C.placa AS placa_carro,
    C.ano_fabricacao
FROM
    tb_contrato AS CT
INNER JOIN
    tb_carro AS C ON CT.fk_id_carro = C.id_carro
INNER JOIN
    tb_usuarios AS U ON CT.fk_id_usuario_cliente = U.id_usuario
INNER JOIN
    tb_pessoa AS P_Cli ON U.fk_id_pessoa = P_Cli.id_pessoa;

CREATE VIEW VW_Func_Carros AS
SELECT
    placa, quilometragem, cor, status, ano_fabricacao, nome
FROM
    tb_carro;

/* VIEW GERENTE*/
CREATE VIEW VW_Gerente AS
SELECT
    CT.id_contrato, CT.data_inicio, CT.data_fim, CT.valor_total,
    
    P_Cli.nome AS nome_cliente,
    P_Cli.cpf AS cpf_cliente,
    
    C.nome AS nome_carro,
    C.placa,
    
    P_Func.nome AS nome_funcionario,
    F.cargo AS cargo_funcionario
FROM
    tb_contrato AS CT
INNER JOIN
    tb_carro AS C ON CT.fk_id_carro = C.id_carro
INNER JOIN
    tb_usuarios AS U_Cli ON CT.fk_id_usuario_cliente = U_Cli.id_usuario
INNER JOIN
    tb_pessoa AS P_Cli ON U_Cli.fk_id_pessoa = P_Cli.id_pessoa

LEFT JOIN
    tb_usuarios AS U_Func ON U_Func.id_usuario 
LEFT JOIN
    tb_pessoa AS P_Func ON U_Func.fk_id_pessoa = P_Func.id_pessoa
LEFT JOIN
    tb_funcionario AS F ON P_Func.id_pessoa = F.fk_id_pessoa;
    