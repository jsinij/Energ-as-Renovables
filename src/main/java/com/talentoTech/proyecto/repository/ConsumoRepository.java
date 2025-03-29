package com.talentoTech.proyecto.repository;

import com.talentoTech.proyecto.model.Consumo;
import com.talentoTech.proyecto.model.EnergiaId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ConsumoRepository extends JpaRepository<Consumo, EnergiaId> {
    List<Consumo> findByCountry(String country);
    List<Consumo> findByYear(String year);
}
