package com.talentoTech.proyecto.controller;

import com.talentoTech.proyecto.model.Produccion;
import com.talentoTech.proyecto.model.Consumo;
import com.talentoTech.proyecto.service.ProduccionService;
import com.talentoTech.proyecto.service.ConsumoService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class EnergiaController {

    private final ProduccionService produccionService;
    private final ConsumoService consumoService;

    public EnergiaController(ProduccionService produccionService, ConsumoService consumoService) {
        this.produccionService = produccionService;
        this.consumoService = consumoService;
    }

    @GetMapping("/energia")
    public String mostrarDatos(Model model) {
        List<Produccion> produccion = produccionService.listarTodo();
        List<Consumo> consumo = consumoService.listarTodo();

        model.addAttribute("produccion", produccion);
        model.addAttribute("consumo", consumo);
        return "vista"; // nombre del archivo HTML
    }
}
