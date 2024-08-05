package com.example;

import org.jpl7.Query;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class PrologController {

    @GetMapping("/query")
    public String query(@RequestParam String prologQuery) {
        // This is a simple example. You'd want to add more robust error handling in a real application.
        Query q = new Query(prologQuery);
        return q.hasSolution() ? "Yes" : "No";
    }
}
