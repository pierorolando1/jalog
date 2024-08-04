package com.example.java_prolog_api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PrologController {

    @GetMapping("/query")
    public String queryProlog(@RequestParam String query) {
        // Aquí se llamará a Prolog
        return PrologService.queryProlog(query);
    }
}
