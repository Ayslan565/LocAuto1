-- 5º na hr da criar bd

/* ÍNDICES */
use locauto;

CREATE INDEX idx_pessoa_cpf ON tb_pessoa(cpf);
CREATE INDEX idx_carro_placa ON tb_carro(placa);
CREATE INDEX idx_usuario_login ON tb_usuarios(login);