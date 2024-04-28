/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.bluebool.oq.core;

import com.bluebool.oq.bd.ConexionMySQL;
import com.bluebool.oq.model.PresupuestoLentesdeContacto;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Paulo
 */
public class ControllerPresupuesto {
    public boolean generarPresupuestoLC(PresupuestoLentesdeContacto plc){
        boolean r = false;
        
        try {
            ConexionMySQL connMysql = new ConexionMySQL();
            Connection conn = connMysql.open();
            Statement stmt = conn.createStatement();
            
            String query1 = "INSERT INTO presupuesto_lentescontacto(idExamenVista, idLenteContacto, clave)"
                    + "VALUES(" + plc.getExamenVista().getIdExamenVista() + ","
                    + plc.getLenteContacto().getIdLenteContacto() + ","
                    + plc.getClave() + ");";
            stmt.execute(query1);
            
            r = true;
            stmt.close();
            conn.close();
            connMysql.close();
        } catch (SQLException ex) {
            Logger.getLogger(ControllerPresupuesto.class.getName()).log(Level.SEVERE, null, ex);
            r = false;
        }
        return r;
    }
}
