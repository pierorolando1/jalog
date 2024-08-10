package com.example;

import org.jpl7.*;

public class Account {
    private String id;
    private String ownerDni;

    public Account(String id, String ownerDni) {
        this.id = id;
        this.ownerDni = ownerDni;
    }

    public boolean add() {
        String prologQuery = String.format("assert(cuenta('%s', '%s'))", id, ownerDni);
        Query query = new Query(prologQuery);
        if (query.hasSolution()) {
            String relationQuery = String.format("assert(relacion_cliente_cuenta('%s', '%s'))", ownerDni, id);
            return new Query(relationQuery).hasSolution();
        }
        return false;
    }
}