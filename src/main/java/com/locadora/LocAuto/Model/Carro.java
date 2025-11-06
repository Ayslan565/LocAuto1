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
    @GeneratedValue(strategy = GenerationType.IDENTITY) // RESTAURADO para AUTO_INCREMENT (estabilidade)
    @Column(name = "id_carro") 
    private Integer idCarro; // Corrigido para camelCase
    
    @Column(name = "placa") 
    private String placa;
    
    @Column(name = "quilometragem") 
    private Double quilometragem; // Alterado para Double (boa prática)
    
    @Column(name = "cor")
    private String cor; // Corrigido para camelCase
    
    @Column(name = "status")
    private Boolean status; // Corrigido para camelCase
    
    @Column(name = "ano_fabricacao")
    private Integer anoFabricacao; // Corrigido para camelCase e Integer
    
    @Column(name = "nome")
    private String nome; // Corrigido para camelCase

    public Carro() {    
    }
    
    // Construtor completo corrigido
    public Carro(Integer idCarro, String placa, Double quilometragem, String cor, Boolean status, Integer anoFabricacao, String nome) {
        this.idCarro = idCarro;
        this.placa = placa;
        this.quilometragem = quilometragem;
        this.cor = cor;
        this.status = status;
        this.anoFabricacao = anoFabricacao;
        this.nome = nome;
    }

    // Getters and Setters (corrigidos para camelCase)
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
    
    @Override
    public String toString() {
        return "Carro{" +
                "idCarro=" + idCarro +
                ", placa='" + placa + '\'' +
                ", quilometragem=" + quilometragem +
                ", cor='" + cor + '\'' +
                ", status=" + status +
                ", anoFabricacao=" + anoFabricacao +
                ", nome='" + nome + '\'' +
                '}';
    }
}