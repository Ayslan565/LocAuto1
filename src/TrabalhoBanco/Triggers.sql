-- 2 º na hr de criar bd
/*DELIMITER $$
CREATE TRIGGER trg_pessoa_auto_id
BEFORE INSERT ON tb_pessoa
FOR EACH ROW
BEGIN
    SET NEW.id_pessoa = (SELECT IFNULL(MAX(id_pessoa), 0) + 1 FROM tb_pessoa);
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_carro_auto_id
BEFORE INSERT ON tb_carro
FOR EACH ROW
BEGIN
    SET NEW.id_carro = (SELECT IFNULL(MAX(id_carro), 0) + 1 FROM tb_carro);
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_grupos_auto_id
BEFORE INSERT ON tb_grupos_usuarios
FOR EACH ROW
BEGIN
    SET NEW.id_grupo = (SELECT IFNULL(MAX(id_grupo), 0) + 1 FROM tb_grupos_usuarios);
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_usuarios_auto_id
BEFORE INSERT ON tb_usuarios
FOR EACH ROW
BEGIN
    SET NEW.id_usuario = (SELECT IFNULL(MAX(id_usuario), 0) + 1 FROM tb_usuarios);
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_contrato_auto_id
BEFORE INSERT ON tb_contrato
FOR EACH ROW
BEGIN
    SET NEW.id_contrato = (SELECT IFNULL(MAX(id_contrato), 0) + 1 FROM tb_contrato);
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_funcionario_auto_id
BEFORE INSERT ON tb_funcionario
FOR EACH ROW
BEGIN
    SET NEW.id_funcionarios = (SELECT IFNULL(MAX(id_funcionarios), 0) + 1 FROM tb_funcionario);
END$$
DELIMITER ;*/


DELIMITER $$
CREATE TRIGGER trg_carro_alugado_status
AFTER INSERT ON tb_contrato
FOR EACH ROW
BEGIN
    UPDATE tb_carro
    SET status = false 
    WHERE id_carro = NEW.fk_id_carro;
END$$
DELIMITER ;
