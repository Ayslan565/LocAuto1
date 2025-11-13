package com.locadora.LocAuto.config;

import com.locadora.LocAuto.Model.LogSistema;
// Mantemos apenas o import correto do Mongo
import com.locadora.LocAuto.repositorio.mongo.LogRepository;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.stream.Collectors;

@Aspect
@Component
public class AuditoriaAspect {

    // Criamos um Logger profissional
    private static final Logger logger = LoggerFactory.getLogger(AuditoriaAspect.class);

    @Autowired
    private LogRepository logRepository;

    // Intercepta qualquer método público dentro do pacote 'services'
    @Around("execution(* com.locadora.LocAuto.services..*(..))")
    public Object monitorarAcoes(ProceedingJoinPoint joinPoint) throws Throwable {
        
        String metodo = joinPoint.getSignature().getName();
        String classe = joinPoint.getTarget().getClass().getSimpleName();

        // Filtro: Ignora métodos de leitura para não encher o log
        if (metodo.startsWith("get") || metodo.startsWith("listar") || metodo.startsWith("buscar")) {
             return joinPoint.proceed();
        }

        // Log no console avisando que interceptou
        logger.info(">>> [AUDITORIA] Interceptando: {}.{}", classe, metodo);

        Object[] args = joinPoint.getArgs();
        String argumentos = Arrays.stream(args)
            .map(arg -> {
                if (arg == null) return "null";
                String str = arg.toString();
                // Mascara senhas
                if (str.toLowerCase().contains("senha") || str.toLowerCase().contains("password")) {
                    return "[PROTEGIDO]";
                }
                return str;
            })
            .collect(Collectors.joining(", "));

        String usuario = "ANONIMO";
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated()) {
                usuario = auth.getName();
            }
        } catch (Exception e) { 
            logger.warn(">>> [AUDITORIA] Não foi possível identificar o usuário: {}", e.getMessage());
        }

        Object resultado;
        String status = "SUCESSO";

        try {
            resultado = joinPoint.proceed(); // Executa o método original (Salvar, Atualizar, etc)
        } catch (Exception e) {
            status = "ERRO: " + e.getMessage();
            throw e; // Relança o erro para o Controller tratar
        } finally {
            // Bloco de persistência no Mongo
            try {
                LogSistema log = new LogSistema(
                    usuario,
                    classe + "." + metodo,
                    "Args: " + argumentos,
                    status
                );
                
                logRepository.save(log);
                
                // Log de sucesso no console
                logger.info(">>> [AUDITORIA] LOG SALVO NO MONGO! ID: {} | Status: {}", log.getId(), status);
                
            } catch (Exception ex) {
                logger.error(">>> [AUDITORIA] FALHA CRÍTICA AO SALVAR NO MONGO:", ex);
            }
        }

        return resultado;
    }
}