% financial_relations.pl

% Entities
cliente(dni, dninombre_cliente).
cuenta(id_cuenta, dni).
prestamo(id_prestamo, dni).
transaccion(id_transaccion, id_cuenta, monto).

% Relationships
relacion_cliente_cuenta(dni, id_cuenta).
relacion_cliente_prestamo(dni, id_prestamo).
relacion_cuenta_transaccion(id_cuenta, id_transaccion).
relacion_prestamo_transaccion(id_prestamo, id_transaccion).

% Example Data
cliente('74160675', 'Chris Vega').
cuenta('1234 5678 9012 3456', '74160675').
prestamo('P001', '74160675').
transaccion('T001', '1234 5678 9012 3456', 1000).
relacion_cliente_cuenta('74160675', '1234 5678 9012 3456').
relacion_cliente_prestamo('74160675', 'P001').
relacion_cuenta_transaccion('1234 5678 9012 3456', 'T001').
relacion_prestamo_transaccion('P001', 'T001').

cliente('60737330', 'Piero Rolando').
cuenta('6543 2109 8765 4321', '60737330').
prestamo('P002', '60737330').
transaccion('T002', '6543 2109 8765 4321', 1000).
relacion_cliente_cuenta('60737330', '6543 2109 8765 4321').
relacion_cliente_prestamo('60737330', 'P002').
relacion_cuenta_transaccion('6543 2109 8765 4321', 'T002').
relacion_prestamo_transaccion('P002', 'T002').

% Example rules for loan evaluation
historial_crediticio(dni, bueno).
capacidad_pago(dni, alta).
relacion_cuentas_prestamos_buena(dni) :- 
    relacion_cliente_cuenta(dni, Cuenta),
    relacion_cuenta_transaccion(Cuenta, _).

evaluar_prestamo(dni, Viabilidad) :-
    historial_crediticio(dni, Historial),
    capacidad_pago(dni, Capacidad),
    (relacion_cuentas_prestamos_buena(dni) -> Relacion = buena ; Relacion = mala),
    evaluar_factores(Historial, Capacidad, Relacion, Viabilidad).

evaluar_factores(bueno, alta, buena, viable).
evaluar_factores(_, baja, _, no_viable).
evaluar_factores(malo, _, _, no_viable).