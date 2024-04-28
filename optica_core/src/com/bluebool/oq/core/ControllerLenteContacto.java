package com.bluebool.oq.core;

import com.bluebool.oq.bd.ConexionMySQL;
import com.bluebool.oq.model.LenteContacto;
import com.bluebool.oq.model.Producto;
import com.mysql.cj.jdbc.result.ResultSetImpl;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;

public class ControllerLenteContacto {

    public int insert(LenteContacto lc) throws Exception {
        //Definimos la consulta SQL que invoca al Stored Procedure:
        String sql = "{call insertarLenteContacto(?, ?, ?, ?, ?, "
                + // Datos producto
                "?, ?, "
                + //Datos lente de contacto
                "?, ?, ?)}";  // Valores de Retorno

        //Aquí guardaremos los ID's que se generarán:
        int idLenteContactoGenerado = -1;
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
        cstmt.setString(1, lc.getProducto().getNombre().toUpperCase());
        cstmt.setString(2, lc.getProducto().getMarca().toUpperCase());
        cstmt.setDouble(3, lc.getProducto().getPrecioCompra());
        cstmt.setDouble(4, lc.getProducto().getPrecioVenta());
        cstmt.setInt(5, lc.getProducto().getExistencias());
        cstmt.setInt(6, lc.getQueratometria());
        cstmt.setString(7, lc.getFotografia());

        //Registramos los parámetros de salida:
        cstmt.registerOutParameter(8, Types.INTEGER);
        cstmt.registerOutParameter(9, Types.INTEGER);
        cstmt.registerOutParameter(10, Types.VARCHAR);

        //Ejecutamos el Stored Procedure:
        cstmt.executeUpdate();

        //Recuperamos los ID's generados:
        idProductoGenerado = cstmt.getInt(8);
        idLenteContactoGenerado = cstmt.getInt(9);
        codigoBarrasGenerado = cstmt.getString(10);

        lc.getProducto().setIdProducto(idProductoGenerado);
        lc.setIdLenteContacto(idLenteContactoGenerado);
        lc.getProducto().setCodigoBarras(codigoBarrasGenerado);

        cstmt.close();
        connMySQL.close();

        //Devolvemos el ID de lente de contacto generado:
        return idLenteContactoGenerado;
    }

    public void update(LenteContacto lc) throws Exception {
        //Definimos la consulta SQL que invoca al Stored Procedure:
        String sql = "{call actualizarLenteContacto(  ?, ?, ?, ?, ?, "
                + //Datos producto
                "?, ?, "
                + //datos lentes contacto
                "?, ?)}"; // IDs

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto invocaremos al StoredProcedure:
        CallableStatement cstmt = conn.prepareCall(sql);

        //Establecemos los parámetros de los datos personales en el orden
        //en que los pide el procedimiento almacenado, comenzando en 1:
        cstmt.setString(1, lc.getProducto().getNombre().toUpperCase());
        cstmt.setString(2, lc.getProducto().getMarca().toUpperCase());
        cstmt.setDouble(3, lc.getProducto().getPrecioCompra());
        cstmt.setDouble(4, lc.getProducto().getPrecioVenta());
        cstmt.setInt(5, lc.getProducto().getExistencias());
        cstmt.setInt(6, lc.getQueratometria());
        cstmt.setString(7, lc.getFotografia());

        cstmt.setInt(8, lc.getProducto().getIdProducto());
        cstmt.setInt(9, lc.getIdLenteContacto());

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

    public List<LenteContacto> buscar(String filtro, String estatus) throws Exception {
        //La consulta SQL a ejecutar:
        String sql;

        //sql=armarConultaSQL(filtro, estatus);
        sql = "SELECT * FROM v_lentes_contacto "
                + "WHERE (codigoBarras like '%" + filtro + "%' or "
                + "keratometria like '%" + filtro + "%' or "
                + "nombre like '%" + filtro + "%' or "
                + "marca like '%" + filtro + "%' or "
                + "precioVenta like '%" + filtro + "%' or "
                + "existencias like '%" + filtro + "%')"
                + "and estatus =" + estatus;

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto ejecutaremos la consulta:
        PreparedStatement pstmt = conn.prepareStatement(sql);

        //Aquí guardaremos los resultados de la consulta:
        //ResultSet rs = null;
        ResultSet rs = pstmt.executeQuery();

        List<LenteContacto> lenteContacto = new ArrayList<>();

        //rs = pstmt.executeQuery();
        while (rs.next()) {
            lenteContacto.add(fill(rs));
        }

        rs.close();
        pstmt.close();
        connMySQL.close();

        return lenteContacto;
    }

    public List<LenteContacto> getAll(String filtro) throws Exception {
        //La consulta SQL a ejecutar:
        String sql;
        sql = "SELECT * FROM v_lentes_contacto WHERE estatus=" + filtro;

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto ejecutaremos la consulta:
        PreparedStatement pstmt = conn.prepareStatement(sql);

        //Aquí guardaremos los resultados de la consulta:
        ResultSet rs = pstmt.executeQuery();

        List<LenteContacto> lentesContacto = new ArrayList<>();

        while (rs.next()) {
            lentesContacto.add(fill(rs));
        }

        rs.close();
        pstmt.close();
        connMySQL.close();

        return lentesContacto;
    }

    private LenteContacto fill(ResultSet rs) throws Exception {
        LenteContacto lc = new LenteContacto();
        Producto p = new Producto();

        lc.setIdLenteContacto(rs.getInt("idLenteContacto"));
        lc.setQueratometria(rs.getInt("keratometria"));
        lc.setFotografia(rs.getString("fotografia"));

        p.setIdProducto(rs.getInt("idProducto"));
        p.setCodigoBarras(rs.getString("codigoBarras"));
        p.setNombre(rs.getString("nombre"));
        p.setMarca(rs.getString("marca"));
        p.setPrecioCompra(rs.getDouble("precioCompra"));
        p.setPrecioVenta(rs.getDouble("precioVenta"));
        p.setExistencias(rs.getInt("existencias"));
        p.setEstatus(rs.getInt("estatus"));

        lc.setProducto(p);

        return lc;
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
