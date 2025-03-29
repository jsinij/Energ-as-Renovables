package com.talentoTech.proyecto.service;

import com.talentoTech.proyecto.model.Produccion;
import com.talentoTech.proyecto.repository.ProduccionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProduccionService {
    private final ProduccionRepository repository;

    public ProduccionService(ProduccionRepository repository) {
        this.repository = repository;
    }

    public List<Produccion> listarTodo() {
        return repository.findAll();
    }

    public List<Produccion> buscarPorPais(String country) {
        return repository.findByCountry(country);
    }

    public List<Produccion> buscarPorAnio(String year) {
        return repository.findByYear(year);
    }
}
