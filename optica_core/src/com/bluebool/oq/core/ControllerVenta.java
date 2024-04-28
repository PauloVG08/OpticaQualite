package com.bluebool.oq.core;

import com.bluebool.oq.bd.ConexionMySQL;
import com.bluebool.oq.model.DetalleVentaProducto;
import com.bluebool.oq.model.Empleado;
import com.bluebool.oq.model.Producto;
import com.bluebool.oq.model.Venta;
import com.bluebool.oq.model.VentaProducto;
import java.sql.Connection;
import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.JOptionPane;

public class ControllerVenta {

    public static boolean isAdmin(Empleado e) {
        if (e == null || e.getUsuario() == null || e.getUsuario().getNombre() == null) {
            return false;
        } else {
            return e.getUsuario().getRol().trim().toLowerCase().equals("administrador");
        }
    }

    public List<Producto> buscar(String filtro) throws Exception {
        //La consulta SQL a ejecutar:
        String sql;

        sql = "SELECT * FROM v_productos "
                + "WHERE (codigoBarras LIKE '%" + filtro + "%' OR "
                + "nombre LIKE '%" + filtro + "%' OR "
                + "existencias LIKE '%" + filtro + "%' OR "
                + "precioVenta LIKE '%" + filtro + "');";

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto ejecutaremos la consulta:
        PreparedStatement pstmt = conn.prepareStatement(sql);

        //Aquí guardaremos los resultados de la consulta:
        //ResultSet rs = null;
        ResultSet rs = pstmt.executeQuery();

        List<Producto> producto = new ArrayList<>();

        //rs = pstmt.executeQuery();
        while (rs.next()) {
            producto.add(fill(rs));
        }

        rs.close();
        pstmt.close();
        connMySQL.close();

        return producto;
    }

    public List<Producto> getAll(String filtro) throws SQLException {
        //Consulta sql
        String sql;
        sql = "SELECT * FROM v_productos";

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto ejecutaremos la consulta:
        PreparedStatement pstmt = conn.prepareStatement(sql);

        //Aquí guardaremos los resultados de la consulta:
        //ResultSet rs = pstmt.executeQuery();
        ResultSet rs = pstmt.executeQuery();

        List<Producto> productos = new ArrayList<>();

        while (rs.next()) {
            productos.add(fill(rs));
        }

        rs.close();
        pstmt.close();
        connMySQL.close();

        return productos;

    }

    private Producto fill(ResultSet rs) throws SQLException {
        Producto p = new Producto();
        
        p.setIdProducto(rs.getInt("idProducto"));
        p.setCodigoBarras(rs.getString("codigoBarras"));
        p.setNombre(rs.getString("nombre"));
        p.setPrecioVenta(rs.getDouble("precioVenta"));
        p.setExistencias(rs.getInt("existencias"));

        return p;
    }

    public boolean validarToken(String token) throws SQLException {
        boolean estatusToken = false;

        String sql = "SELECT lastToken FROM usuario WHERE lastToken = '" + token + "'";

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto invocaremos al StoredProcedure:
        PreparedStatement ps = conn.prepareCall(sql);

        //Guardamos los resultados de la consulta en la variable rs
        ResultSet rs = ps.executeQuery();

        if (rs.next()) {
            estatusToken = true;
        }

        rs.close();
        ps.close();
        connMySQL.close();

        return estatusToken;
    }

    public boolean transaccionarVenta(DetalleVentaProducto dvp) {
        boolean r = false;
        ConexionMySQL connMysql = new ConexionMySQL();
        Connection conn = connMysql.open();
        ResultSet rs = null;
        Statement stmt = null;

        try {
            conn.setAutoCommit(false);
            stmt = conn.createStatement();

            String query = "INSERT INTO venta(idEmpleado, clave) VALUES(" + dvp.getVenta().getEmpleado().getIdEmpleado() + "," + dvp.getVenta().getClave() + ");";
            stmt.execute(query);

            String query2 = "SELECT LAST_INSERT_ID();";
            rs = stmt.executeQuery(query2);
            
            

            if (rs.next()) {
                dvp.getVenta().setIdVenta(rs.getInt(1));
            }

            for (VentaProducto vp : dvp.getListaProductos()) {
                String query3 = "INSERT INTO venta_producto(idVenta, idProducto, precioUnitario, cantidad, descuento) "
                        + "VALUES(" + dvp.getVenta().getIdVenta() + ","
                        + vp.getProducto().getIdProducto() + ","
                        + vp.getPrecioUnitario() + ","
                        + vp.getCantidad() + ","
                        + vp.getDescuento() + ");";
                stmt.execute(query3);
                
            }

            conn.commit();
            conn.setAutoCommit(true);
            rs.close();
            stmt.close();
            conn.close();
            r = true;
        } catch (SQLException ex) {
            Logger.getLogger(ControllerVenta.class.getName()).log(Level.SEVERE, null, ex);
            try {
                conn.rollback();
                conn.setAutoCommit(true);
                conn.close();
                r = false;
            } catch (SQLException ex1) {
                Logger.getLogger(ControllerVenta.class.getName()).log(Level.SEVERE, null, ex1);
                r = false;
            }
        }
        return r;
    }
}
