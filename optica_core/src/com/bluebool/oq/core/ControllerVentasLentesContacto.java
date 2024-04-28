/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.bluebool.oq.core;

import com.bluebool.oq.bd.ConexionMySQL;
import com.bluebool.oq.model.DetalleVPR;
import com.bluebool.oq.model.Presupuesto;
import java.sql.PreparedStatement;
import com.bluebool.oq.model.PresupuestoLentesdeContacto;
import com.bluebool.oq.model.VentaPresupuesto;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.JOptionPane;

/**
 *
 * @author Paulo
 */
public class ControllerVentasLentesContacto {

    public List<Presupuesto> agregarPresupuesto(DetalleVPR dvp) {
        ConexionMySQL conMySQL = new ConexionMySQL();
        ResultSet rs = null;
        Statement stm = null;
        Connection conn = conMySQL.open();
        List<Presupuesto> p = new ArrayList<>();
        Presupuesto ps = null;
        try {
            conn.setAutoCommit(false);
            System.out.println(dvp.getListaVP());
            for (VentaPresupuesto ventaPresupuesto : dvp.getListaVP()) {
                // Inicia la parte para agregar registro a la tabla de presupuesto
                //Generar la clave para el presupuesto con timeStamp
                SimpleDateFormat sdf1 = new SimpleDateFormat("yyyyMMddHHmmss");
                Date date = new Date(Calendar.getInstance().getTimeInMillis());
                String timeStamp = sdf1.format(date);
                String clave = "OQ-PRE-" + timeStamp;
                String sqlPresupuesto = "INSERT INTO presupuesto (clave) VALUES ("
                        + "'" + clave + "'" + ");";
                System.out.println(sqlPresupuesto);
                stm = conn.createStatement();
                stm.executeUpdate(sqlPresupuesto, Statement.RETURN_GENERATED_KEYS);
                rs = stm.getGeneratedKeys();
                if (rs.next()) {
                    int idPresupuesto = rs.getInt(1);
                    ps = new Presupuesto(idPresupuesto, clave);
                    p.add(ps);
                }
            }

            conn.commit();
            rs.close();
            stm.close();
        } catch (SQLException ex) {
            Logger.getLogger(ControllerVenta.class.getName()).log(Level.SEVERE, null, ex);
            try {
                conn.rollback();
            } catch (SQLException ex1) {
                Logger.getLogger(ControllerVenta.class.getName()).log(Level.SEVERE, null, ex1);
            }
        } finally {
            try {
                conn.setAutoCommit(true);
                conn.close();
            } catch (SQLException ex) {
                Logger.getLogger(ControllerVenta.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

        return p;
    }

    public DetalleVPR agregarPresupuestoLentesContacto(DetalleVPR dvp, List<Presupuesto> p) {
        ConexionMySQL conMySQL = new ConexionMySQL();
        Statement stm = null;
        ResultSet rs = null;
        Connection conn = conMySQL.open();
        int contador = 0;
        try {
            conn.setAutoCommit(false);

            for (PresupuestoLentesdeContacto plc : dvp.getListaPLC()) {
                //Generar la clave para el presupuesto_lentescontacto con timeStamp
                SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
                Date date = new Date(Calendar.getInstance().getTimeInMillis());
                String timeStamp = sdf.format(date);
                String clave = "OQ-PRELC-" + timeStamp;
                plc.setPresupuesto(p.get(contador));
                contador++;
                String sqlPresupuestoLentesContacto = "INSERT INTO presupuesto_lentescontacto (idPresupuesto, idExamenVista, idLenteContacto, clave) VALUES ("
                        + plc.getPresupuesto().getIdPresupuesto() + ", "
                        + plc.getExamenVista().getIdExamenVista() + ", "
                        + plc.getLenteContacto().getIdLenteContacto() + ", "
                        + "'" + clave + "'" + ");";
                System.out.println(sqlPresupuestoLentesContacto);
                stm = conn.createStatement();
                stm.executeUpdate(sqlPresupuestoLentesContacto, Statement.RETURN_GENERATED_KEYS);
                rs = stm.getGeneratedKeys();
                if (rs.next()) {
                    plc.setIdPresupuestoLentesContacto(rs.getInt(1));
                    plc.setClave(clave);
                }
            }
            conn.commit();
            rs.close();
            stm.close();
        } catch (SQLException ex) {
            Logger.getLogger(ControllerVenta.class.getName()).log(Level.SEVERE, null, ex);
            try {
                conn.rollback();
            } catch (SQLException ex1) {
                Logger.getLogger(ControllerVenta.class.getName()).log(Level.SEVERE, null, ex1);
            }
        } finally {
            try {
                conn.setAutoCommit(true);
                conn.close();
            } catch (SQLException ex) {
                Logger.getLogger(ControllerVenta.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return dvp;
    }

    public DetalleVPR agregarVenta(DetalleVPR dvp) {
        ConexionMySQL conMySQL = new ConexionMySQL();
        ResultSet rs = null;
        Statement stm = null;
        PreparedStatement pstmt = null;
        Connection conn = conMySQL.open();
        try {
            conn.setAutoCommit(false);
            // Inicia la parte para agregar registro a la tabla de Venta
            //Generar la clave para la venta del lente de contacto con timeStamp
            SimpleDateFormat sdf1 = new SimpleDateFormat("yyyyMMddHHmmss");
            Date date = new Date(Calendar.getInstance().getTimeInMillis());
            String timeStamp = sdf1.format(date);
            String clave = "OQ-VLC-E" + dvp.getVenta().getEmpleado().getIdEmpleado() + "-" + timeStamp;
            // Debes de generar la clave de la venta
            String sqlVenta = "INSERT INTO venta (idEmpleado, clave) VALUES ("
                    + dvp.getVenta().getEmpleado().getIdEmpleado() + ", "
                    + "'" + clave + "'"
                    + ");";
            System.out.println(sqlVenta);
            stm = conn.createStatement();
            stm.executeUpdate(sqlVenta, Statement.RETURN_GENERATED_KEYS);
            rs = stm.getGeneratedKeys();
            // Asignamos la clave al objeto 
            dvp.getVenta().setClave(clave);
            if (rs.next()) {
                dvp.getVenta().setIdVenta(rs.getInt(1));
            }

            conn.commit();
            rs.close();
            stm.close();
        } catch (SQLException ex) {
            Logger.getLogger(ControllerVenta.class.getName()).log(Level.SEVERE, null, ex);
            try {
                conn.rollback();
            } catch (SQLException ex1) {
                Logger.getLogger(ControllerVenta.class.getName()).log(Level.SEVERE, null, ex1);
            }
        } finally {
            try {
                conn.setAutoCommit(true);
                conn.close();
            } catch (SQLException ex) {
                Logger.getLogger(ControllerVenta.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return dvp;
    }

    public DetalleVPR agregarVentaPresupuesto(DetalleVPR dvp, List<Presupuesto> p) {
        ConexionMySQL conMySQL = new ConexionMySQL();
        Statement stm = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        Connection conn = conMySQL.open();
        try {
            conn.setAutoCommit(false);
            int contador = 0;
            for (VentaPresupuesto vp : dvp.getListaVP()) {
                //Generar la clave para el presupuesto_lentescontacto con timeStamp
                SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
                Date date = new Date(Calendar.getInstance().getTimeInMillis());
                String timeStamp = sdf.format(date);
                String clave = "OQ-VP-E" + dvp.getVenta().getEmpleado().getIdEmpleado() + "-" + timeStamp;

                vp.setVenta(dvp.getVenta());
                vp.setPresupuesto(p.get(contador));

                String sqlVentaPresupuesto = "INSERT INTO venta_presupuesto (idVenta, idPresupuesto, cantidad, precioUnitario, descuento) VALUES ("
                        + dvp.getVenta().getIdVenta() + ", "
                        + p.get(contador).getIdPresupuesto() + ", "
                        + vp.getCantidad() + ", "
                        + vp.getPrecioUnitario() + ", "
                        + vp.getDescuento() + ");";
                System.out.println(sqlVentaPresupuesto);
                stm = conn.createStatement();
                stm.execute(sqlVentaPresupuesto);

                // Actualizar las existencias del lente de contacto
                String sqlActualizar = "UPDATE producto SET existencias = existencias - " + vp.getCantidad() + " WHERE producto.idProducto = " + dvp.getListaPLC().get(contador).getLenteContacto().getProducto().getIdProducto() + ";";
                System.out.println(sqlActualizar);
                stm = conn.createStatement();
                stm.executeUpdate(sqlActualizar);
                // Verificar el inventario
                String sqlVerificar = "SELECT existencias FROM producto WHERE idProducto = " + dvp.getListaPLC().get(contador).getLenteContacto().getProducto().getIdProducto();
                pstmt = conn.prepareStatement(sqlVerificar);
                rs = pstmt.executeQuery();
                while (rs.next()) {
                    int existencias = rs.getInt("existencias");
                    if (existencias <= 0) {
                        String sqlEstatus = "UPDATE producto SET estatus = 0 WHERE idProducto = " + dvp.getListaPLC().get(contador).getLenteContacto().getProducto().getIdProducto();
                        stm = conn.createStatement();
                        stm.execute(sqlEstatus);
                    }
                }
                contador++;
            }

            conn.commit();
            stm.close();
        } catch (SQLException ex) {
            Logger.getLogger(ControllerVenta.class.getName()).log(Level.SEVERE, null, ex);
            try {
                conn.rollback();
            } catch (SQLException ex1) {
                Logger.getLogger(ControllerVenta.class.getName()).log(Level.SEVERE, null, ex1);
            }
        } finally {
            try {
                conn.setAutoCommit(true);
                conn.close();
            } catch (SQLException ex) {
                Logger.getLogger(ControllerVenta.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

        return dvp;
    }
}
