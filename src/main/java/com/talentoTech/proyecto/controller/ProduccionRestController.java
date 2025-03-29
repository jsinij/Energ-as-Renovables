package com.talentoTech.proyecto.controller;

import com.talentoTech.proyecto.model.Produccion;
import com.talentoTech.proyecto.service.ProduccionService;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/produccion")
@CrossOrigin(origins = "*")
public class ProduccionRestController {

    private final ProduccionService service;

    public ProduccionRestController(ProduccionService service) {
        this.service = service;
    }

    @GetMapping
    public List<Produccion> getAll() {
        return service.listarTodo();
    }

    @GetMapping("/{pais}/{anio}")
    public Produccion getByPaisYAnio(@PathVariable String pais, @PathVariable String anio) {
        return service.buscarPorPais(pais)
                .stream()
                .filter(p -> p.getYear().equals(anio))
                .findFirst()
                .orElse(null);
    }

    @GetMapping("/years")
    public List<String> getYears() {
        List<Produccion> produccionList = service.listarTodo();
        return produccionList.stream()
                .map(Produccion::getYear)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    // 🚀 Nuevo endpoint para datos del gráfico de líneas
    @GetMapping("/{pais}/serie")
    public Map<String, Object> getSeriePorPais(@PathVariable String pais) {
        List<Produccion> lista = service.buscarPorPais(pais)
                .stream()
                .sorted(Comparator.comparing(Produccion::getYear))
                .collect(Collectors.toList());

        List<String> years = new ArrayList<>();
        List<Double> hydro = new ArrayList<>();
        List<Double> wind = new ArrayList<>();
        List<Double> solar = new ArrayList<>();

        for (Produccion p : lista) {
            years.add(p.getYear());
            hydro.add(p.getHydro() != null ? p.getHydro() : 0.0);
            wind.add(p.getWind() != null ? p.getWind() : 0.0);
            solar.add(p.getSolar() != null ? p.getSolar() : 0.0);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("years", years);
        response.put("hydro", hydro);
        response.put("wind", wind);
        response.put("solar", solar);

        return response;
    }
}
