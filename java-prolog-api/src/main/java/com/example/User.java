package com.example;


import java.util.Collections;
import java.util.List;

import org.jpl7.Query;

public class User {
    private String dni;
    private String name;

    public User(String dni, String name) {
        this.dni = dni;
        this.name = name;
    }

    public boolean add() {
        String prologQuery = String.format("assert(cliente(%s, '%s'))", dni, name);
        return new Query(prologQuery).hasSolution();
    }

    Account createAccount(String accountId) {
        Account a = new Account(accountId, dni);
        if (a.add()) {
            return a;
        }
        return null;
    }

    Loan createLoan(String loanId, String status) {
        Loan l = new Loan(loanId, dni, status);
        if (l.add()) {
            return l;
        }
        return null;
    }

    List<Account> getAccounts() {
        //TODO
        return Collections.emptyList();
    }

    List<Loan> getLoans() {
        //TODO
        return Collections.emptyList();
    }


}
