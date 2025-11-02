/* FUNCTIONS E PROCEDURES */

/* Verificar disponibilidade do carro*/
DELIMITER $$
CREATE FUNCTION fn_VerificarDisponibilidadeCarro(p_id_carro INT)
RETURNS BOOLEAN
DETERMINISTIC READS SQL DATA
BEGIN
    DECLARE v_status BOOLEAN;
    
    SELECT status INTO v_status
    FROM tb_carro
    WHERE id_carro = p_id_carro;
    
    RETURN v_status;
END$$
DELIMITER ;

/* Cadastrar um cliente completo */
DELIMITER $$
CREATE PROCEDURE sp_CadastrarNovoCliente(
    IN p_cpf VARCHAR(11),
    IN p_nome VARCHAR(255),
    IN p_email VARCHAR(255),
    IN p_senha VARCHAR(255),
    IN p_data_nasc DATE,
    IN p_telefone1 DOUBLE
)
BEGIN
    DECLARE v_id_pessoa INT;
    DECLARE v_id_grupo_cliente INT;
    
    SELECT id_grupo INTO v_id_grupo_cliente
    FROM tb_grupos_usuarios WHERE nome_grupo = 'CLIENTE';
    
    INSERT INTO tb_pessoa(cpf, nome, email, data_nasc, telefone1)
    VALUES (p_cpf, p_nome, p_email, p_data_nasc, p_telefone1);
    
    SET v_id_pessoa = (SELECT id_pessoa FROM tb_pessoa WHERE cpf = p_cpf);
    
    INSERT INTO tb_usuarios(login, senha, fk_id_pessoa, fk_id_grupo)
    VALUES (p_email, p_senha, v_id_pessoa, v_id_grupo_cliente);
    
END$$
DELIMITER ;