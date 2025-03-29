package com.talentoTech.proyecto.repository;
import com.talentoTech.proyecto.model.Produccion;
import com.talentoTech.proyecto.model.EnergiaId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProduccionRepository extends JpaRepository<Produccion, EnergiaId> {
    List<Produccion> findByCountry(String country);
    List<Produccion> findByYear(String year);
}
