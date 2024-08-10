package com.example;

import org.jpl7.Query;

public class Loan {
    private String id;
    private String ownerDni;
    private String status;

    public Loan(String id, String ownerDni, String status) {
        this.id = id;
        this.ownerDni = ownerDni;
        this.status = status;
    }

    public boolean add() {
        String prologQuery = String.format("assert(prestamo('%s', '%s', '%s'))", id, ownerDni, status);
        Query query = new Query(prologQuery);
        if (query.hasSolution()) {
            String relationQuery = String.format("assert(relacion_cliente_prestamo('%s', '%s'))", ownerDni, id);
            return new Query(relationQuery).hasSolution();
        }
        return false;
    }
}