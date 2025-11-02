/*USUÁRIOS E PERMISSÕES*/


DROP USER IF EXISTS 'user_cliente'@'localhost';
DROP USER IF EXISTS 'user_funcionario'@'localhost';
DROP USER IF EXISTS 'user_gerente'@'localhost';

CREATE USER 'user_cliente'@'localhost' IDENTIFIED BY '1234';
CREATE USER 'user_funcionario'@'localhost' IDENTIFIED BY '1234';
CREATE USER 'user_gerente'@'localhost' IDENTIFIED BY '1234';

/*---------------------------------------------------
-- Permissões do CLIENTE
---------------------------------------------------*/
GRANT SELECT ON locauto.tb_carro TO 'user_cliente'@'localhost';
GRANT SELECT ON locauto.VW_Cliente TO 'user_cliente'@'localhost';
GRANT EXECUTE ON FUNCTION locauto.fn_VerificarDisponibilidadeCarro TO 'user_cliente'@'localhost';


/*---------------------------------------------------
-- Permissões do FUNCIONÁRIO
---------------------------------------------------*/
GRANT SELECT, INSERT, UPDATE ON locauto.tb_pessoa TO 'user_funcionario'@'localhost';
GRANT SELECT, INSERT, UPDATE ON locauto.tb_usuarios TO 'user_funcionario'@'localhost';
GRANT SELECT, INSERT, UPDATE ON locauto.tb_contrato TO 'user_funcionario'@'localhost';
GRANT SELECT ON locauto.tb_carro TO 'user_funcionario'@'localhost';

GRANT SELECT ON locauto.VW_Func_Clientes TO 'user_funcionario'@'localhost';
GRANT SELECT ON locauto.VW_Func_Contratos TO 'user_funcionario'@'localhost';
GRANT SELECT ON locauto.VW_Func_Carros TO 'user_funcionario'@'localhost';
GRANT EXECUTE ON FUNCTION locauto.fn_VerificarDisponibilidadeCarro TO 'user_funcionario'@'localhost';
GRANT EXECUTE ON PROCEDURE locauto.sp_CadastrarNovoCliente TO 'user_funcionario'@'localhost';


/*---------------------------------------------------
-- Permissões do GERENTE
---------------------------------------------------*/
GRANT SELECT, INSERT, UPDATE, DELETE ON locauto.tb_funcionario TO 'user_gerente'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON locauto.tb_pessoa TO 'user_gerente'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON locauto.tb_contrato TO 'user_gerente'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON locauto.tb_carro TO 'user_gerente'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON locauto.tb_usuarios TO 'user_gerente'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON locauto.tb_grupos_usuarios TO 'user_gerente'@'localhost';

GRANT SELECT ON locauto.VW_Gerente TO 'user_gerente'@'localhost';
GRANT EXECUTE ON FUNCTION locauto.fn_VerificarDisponibilidadeCarro TO 'user_gerente'@'localhost';
GRANT EXECUTE ON PROCEDURE locauto.sp_CadastrarNovoCliente TO 'user_gerente'@'localhost';


FLUSH PRIVILEGES;