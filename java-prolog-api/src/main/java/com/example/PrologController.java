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
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;

@CrossOrigin(origins = "*", allowedHeaders = "*")
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
        String prologQuery = String.format("evaluar_prestamo(%s, Viabilidad)", dni);
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
    public String addClient(@RequestBody JsonNode requestBody) {
        String dni = requestBody.get("dni").asText();
        String nombre = requestBody.get("nombre").asText();
        System.out.println("dni: " + dni + " nombre: " + nombre);
        User user = new User(dni, nombre);
        return user.add() ? "Cliente añadido con éxito" : "Error al añadir cliente";
    }

    @PostMapping("/addAccount")
    public String addAccount(@RequestBody JsonNode requestBody) {
        String idCuenta = requestBody.get("idCuenta").asText();
        String dni = requestBody.get("dni").asText();
        Account account = new Account(idCuenta, dni);
        return account.add() ? "Cuenta añadida con éxito" : "Error al añadir cuenta";
    }

    @PostMapping("/addLoan")
    public String addLoan(@RequestBody JsonNode requestBody) {
        String idPrestamo = requestBody.get("idPrestamo").asText();
        String dni = requestBody.get("dni").asText();
        String estado = requestBody.get("estado").asText();
        Loan loan = new Loan(idPrestamo, dni, estado);
        return loan.add() ? "Préstamo añadido con éxito" : "Error al añadir préstamo";
    }

    @PostMapping("/addTransaction")
    public String addTransaction(@RequestBody JsonNode requestBody) {
        String idTransaccion = requestBody.get("idTransaccion").asText();
        String idCuentaOrigen = requestBody.get("idCuentaOrigen").asText();
        String idCuentaDestino = requestBody.get("idCuentaDestino").asText();
        double monto = requestBody.get("monto").asDouble();
        Transaction transaction = new Transaction(idTransaccion, idCuentaOrigen, idCuentaDestino, monto);
        return transaction.add() ? "Transacción añadida con éxito" : "Error al añadir transacción";
    }

    @GetMapping("/getAccounts")
    public List<String> getAccounts(@RequestParam String dni) {
        String prologQuery = String.format("findall(IdCuenta, relacion_cliente_cuenta(%s, IdCuenta), Cuentas)", dni);
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
        String prologQuery = String.format(
            "findall(trans(ID, Origen, Destino, Monto), " +
            "(transaccion(ID, Origen, Destino, Monto), " +
            "(Origen = %1$s ; Destino = %1$s)), Transacciones)",
            idCuenta
        );
        Query query = new Query(prologQuery);
        if (query.hasSolution()) {
            Term[] transactions = query.oneSolution().get("Transacciones").toTermArray();
            return Arrays.stream(transactions)
                         .map(t -> this.transactionToMap(t, idCuenta))
                         .collect(Collectors.toList());
        }
        return Collections.emptyList();
    }

    
    @GetMapping("/getAccountBalance")
    public Map<String, Object> getAccountBalance(@RequestParam String idCuenta) {
        String prologQuery = String.format("calcular_balance(%s, Balance)", idCuenta);
        Query query = new Query(prologQuery);
        Map<String, Object> response = new HashMap<>();
        if (query.hasSolution()) {
            Map<String, Term> solution = query.oneSolution();
            double balance = solution.get("Balance").doubleValue();
            response.put("idCuenta", idCuenta);
            response.put("balance", balance);
        } else {
            response.put("error", "No se pudo calcular el balance para la cuenta especificada");
        }
        return response;
    }


    private Map<String, Object> transactionToMap(Term transaction, String idCuenta) {
        Map<String, Object> map = new HashMap<>();
        String id = transaction.arg(1).toString();
        String origen = transaction.arg(2).toString();
        String destino = transaction.arg(3).toString();
        double monto = transaction.arg(4).doubleValue();
        
        map.put("id", id);
        map.put("origen", origen);
        map.put("destino", destino);
        map.put("monto", monto);
        map.put("beneficioso", destino.equals(idCuenta));
        
        return map;
    }



    @GetMapping("/getLoans")
    public List<Map<String, Object>> getLoansByUser(@RequestParam String dni) {
        String prologQuery = String.format("obtener_prestamos_por_usuario(%s, Prestamos)", dni);
        Query query = new Query(prologQuery);
        if (query.hasSolution()) {
            Term[] loans = query.oneSolution().get("Prestamos").toTermArray();
            return Arrays.stream(loans)
                         .map(t -> this.loanToMap(t, dni))
                         .collect(Collectors.toList());
        }
        return Collections.emptyList();
    }

    private Map<String, Object> loanToMap(Term loan, String dni) {
        Map<String, Object> map = new HashMap<>();
        String id = loan.arg(1).toString();
        String estado = loan.arg(3).toString();
        
        map.put("idPrestamo", id);
        map.put("dni", dni);
        map.put("estado", estado);
        
        return map;
    }

}
