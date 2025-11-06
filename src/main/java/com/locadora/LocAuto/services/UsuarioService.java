package com.locadora.LocAuto.services;

import com.locadora.LocAuto.Model.GrupoUsuario;
import com.locadora.LocAuto.Model.Pessoa;
import com.locadora.LocAuto.Model.Usuario;
import com.locadora.LocAuto.repositorio.repositorioUsuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private repositorioUsuario repositorioUsuario;

    @Autowired
    private GrupoUsuarioService grupoUsuarioService; 
    
    @Autowired(required = false) 
    private PasswordEncoder passwordEncoder; 

    /**
     * Verifica se um login (e-mail) já está em uso no sistema.
     * @param login O e-mail (login) a ser checado.
     * @return true se o login existe, false caso contrário.
     */
    public boolean loginExiste(String login) {
        return repositorioUsuario.findByLogin(login).isPresent();
    }

    /**
     * Cria um novo registro de Usuário, associando-o à Pessoa e ao Grupo (permissão).
     * CORREÇÃO: Removido REQUIRES_NEW. O método agora participa da transação do ClienteService.
     */
    @Transactional(propagation = Propagation.REQUIRED) // Padrão: usa a transação existente
    public Usuario criarUsuarioComAcesso(String login, String senhaPura, Pessoa pessoa, String nomeGrupo) {

        // 1. Encontrar o grupo de permissão
        Optional<GrupoUsuario> grupoOpt = grupoUsuarioService.buscarPorNome(nomeGrupo);
        
        if (grupoOpt.isEmpty()) {
            // Em caso de falha, lançamos uma exceção que fará o rollback de toda a transação (Pessoa, Cliente, Usuário)
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR, 
                "Grupo de usuário '" + nomeGrupo + "' não encontrado no BD."
            );
        }
        
        // 2. Criptografar a senha (usando BCrypt)
        String senhaCriptografada = senhaPura;
        if (passwordEncoder != null) {
             senhaCriptografada = passwordEncoder.encode(senhaPura);
        } else {
             // Aviso se o PasswordEncoder não estiver disponível (somente para DEV)
             System.err.println("AVISO: PasswordEncoder não injetado. Senha salva em texto simples.");
        }
        
        // 3. Criar e configurar o objeto Usuario
        Usuario novoUsuario = new Usuario();
        novoUsuario.setLogin(login);
        novoUsuario.setSenha(senhaCriptografada);
        novoUsuario.setPessoa(pessoa); 
        novoUsuario.setGrupoUsuario(grupoOpt.get());

        // 4. Salvar
        return repositorioUsuario.save(novoUsuario);
    }
}