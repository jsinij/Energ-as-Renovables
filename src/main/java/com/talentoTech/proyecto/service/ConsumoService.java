package com.talentoTech.proyecto.service;

import com.talentoTech.proyecto.model.Consumo;
import com.talentoTech.proyecto.repository.ConsumoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConsumoService {
    private final ConsumoRepository repository;

    public ConsumoService(ConsumoRepository repository) {
        this.repository = repository;
    }

    public List<Consumo> listarTodo() {
        return repository.findAll();
    }

    public List<Consumo> buscarPorPais(String country) {
        return repository.findByCountry(country);
    }

    public List<Consumo> buscarPorAnio(String year) {
        return repository.findByYear(year);
    }
}
