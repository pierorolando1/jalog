package com.example.java_prolog_api;

import org.jpl7.Query;

public class PrologService {

    public static String queryProlog(String query) {
        Query q = new Query(query);
        return q.hasSolution() ? "Query successful" : "Query failed";
    }
}

