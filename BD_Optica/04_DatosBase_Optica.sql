-- ---------------------------------------------------------------- --
-- Archivo: 04_DatosBase_Optica.sql                                 -- 
-- Version: 1.0                                                     --
-- Autor:   Miguel Angel Gil Rios   								--
-- Email:   angel.grios@gmail.com / mgil@utleon.edu.mx              --
-- Fecha de elaboracion: 29-12-2021                                 --
-- ---------------------------------------------------------------- --

USE optiqalumnos;

-- Insercion del Usuario Raiz (Administrador):
CALL insertarEmpleado('Administrador', '-', '-', 'O', '01/01/1901', -- Datos Personales
                      '', '', '', '', '', '', '', '', '','',
                      'Admin', '', 'Administrador',         -- Datos de Seguridad
                      @out1, @out2, @out3, @out4, @out5); -- Parametros de salida
                      
-- CALL eliminarEmpleado('1');
                      
-- Insercion de Catalogos Base
INSERT INTO tipo_mica(idTipoMica, nombre, precioCompra, precioVenta) 
             VALUES (1, 'Bifocal', 3.00, 5.00), 
                    (2, 'Monofocal', 7.00, 10.00),
                    (3, 'Progresivo', 12.00, 15.00);
                    
INSERT INTO material(idMaterial, nombre, precioCompra, precioVenta)
            VALUES  (1, 'Cr', 3.00, 5.00),
                    (2, 'Cristal', 7.00, 10.00),
                    (3, 'Polarizado', 12.00, 15.00),
                    (4, 'Policarbonato', 18.00, 20.00);
                    
INSERT INTO tratamiento (idTratamiento, nombre, precioCompra, precioVenta, estatus)
            VALUES      (1, 'Antireflejante básico', 3.00, 5.00, 1),
                        (2, 'Blue free', 7.00, 10.00, 1),
                        (3, 'Entintado', 12.00, 15.00, 1),
                        (4, 'Fotocromático', 018.00, 20.00, 1);
                        



SELECT * FROM presupuesto;
SELECT * FROM presupuesto_lentescontacto;

SELECT * FROM venta;
SELECT * FROM venta_presupuesto;
