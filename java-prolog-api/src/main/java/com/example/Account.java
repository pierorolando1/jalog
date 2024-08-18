package com.example;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import org.jpl7.Query;
import org.jpl7.Term;

public class Account {
    private String id;
    private String ownerDni;

    public Account(String id, String ownerDni) {
        this.id = id;
        this.ownerDni = ownerDni;
    }

    public boolean add() {
        String prologQuery = String.format("assert(cuenta(%s, %s))", id, ownerDni);
        Query query = new Query(prologQuery);
        if (query.hasSolution()) {
            String relationQuery = String.format("assert(relacion_cliente_cuenta(%s, %s))", ownerDni, id);
            return new Query(relationQuery).hasSolution();
        }
        return false;
    }

    public String getBalance() {
        String prologQuery = String.format("calcular_balance(%s, Balance)", id);
        Query query = new Query(prologQuery);

        if (query.hasSolution()) {
            Map<String, Term> solution = query.oneSolution();
            return solution.get("Balance").toString();
        }
        return "No se pudo calcular el balance para la cuenta especificada";
    }

    public List<Map<String, Object>> getTransactions() {

        String prologQuery = String.format(
            "findall(trans(ID, Origen, Destino, Monto), " +
            "(transaccion(ID, Origen, Destino, Monto), " +
            "(Origen = %1$s ; Destino = %1$s)), Transacciones)",
            this.id
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


}
