package com.locadora.LocAuto.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "logs_auditoria")
public class LogSistema {

    @Id
    private String id;
    private LocalDateTime dataHora;
    private String usuario;      // Quem fez?
    private String operacao;     // Qual método chamou? (Ex: salvar, deletar)
    private String detalhes;     // Quais dados? (JSON dos argumentos)
    private String status;       // SUCESSO ou ERRO

    public LogSistema() {}

    public LogSistema(String usuario, String operacao, String detalhes, String status) {
        this.dataHora = LocalDateTime.now();
        this.usuario = usuario;
        this.operacao = operacao;
        this.detalhes = detalhes;
        this.status = status;
    }

    // Getters e Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }
    public String getUsuario() { return usuario; }
    public void setUsuario(String usuario) { this.usuario = usuario; }
    public String getOperacao() { return operacao; }
    public void setOperacao(String operacao) { this.operacao = operacao; }
    public String getDetalhes() { return detalhes; }
    public void setDetalhes(String detalhes) { this.detalhes = detalhes; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}