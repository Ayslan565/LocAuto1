package com.locadora.LocAuto.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.locadora.LocAuto.Model.Carro;
import com.locadora.LocAuto.services.CarroServices;

@RestController
@RequestMapping("/detalhesCarros")
public class ControleCarro {
      @Autowired
    public CarroServices carroService;

    /**
     * Endpoint para adicionar ou atualizar um carro.
     * Mapeado para POST /detalhesCarros/add
     * @param carro Os dados do carro do corpo da requisição.
     * @return O objeto Carro salvo, com ID preenchido.
     */
    @PostMapping("add")
    public Carro adicionarInfCarro(@RequestBody Carro carro) {
        
        // 1. Chama o método adicionarInfCarro (que está lançando a exceção UnsupportedOperationException)
        // Se este método for necessário para lógica de negócio, ele deve ser corrigido no CarroServices.java.
        // Se não for essencial, a linha pode ser removida se a lógica principal estiver no 'salvar'.
        carroService.adicionarInfCarro(carro);
        
        // 2. Salva o carro no banco de dados e retorna a instância salva.
        // O método "return carroService.salvar(carro);" encerra o método.
        return carroService.salvar(carro);

        // ❌ LINHA REMOVIDA: A linha 'return "Sucesso Carro";' era código inalcançável 
        // e o tipo de retorno 'String' era incompatível com o tipo 'Carro' esperado pelo método.
    }
}