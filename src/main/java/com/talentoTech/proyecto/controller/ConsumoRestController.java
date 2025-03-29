package com.talentoTech.proyecto.controller;

import com.talentoTech.proyecto.model.Consumo;
import com.talentoTech.proyecto.service.ConsumoService;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/consumo")
@CrossOrigin(origins = "*")
public class ConsumoRestController {

    private final ConsumoService service;

    public ConsumoRestController(ConsumoService service) {
        this.service = service;
    }

    // GET /api/consumo
    @GetMapping
    public List<Consumo> getAll() {
        return service.listarTodo();
    }

    // GET /api/consumo/{pais}/{anio}
    @GetMapping("/{pais}/{anio}")
    public Consumo getByPaisYAnio(@PathVariable String pais, @PathVariable String anio) {
        return service.buscarPorPais(pais)
                .stream()
                .filter(c -> c.getYear().equals(anio))
                .findFirst()
                .orElse(null);
    }

    // GET /api/consumo/years
    @GetMapping("/years")
    public List<String> getYears() {
        List<Consumo> lista = service.listarTodo();
        return lista.stream()
                .map(Consumo::getYear)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    // GET /api/consumo/{pais}/serie
    @GetMapping("/{pais}/serie")
    public Map<String, Object> getSeriePorPais(@PathVariable String pais) {
        List<Consumo> lista = service.buscarPorPais(pais)
                .stream()
                .sorted(Comparator.comparing(Consumo::getYear))
                .collect(Collectors.toList());

        List<String> years = new ArrayList<>();
        List<Double> hydro = new ArrayList<>();
        List<Double> wind = new ArrayList<>();
        List<Double> solar = new ArrayList<>();

        for (Consumo c : lista) {
            years.add(c.getYear());
            hydro.add(c.getHydro() != null ? c.getHydro() : 0.0);
            wind.add(c.getWind() != null ? c.getWind() : 0.0);
            solar.add(c.getSolar() != null ? c.getSolar() : 0.0);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("years", years);
        response.put("hydro", hydro);
        response.put("wind", wind);
        response.put("solar", solar);

        return response;
    }
}
