// LocAuto/src/main/java/com/locadora/LocAuto/repositorio/repositorioContrato.java

package com.locadora.LocAuto.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import com.locadora.LocAuto.Model.Contrato;
import com.locadora.LocAuto.Model.Usuario; // Importação necessária
import org.springframework.stereotype.Repository;

@Repository
public interface repositorioContrato extends JpaRepository<Contrato, Integer> {
    
    // NOVO: Método para buscar contratos pelo usuário cliente (Entidade Usuario)
    Iterable<Contrato> findByUsuarioCliente(Usuario usuarioCliente);
}