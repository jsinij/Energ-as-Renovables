package com.talentoTech.proyecto.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    // Redirige la raíz de la URL a index.html
    @GetMapping("/")
    public String index() {
        return "forward:/index.html";  // Sirve el archivo estático index.html desde /static
    }
}
