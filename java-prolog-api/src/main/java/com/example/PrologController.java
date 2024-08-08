package com.example;

import org.jpl7.*;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class PrologController {

    // @GetMapping("/start")
    // public String query(@RequestParam String prologQuery) {
      
    //   Query consultQuery = new Query(
    //         "consult", 
    //         new Term[] {new Atom("/app/src/main/resources/test.pl")}
    //     );

    //     if (consultQuery.hasSolution()) {
    //         Query query = new Query(prologQuery);
    //         return query.hasSolution() ? "Query succeeded: " + query.nextSolution().toString() : "Query failed";
    //     } else {
    //         return "Failed to consult the Prolog file";
    //     }

    // }

    public PrologController() {
        // Consult the Prolog file at initialization
        Query consultQuery = new Query(
            "consult", 
            new Term[] {new Atom("/app/src/main/resources/test.pl")}
        );

        if (!consultQuery.hasSolution()) {
            throw new RuntimeException("Failed to consult the Prolog file.");
        }
    }


    @GetMapping("/query")
    public String query(@RequestParam String prologQuery) {
        Query query = new Query(prologQuery);

        if (query.hasSolution()) {
            return "Query succeeded: " + query.nextSolution().toString();
        } else {
            return "Query failed.";
        }
    }

    @GetMapping("/evaluateLoan")
    public String evaluateLoan(@RequestParam String dni) {
        String prologQuery = String.format("evaluar_prestamo('%s', Viabilidad)", dni);
        Query query = new Query(prologQuery);

        if (query.hasSolution()) {
            Term viabilidad = query.oneSolution().get("Viabilidad");
            return "Loan viability for DNI " + dni + ": " + viabilidad.toString();
        } else {
            return "Evaluation query failed.";
        }
    }

    // http://localhost:8080/api/query?prologQuery=cliente(%2774160675%27,%20%27Chris%20Vega%27)
    // http://localhost:8080/api/evaluateLoan?dni=74160675

}
  