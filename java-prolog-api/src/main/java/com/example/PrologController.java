package com.example;

import org.jpl7.*;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class PrologController {

    @GetMapping("/start")
    public String query(@RequestParam String prologQuery) {
      Query q1 = new Query( 
      "consult", 
      new Term[] {new Atom("/app/src/main/resources/test.pl")} 
      );  

        return q1.hasSolution() ? "Yes" : "No";
    }
}
