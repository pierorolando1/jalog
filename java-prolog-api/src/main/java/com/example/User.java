package com.example;


import org.jpl7.Query;

public class User {
    private String dni;
    private String name;

    public User(String dni, String name) {
        this.dni = dni;
        this.name = name;
    }

    public boolean add() {
        String prologQuery = String.format("assert(cliente('%s', '%s'))", dni, name);
        return new Query(prologQuery).hasSolution();
    }
}