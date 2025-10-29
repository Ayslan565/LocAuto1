package com.locadora.LocAuto.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;     // <-- NOVO!
import jakarta.persistence.GenerationType;   // <-- NOVO!
import jakarta.persistence.ManyToOne;        // <-- NOVO!
import jakarta.persistence.JoinColumn;       // <-- NOVO!
// import jakarta.persistence.OneToOne; // Se você preferir OneToOne, use esta.

@Entity
@Table (name= "tb_contrato")
public class Contrato {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 1. Corrigindo o ID
    private Integer ID_Contrato;

    // 2. CORRIGINDO RELACIONAMENTOS (ManyToOne é o mais provável)
    
    @ManyToOne
    @JoinColumn(name = "funcionario_id") // Cria a FK (chave estrangeira) na tabela tb_contrato
    private Funcionario funcionario;
    
    @ManyToOne
    @JoinColumn(name = "carro_id") // Cria a FK na tabela tb_contrato
    private Carro carro;
    
    @ManyToOne
    @JoinColumn(name = "cliente_id") // Cria a FK na tabela tb_contrato
    private Cliente cliente;

    // Métodos Getters e Setters (Mantidos)
    public Integer getID_Contrato() {
        return ID_Contrato;
    }
    // ... (restante dos métodos)

    // Lembre-se de criar o Construtor Vazio (default constructor) se você criou outros construtores!
    public Contrato() {
    }

    // ... (restante da classe)
}