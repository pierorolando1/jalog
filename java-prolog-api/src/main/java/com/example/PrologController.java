package com.example;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.jpl7.Atom;
import org.jpl7.Query;
import org.jpl7.Term;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/api")
public class PrologController {

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
    public Map<String, Object> evaluateLoan(@RequestParam String dni) {
        String prologQuery = String.format("evaluar_prestamo('%s', Viabilidad)", dni);
        Query query = new Query(prologQuery);
        if (query.hasSolution()) {
            Map<String, Object> solution = new HashMap<>();
            solution.put("viabilidad", query.oneSolution().get("Viabilidad").toString());
            solution.put("dni", dni);
            return solution;
        } else {
            return null;
        }
    }

    @PostMapping("/addClient")
    public String addClient(@RequestParam String dni, @RequestParam String nombre) {
        User user = new User(dni, nombre);
        return user.add() ? "Cliente añadido con éxito" : "Error al añadir cliente";
    }

    @PostMapping("/addAccount")
    public String addAccount(@RequestParam String idCuenta, @RequestParam String dni) {
        Account account = new Account(idCuenta, dni);
        return account.add() ? "Cuenta añadida con éxito" : "Error al añadir cuenta";
    }

    @PostMapping("/addLoan")
    public String addLoan(@RequestParam String idPrestamo, @RequestParam String dni, @RequestParam String estado) {
        Loan loan = new Loan(idPrestamo, dni, estado);
        return loan.add() ? "Préstamo añadido con éxito" : "Error al añadir préstamo";
    }

    @PostMapping("/addTransaction")
    public String addTransaction(@RequestParam String idTransaccion, @RequestParam String idCuentaOrigen, 
                                 @RequestParam String idCuentaDestino, @RequestParam double monto) {
        Transaction transaction = new Transaction(idTransaccion, idCuentaOrigen, idCuentaDestino, monto);
        return transaction.add() ? "Transacción añadida con éxito" : "Error al añadir transacción";
    }

    @GetMapping("/getAccounts")
    public List<String> getAccounts(@RequestParam String dni) {
        String prologQuery = String.format("findall(IdCuenta, relacion_cliente_cuenta('%s', IdCuenta), Cuentas)", dni);
        Query query = new Query(prologQuery);
        if (query.hasSolution()) {
            Term solution = query.oneSolution().get("Cuentas");
            return Arrays.stream(solution.toTermArray())
                         .map(Term::toString)
                         .collect(Collectors.toList());
        }
        return Collections.emptyList();
    }

    @GetMapping("/getTransactions")
    public List<Map<String, Object>> getTransactions(@RequestParam String idCuenta) {
        String prologQuery = String.format("findall(trans(ID, Origen, Destino, Monto), " +
                                           "(relacion_cuenta_transaccion('%s', ID), " +
                                           "transaccion(ID, Origen, Destino, Monto)), Transacciones)", idCuenta);
        Query query = new Query(prologQuery);
        if (query.hasSolution()) {
            Term[] transactions = query.oneSolution().get("Transacciones").toTermArray();
            return Arrays.stream(transactions)
                         .map(this::transactionToMap)
                         .collect(Collectors.toList());
        }
        return Collections.emptyList();
    }

    private Map<String, Object> transactionToMap(Term transaction) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", transaction.arg(1).toString());
        map.put("origen", transaction.arg(2).toString());
        map.put("destino", transaction.arg(3).toString());
        map.put("monto", transaction.arg(4).floatValue());
        return map;
    }
}
