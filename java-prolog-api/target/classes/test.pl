% Entities
cliente(dni, nombre_cliente).
cuenta(id_cuenta, dni).
prestamo(id_prestamo, dni, estado).
transaccion(id_transaccion, id_cuenta, monto).

% Relationships
relacion_cliente_cuenta(dni, id_cuenta).
relacion_cliente_prestamo(dni, id_prestamo).
relacion_cuenta_transaccion(id_cuenta, id_transaccion).
relacion_prestamo_transaccion(id_prestamo, id_transaccion).

% Example Data
cliente('74160675', 'Chris Vega').
cliente('60737330', 'Piero Rolando').

cuenta('1234 5678 9012 3456', '74160675').
cuenta('6543 2109 8765 4321', '60737330').

prestamo('P001', '74160675', 'al_dia').
prestamo('P002', '60737330', 'atrasado').
prestamo('P003', '74160675', 'pagado').

transaccion('T001', '1234 5678 9012 3456', 1000).
transaccion('T002', '6543 2109 8765 4321', 1000).

relacion_cliente_cuenta('74160675', '1234 5678 9012 3456').
relacion_cliente_cuenta('60737330', '6543 2109 8765 4321').

relacion_cliente_prestamo('74160675', 'P001').
relacion_cliente_prestamo('60737330', 'P002').
relacion_cliente_prestamo('74160675', 'P003').

relacion_cuenta_transaccion('1234 5678 9012 3456', 'T001').
relacion_cuenta_transaccion('6543 2109 8765 4321', 'T002').

% Rules for loan evaluation
historial_crediticio(DNI, Historial) :-
    findall(Estado, (relacion_cliente_prestamo(DNI, IdPrestamo), prestamo(IdPrestamo, DNI, Estado)), Estados),
    evaluar_historial(Estados, Historial).

evaluar_historial(Estados, bueno) :- 
    \+ member(atrasado, Estados),
    \+ member(incobrable, Estados).
evaluar_historial(_, malo).

capacidad_pago(DNI, Capacidad) :-
    findall(Monto, (relacion_cliente_cuenta(DNI, IdCuenta), relacion_cuenta_transaccion(IdCuenta, IdTransaccion), transaccion(IdTransaccion, IdCuenta, Monto)), Montos),
    sum_list(Montos, Total),
    evaluar_capacidad(Total, Capacidad).

evaluar_capacidad(Total, alta) :- Total > 5000.
evaluar_capacidad(Total, media) :- Total > 2000, Total =< 5000.
evaluar_capacidad(_, baja).

relacion_cuentas_prestamos_buena(DNI) :- 
    relacion_cliente_cuenta(DNI, Cuenta),
    relacion_cuenta_transaccion(Cuenta, _).

evaluar_prestamo(DNI, Viabilidad) :-
    historial_crediticio(DNI, Historial),
    capacidad_pago(DNI, Capacidad),
    (relacion_cuentas_prestamos_buena(DNI) -> Relacion = buena ; Relacion = mala),
    evaluar_factores(Historial, Capacidad, Relacion, Viabilidad).

evaluar_factores(bueno, alta, buena, viable).
evaluar_factores(bueno, media, buena, viable).
evaluar_factores(_, _, _, no_viable).

