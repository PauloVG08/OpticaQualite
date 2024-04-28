package com.bluebool.oq.core;

import com.bluebool.oq.bd.ConexionMySQL;
import com.bluebool.oq.model.Empleado;
import com.bluebool.oq.model.Producto;
import com.bluebool.oq.model.Solucion;
import java.sql.Connection;
import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;

public class ControllerSolucion {

    public static boolean isAdmin(Empleado e) {
        if (e == null || e.getUsuario() == null || e.getUsuario().getNombre() == null) {
            return false;
        } else {
            return e.getUsuario().getRol().trim().toLowerCase().equals("administrador");
        }
    }

    public int insert(Solucion s) throws SQLException {
        //Definimos la consulta que llama al Store Procedure
        String sql = "{call insertarSolucion(?, ?, ?, ?, ?, ?, "
                + //Datos del producto
                "?, ?, ?)}";//Valores de Retorno

        //Se guardan los ID´s que se generarán
        int idProductoGenerado = -1;
        int idSolucionGenerado = -1;
        String codigoBarrasGenerado = "";

        //Instancia para poder hacer la conexion
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexion con la base de datos
        Connection conn = connMySQL.open();

        //Instancia para invocar al store
        CallableStatement cstmt = conn.prepareCall(sql);

        //Establecemos los parametros de los datos en el orden que los pide
        //el store procedure
        cstmt.setString(1, s.getProducto().getCodigoBarras());
        cstmt.setString(2, s.getProducto().getNombre().toUpperCase());
        cstmt.setString(3, s.getProducto().getMarca().toUpperCase());
        cstmt.setDouble(4, s.getProducto().getPrecioCompra());
        cstmt.setDouble(5, s.getProducto().getPrecioVenta());
        cstmt.setInt(6, s.getProducto().getExistencias());

        //Resgistramos los parametros de salida
        cstmt.registerOutParameter(7, Types.INTEGER);
        cstmt.registerOutParameter(8, Types.INTEGER);
        cstmt.registerOutParameter(9, Types.VARCHAR);

        //Ejecutamos el Store Procedure
        cstmt.executeUpdate();

        //Recuperamos los valores de retorno
        idProductoGenerado = cstmt.getInt(7);
        idSolucionGenerado = cstmt.getInt(8);
        codigoBarrasGenerado = cstmt.getString(9);

        //Asignamos estos datos al objeto
        s.getProducto().setIdProducto(idProductoGenerado);
        s.setIdSolucion(idSolucionGenerado);
        s.getProducto().setCodigoBarras(codigoBarrasGenerado);

        //Cerramos las Conexiones
        cstmt.close();
        connMySQL.close();

        //Devolvemos el ID de la solucion generada
        return idSolucionGenerado;
    }

    public void update(Solucion s) throws SQLException {
        //Definimos la consulta sql
        String sql = "{call actualizarSolucion( ?, ?, ?, ?, ?, ?, ?)}";

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto invocaremos al StoredProcedure:
        CallableStatement cstmt = conn.prepareCall(sql);

        cstmt.setString(1, s.getProducto().getCodigoBarras());
        cstmt.setString(2, s.getProducto().getNombre().toUpperCase());
        cstmt.setString(3, s.getProducto().getMarca().toUpperCase());
        cstmt.setDouble(4, s.getProducto().getPrecioCompra());
        cstmt.setDouble(5, s.getProducto().getPrecioVenta());
        cstmt.setInt(6, s.getProducto().getExistencias());

        cstmt.setInt(7, s.getProducto().getIdProducto());
        //cstmt.setInt(8, s.getIdSolucion());
        //cstmt.setString(9, s.getProducto().getCodigoBarras());

        //Ejecutamos el Store Procedure
        cstmt.executeUpdate();

        //Cerramos conexiones
        cstmt.close();
        connMySQL.close();
    }

    public void delete(String id) throws SQLException {
        String sql = "UPDATE producto SET estatus = 0 WHERE idProducto=" + id;

        ConexionMySQL connMySQL = new ConexionMySQL();

        Connection conn = connMySQL.open();

        PreparedStatement pstmt = conn.prepareStatement(sql);

        pstmt.executeUpdate();
        pstmt.close();
        connMySQL.close();
    }

    public List<Solucion> buscar(String filtro, String estatus) throws Exception {
        //La consulta SQL a ejecutar:
        String sql;

        sql = "SELECT * FROM v_soluciones "
                + "WHERE (codigoBarras LIKE '%" + filtro + "%' OR "
                + "nombre LIKE '%" + filtro + "%' OR "
                + "marca LIKE '%" + filtro + "%' OR "
                + "precioCompra LIKE '%" + filtro + "%' OR "
                + "precioVenta LIKE '%" + filtro + "%' OR "
                + "existencias LIKE '%" + filtro + "%')"
                + "AND estatus =" + estatus;

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto ejecutaremos la consulta:
        PreparedStatement pstmt = conn.prepareStatement(sql);

        //Aquí guardaremos los resultados de la consulta:
        //ResultSet rs = null;
        ResultSet rs = pstmt.executeQuery();

        List<Solucion> solucion = new ArrayList<>();

        //rs = pstmt.executeQuery();
        while (rs.next()) {
            solucion.add(fill(rs));
        }

        rs.close();
        pstmt.close();
        connMySQL.close();

        return solucion;
    }

    public List<Solucion> getAll(String filtro) throws SQLException {
        //Consulta sql
        String sql;
        sql = "SELECT * FROM v_soluciones WHERE estatus=" + filtro;
        //sql = armarConsultaSQL(filtro, showDeleted);

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto ejecutaremos la consulta:
        PreparedStatement pstmt = conn.prepareStatement(sql);

        //Aquí guardaremos los resultados de la consulta:
        //ResultSet rs = pstmt.executeQuery();
        ResultSet rs = pstmt.executeQuery();

        List<Solucion> soluciones = new ArrayList<>();

        while (rs.next()) {
            soluciones.add(fill(rs));
        }

        rs.close();
        pstmt.close();
        connMySQL.close();

        return soluciones;

    }

    private Solucion fill(ResultSet rs) throws SQLException {
        Producto p = new Producto();
        Solucion s = new Solucion();

        p.setCodigoBarras(rs.getString("codigoBarras"));
        p.setNombre(rs.getString("nombre"));
        p.setMarca(rs.getString("marca"));
        p.setPrecioCompra(rs.getDouble("precioCompra"));
        p.setPrecioVenta(rs.getDouble("precioVenta"));
        p.setExistencias(rs.getInt("existencias"));
        p.setIdProducto(rs.getInt("idProducto"));
        p.setEstatus(rs.getInt("estatus"));
        s.setIdSolucion(rs.getInt("idSolucion"));

        s.setProducto(p);

        return s;

    }
    
     public boolean validarToken(String token) throws SQLException{
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
}
