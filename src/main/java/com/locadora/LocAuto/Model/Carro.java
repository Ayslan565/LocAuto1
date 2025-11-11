package com.locadora.LocAuto.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column; 

@Entity
@Table (name = "tb_carro")
public class Carro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    @Column(name = "id_carro") 
    private Integer idCarro;
    
    @Column(name = "placa") 
    private String placa;
    
    @Column(name = "quilometragem") 
    private Double quilometragem;
    
    @Column(name = "cor")
    private String cor;
    
    @Column(name = "status")
    private Boolean status; // true=Disponível, false=Alugado
    
    @Column(name = "ano_fabricacao")
    private Integer anoFabricacao;
    
    @Column(name = "nome")
    private String nome;

    // --- Coluna para "Exclusão Lógica" ---
    @Column(name = "ativo")
    private Boolean ativo; // true=Visível, false=Excluído/Inativo

    public Carro() {    
    }
    
    // Construtor atualizado
    public Carro(Integer idCarro, String placa, Double quilometragem, String cor, Boolean status, Integer anoFabricacao, String nome, Boolean ativo) {
        this.idCarro = idCarro;
        this.placa = placa;
        this.quilometragem = quilometragem;
        this.cor = cor;
        this.status = status;
        this.anoFabricacao = anoFabricacao;
        this.nome = nome;
        this.ativo = ativo; 
    }

    // --- Getters and Setters ---
    
    public Integer getIdCarro() {
        return idCarro;
    }

    public void setIdCarro(Integer idCarro) {
        this.idCarro = idCarro;
    }

    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public Double getQuilometragem() {
        return quilometragem;
    }

    public void setQuilometragem(Double quilometragem) {
        this.quilometragem = quilometragem;
    }

    public String getCor() {
        return cor;
    }

    public void setCor(String cor) {
        this.cor = cor;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public Integer getAnoFabricacao() {
        return anoFabricacao;
    }

    public void setAnoFabricacao(Integer anoFabricacao) {
        this.anoFabricacao = anoFabricacao;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
    
    // --- Métodos get/set para Ativo ---
    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }
    
    @Override
    public String toString() {
        return "Carro{" +
                "idCarro=" + idCarro +
                ", placa='" + placa + '\'' +
                ", status=" + status +
                ", ativo=" + ativo +
                ", nome='" + nome + '\'' +
                '}';
    }
}