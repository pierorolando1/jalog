package com.example;

import org.jpl7.Query;

public class Transaction {
    private String id;
    private String sourceAccountId;
    private String destinationAccountId;
    private double amount;

    public Transaction(String id, String sourceAccountId, String destinationAccountId, double amount) {
        this.id = id;
        this.sourceAccountId = sourceAccountId;
        this.destinationAccountId = destinationAccountId;
        this.amount = amount;
    }

    public boolean add() {
        String prologQuery = String.format("assert(transaccion(%s, %s, %s, %f))", 
                                           id, sourceAccountId, destinationAccountId, amount);
        Query query = new Query(prologQuery);
        if (query.hasSolution()) {
            String relationQuery1 = String.format("assert(relacion_cuenta_transaccion(%s, %s))", sourceAccountId, id);
            String relationQuery2 = String.format("assert(relacion_cuenta_transaccion(%s, %s))", destinationAccountId, id);
            return new Query(relationQuery1).hasSolution() && new Query(relationQuery2).hasSolution();
        }
        return false;
    }

    public double getAmmount() {
        //TODO:
        return amount;
    }
}
