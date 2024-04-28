package com.bluebool.oq.core;

import com.bluebool.oq.bd.ConexionMySQL;
import java.sql.Connection;
import java.sql.Statement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import com.bluebool.oq.model.DetalleVentaPreLen;
import com.bluebool.oq.model.Presupuesto;
import com.bluebool.oq.model.PresupuestoLentesconArmazon;
import com.bluebool.oq.model.Tratamiento;
import com.bluebool.oq.model.VentaPresupuesto;
import java.sql.PreparedStatement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import javax.swing.JOptionPane;

/**
 *
 * @author Lolis
 */
public class ControllerVentaLA {

        public List<Presupuesto> agregarPresupuesto(DetalleVentaPreLen dvpa) {
        ConexionMySQL conMySQL = new ConexionMySQL();
        ResultSet rs = null;
        Statement stm = null;
        Connection conn = conMySQL.open();
        List<Presupuesto> p = new ArrayList<>();
        Presupuesto ps = null;

        try {
            conn.setAutoCommit(false);
            for (VentaPresupuesto ventaPresupuesto : dvpa.getVentaPresupuesto()) {
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
            Logger.getLogger(ControllerVentaLA.class.getName()).log(Level.SEVERE, null, ex);
            try {
                conn.rollback();
            } catch (SQLException ex1) {
                Logger.getLogger(ControllerVentaLA.class.getName()).log(Level.SEVERE, null, ex1);
            }
        } finally {
            try {
                conn.setAutoCommit(true);
                conn.close();
            } catch (SQLException ex) {
                Logger.getLogger(ControllerVentaLA.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

        return p;
    }

    public DetalleVentaPreLen agregarPresupuestoLenteArmazon(DetalleVentaPreLen dvpa, List<Presupuesto> p) {
        ConexionMySQL conMySQL = new ConexionMySQL();
        Statement stm = null;
        ResultSet rs = null;
        Connection conn = conMySQL.open();
        int contador = 0;
        try {
            conn.setAutoCommit(false);
            PresupuestoLentesconArmazon pla = null;
            for (int i = 0; i < dvpa.getPresupuestoTratamientos().size(); i++) {
//                //Generar la clave para el presupuesto_lentescontacto con timeStamp
//                SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
//                Date date = new Date(Calendar.getInstance().getTimeInMillis());
//                String timeStamp = sdf.format(date);
//                String clave = "OQ-PRELC-" + timeStamp;
                dvpa.getPresupuestoTratamientos().get(i).getPresupuestoLentes().setPresupuesto(p.get(i));
                String sqlPresupuestoLentesArmazon = "INSERT INTO presupuesto_lentes (idPresupuesto, idExamenVista, alturaOblea, idTipoMica, idMaterial, idArmazon) VALUES ("
                        + dvpa.getPresupuestoTratamientos().get(i).getPresupuestoLentes().getPresupuesto().getIdPresupuesto() + ", "
                        + dvpa.getPresupuestoTratamientos().get(i).getPresupuestoLentes().getExamenVista().getIdExamenVista() + ", "
                        + dvpa.getPresupuestoTratamientos().get(i).getPresupuestoLentes().getAlturaOblea() + ", "
                        + dvpa.getPresupuestoTratamientos().get(i).getPresupuestoLentes().getTipoMica().getIdTipoMica() + ", "
                        + dvpa.getPresupuestoTratamientos().get(i).getPresupuestoLentes().getMaterial().getIdMaterial() + ", "
                        + dvpa.getPresupuestoTratamientos().get(i).getPresupuestoLentes().getArmazon().getIdArmazon()
                        + ");";
                System.out.println(sqlPresupuestoLentesArmazon);
                stm = conn.createStatement();
                stm.executeUpdate(sqlPresupuestoLentesArmazon, Statement.RETURN_GENERATED_KEYS);
                rs = stm.getGeneratedKeys();
                if (rs.next()) {
                    dvpa.getPresupuestoTratamientos().get(i).getPresupuestoLentes().setIdPresupuestoleentes(rs.getInt(1));
                }
            }
            conn.commit();
            rs.close();
            stm.close();
        } catch (SQLException ex) {
            Logger.getLogger(ControllerVentaLA.class.getName()).log(Level.SEVERE, null, ex);
            try {
                conn.rollback();
            } catch (SQLException ex1) {
                Logger.getLogger(ControllerVentaLA.class.getName()).log(Level.SEVERE, null, ex1);
            }
        } finally {
            try {
                conn.setAutoCommit(true);
                conn.close();
            } catch (SQLException ex) {
                Logger.getLogger(ControllerVentaLA.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return dvpa;
    }

    public DetalleVentaPreLen agregarPresupuestoTratamientos(DetalleVentaPreLen dvpa) {
        ConexionMySQL conMySQL = new ConexionMySQL();
        Statement stm = null;
        ResultSet rs = null;
        Connection conn = conMySQL.open();
        int contador = 0;
        try {
            conn.setAutoCommit(false);
            for (int i = 0; i < dvpa.getPresupuestoTratamientos().size(); i++) {
                //for (Tratamiento t : dvpa.getPresupuestoTratamientos().get(i).getTratamientos()) {
                for (Tratamiento t : dvpa.getPresupuestoTratamientos().get(i).getTratamientos()) {
                    String queryTratamientos = "INSERT INTO presupuesto_lentes_tratamientos (idPresupuestoLentes, idTratamiento) VALUES ("
                            + dvpa.getPresupuestoTratamientos().get(i).getPresupuestoLentes().getIdPresupuestoleentes() + ", "
                            + +t.getIdTratamiento()
                            + ");";
                    System.out.println(queryTratamientos);
                    stm = conn.createStatement();
                    stm.execute(queryTratamientos);
                }
            }
        } catch (SQLException ex) {
            //tener cuidadoooooooooooooooo
            Logger.getLogger(ControllerVentaLA.class.getName()).log(Level.SEVERE, null, ex);
            try {
                conn.rollback();
            } catch (SQLException ex1) {
                Logger.getLogger(ControllerVentaLA.class.getName()).log(Level.SEVERE, null, ex1);
            }
        } finally {
            try {
                conn.setAutoCommit(true);
                conn.close();
            } catch (SQLException ex) {
                Logger.getLogger(ControllerVentaLA.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return dvpa;
    }

    public DetalleVentaPreLen agregarVenta(DetalleVentaPreLen dvpa) {
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
            String clave = "OQ-VLC-E" + dvpa.getVenta().getEmpleado().getIdEmpleado() + "-" + timeStamp;
            // Debes de generar la clave de la venta
            String sqlVenta = "INSERT INTO venta (idEmpleado, clave) VALUES ("
                    + dvpa.getVenta().getEmpleado().getIdEmpleado() + ", "
                    + "'" + clave + "'"
                    + ");";
            System.out.println(sqlVenta);
            stm = conn.createStatement();
            stm.executeUpdate(sqlVenta, Statement.RETURN_GENERATED_KEYS);
            rs = stm.getGeneratedKeys();
            // Asignamos la clave al objeto 
            dvpa.getVenta().setClave(clave);
            if (rs.next()) {
                dvpa.getVenta().setIdVenta(rs.getInt(1));
            }

            conn.commit();
            rs.close();
            stm.close();
        } catch (SQLException ex) {
            //tener cuidadooooooooooo
            Logger.getLogger(ControllerVentaLA.class.getName()).log(Level.SEVERE, null, ex);
            try {
                conn.rollback();
            } catch (SQLException ex1) {
                Logger.getLogger(ControllerVentaLA.class.getName()).log(Level.SEVERE, null, ex1);
            }
        } finally {
            try {
                conn.setAutoCommit(true);
                conn.close();
            } catch (SQLException ex) {
                Logger.getLogger(ControllerVentaLA.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return dvpa;
    }

    public DetalleVentaPreLen agregarVentaPresupuesto(DetalleVentaPreLen dvpa, List<Presupuesto> p) {
        ConexionMySQL conMySQL = new ConexionMySQL();
        Statement stm = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        Connection conn = conMySQL.open();

        try {
            conn.setAutoCommit(false);
            int contador = 0;
            for (VentaPresupuesto vp : dvpa.getVentaPresupuesto()) {
                vp.setVenta(dvpa.getVenta());
                vp.setPresupuesto(p.get(contador));

                String sqlVentaPresupuesto = "INSERT INTO venta_presupuesto (idVenta, idPresupuesto, cantidad, precioUnitario, descuento) VALUES ("
                        + dvpa.getVenta().getIdVenta() + ", "
                        + +p.get(contador).getIdPresupuesto() + ", "
                        + +vp.getCantidad() + ", "
                        + +vp.getPrecioUnitario() + ", "
                        + +vp.getDescuento()
                        + ");";
                System.out.println(sqlVentaPresupuesto);
                stm = conn.createStatement();
                stm.execute(sqlVentaPresupuesto);

                // Actualizar las existencias del lente de contacto
                String sqlActualizar = "UPDATE producto SET existencias = existencias - " + vp.getCantidad() + " WHERE producto.idProducto = " + dvpa.getPresupuestoTratamientos().get(contador).getPresupuestoLentes().getArmazon().getProducto().getIdProducto() + ";";
                System.out.println(sqlActualizar);
                stm = conn.createStatement();
                stm.executeUpdate(sqlActualizar);
                // Verificar el inventario
                String sqlVerificar = "SELECT existencias FROM producto WHERE idProducto = " + dvpa.getPresupuestoTratamientos().get(contador).getPresupuestoLentes().getArmazon().getProducto().getIdProducto() + ";";
                pstmt = conn.prepareStatement(sqlVerificar);
                rs = pstmt.executeQuery();
                while (rs.next()) {
                    int existencias = rs.getInt("existencias");
                    if (existencias <= 0) {
                        String sqlEstatus = "UPDATE producto SET estatus = 0 WHERE idProducto = " + dvpa.getPresupuestoTratamientos().get(contador).getPresupuestoLentes().getArmazon().getProducto().getIdProducto() + ";";
                        stm = conn.createStatement();
                        stm.execute(sqlEstatus);
                    }
                }
                contador++;
            }
            conn.commit();
            stm.close();
        } catch (SQLException ex) {
            //tener cuidadooooooooooo
            Logger.getLogger(ControllerVentaLA.class.getName()).log(Level.SEVERE, null, ex);
            try {
                conn.rollback();
            } catch (SQLException ex1) {
                Logger.getLogger(ControllerVentaLA.class.getName()).log(Level.SEVERE, null, ex1);
            }
        } finally {
            try {
                conn.setAutoCommit(true);
                conn.close();
            } catch (SQLException ex) {
                Logger.getLogger(ControllerVentaLA.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return dvpa;
    }
}
