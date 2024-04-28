package com.bluebool.oq.core;

import com.bluebool.oq.bd.ConexionMySQL;
import com.bluebool.oq.model.Accesorio;
import com.bluebool.oq.model.Producto;
import java.sql.Connection;
import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.util.List;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;

public class ControllerAccesorio {

    public int insert(Accesorio a) throws Exception {
        //Definimos la consulta SQL que invoca al Stored Procedure:
        String sql = "{call insertarAccesorio(?, ?, ?, ?, ?, ?, "
                + // Datos producto
                "?, ?, ?)}";  // Valores de Retorno

        //Aquí guardaremos los ID's que se generarán:
        int idAccesorioGenerado = -1;
        int idProductoGenerado = -1;
        String codigoBarrasGenerado = "";

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto invocaremos al StoredProcedure:
        CallableStatement cstmt = conn.prepareCall(sql);

        //Establecemos los parámetros de los datos personales en el orden
        //en que los pide el procedimiento almacenado, comenzando en 1:
        cstmt.setString(1, a.getProducto().getCodigoBarras());
        cstmt.setString(2, a.getProducto().getNombre().toUpperCase());
        cstmt.setString(3, a.getProducto().getMarca().toUpperCase());
        cstmt.setDouble(4, a.getProducto().getPrecioCompra());
        cstmt.setDouble(5, a.getProducto().getPrecioVenta());
        cstmt.setInt(6, a.getProducto().getExistencias());

        //Registramos los parámetros de salida:
        cstmt.registerOutParameter(7, Types.INTEGER);
        cstmt.registerOutParameter(8, Types.INTEGER);
        cstmt.registerOutParameter(9, Types.VARCHAR);

        //Ejecutamos el Stored Procedure:
        cstmt.executeUpdate();

        //Recuperamos los ID's generados:
        idProductoGenerado = cstmt.getInt(7);
        idAccesorioGenerado = cstmt.getInt(8);
        codigoBarrasGenerado = cstmt.getString(9);

        a.getProducto().setIdProducto(idProductoGenerado);
        a.setIdAccesorio(idAccesorioGenerado);
        a.getProducto().setCodigoBarras(codigoBarrasGenerado);

        cstmt.close();
        connMySQL.close();

        //Devolvemos el ID de Cliente generado:
        return idAccesorioGenerado;
    }

    public void update(Accesorio a) throws Exception {
        //Definimos la consulta SQL que invoca al Stored Procedure:
        String sql = "{call actualizarAccesorio(  ?, ?, ?, ?, ?, ?, "
                + //Datos producto
                "?)}"; // IDs

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto invocaremos al StoredProcedure:
        CallableStatement cstmt = conn.prepareCall(sql);

        //Establecemos los parámetros de los datos personales en el orden
        //en que los pide el procedimiento almacenado, comenzando en 1:
        cstmt.setString(1, a.getProducto().getCodigoBarras());
        cstmt.setString(2, a.getProducto().getNombre().toUpperCase());
        cstmt.setString(3, a.getProducto().getMarca().toUpperCase());
        cstmt.setDouble(4, a.getProducto().getPrecioCompra());
        cstmt.setDouble(5, a.getProducto().getPrecioVenta());
        cstmt.setInt(6, a.getProducto().getExistencias());

        cstmt.setInt(7, a.getProducto().getIdProducto());

        //Ejecutamos el Stored Procedure:
        cstmt.executeUpdate();

        cstmt.close();
        connMySQL.close();
    }

    public void delete(String id) throws Exception {
        String sql;
        sql = "UPDATE producto SET estatus = 0 WHERE idProducto=" + id;

        ConexionMySQL connMySQL = new ConexionMySQL();

        Connection conn = connMySQL.open();

        PreparedStatement pstmt = conn.prepareStatement(sql);

        pstmt.executeUpdate();
        pstmt.close();
        connMySQL.close();

    }

    public List<Accesorio> getAll(String filtro) throws Exception {
        //La consulta SQL a ejecutar:
        String sql;
        sql = "SELECT * FROM v_accesorios WHERE estatus=" + filtro;

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto ejecutaremos la consulta:
        PreparedStatement pstmt = conn.prepareStatement(sql);

        //Aquí guardaremos los resultados de la consulta:
        ResultSet rs = pstmt.executeQuery();

        List<Accesorio> accesorios = new ArrayList<>();

        while (rs.next()) {
            accesorios.add(fill(rs));
        }

        rs.close();
        pstmt.close();
        connMySQL.close();

        return accesorios;
    }

    private Accesorio fill(ResultSet rs) throws Exception {
        Accesorio a = new Accesorio();
        Producto p = new Producto();

        a.setIdAccesorio(rs.getInt("idAccesorio"));

        p.setIdProducto(rs.getInt("idProducto"));
        p.setCodigoBarras(rs.getString("codigoBarras"));
        p.setNombre(rs.getString("nombre"));
        p.setMarca(rs.getString("marca"));
        p.setPrecioCompra(rs.getDouble("precioCompra"));
        p.setPrecioVenta(rs.getDouble("precioVenta"));
        p.setExistencias(rs.getInt("existencias"));
        p.setEstatus(rs.getInt("estatus"));

        a.setProducto(p);

        return a;
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
