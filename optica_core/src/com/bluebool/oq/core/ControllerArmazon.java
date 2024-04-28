package com.bluebool.oq.core;

import com.bluebool.oq.bd.ConexionMySQL;
import com.bluebool.oq.model.Armazon;
import com.bluebool.oq.model.Producto;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;

public class ControllerArmazon {

    public int insert(Armazon a) throws Exception {
        //Definimos la consulta SQL que invoca al Stored Procedure:
        String sql = "{call insertarArmazon(?, ?, ?, ?, ?, "
                + // Datos producto
                "?, ?, ?, ?, ?, "
                + //Datos Armazon
                "?, ?, ?)}";  // Valores de Retorno

        //Aquí guardaremos los ID's que se generarán:
        int idArmazonGenerado = -1;
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
        cstmt.setString(1, a.getProducto().getNombre().toUpperCase());
        cstmt.setString(2, a.getProducto().getMarca().toUpperCase());
        cstmt.setDouble(3, a.getProducto().getPrecioCompra());
        cstmt.setDouble(4, a.getProducto().getPrecioVenta());
        cstmt.setInt(5, a.getProducto().getExistencias());
        cstmt.setString(6, a.getModelo().toUpperCase());
        cstmt.setString(7, a.getColor().toUpperCase());
        cstmt.setString(8, a.getDimensiones().toUpperCase());
        cstmt.setString(9, a.getDescripcion().toUpperCase());
        cstmt.setString(10, a.getFotografia());

        //Registramos los parámetros de salida:
        cstmt.registerOutParameter(11, Types.INTEGER);
        cstmt.registerOutParameter(12, Types.INTEGER);
        cstmt.registerOutParameter(13, Types.VARCHAR);

        //Ejecutamos el Stored Procedure:
        cstmt.executeUpdate();

        //Recuperamos los ID's generados:
        idProductoGenerado = cstmt.getInt(11);
        idArmazonGenerado = cstmt.getInt(12);
        codigoBarrasGenerado = cstmt.getString(13);

        a.getProducto().setIdProducto(idProductoGenerado);
        a.setIdArmazon(idArmazonGenerado);;
        a.getProducto().setCodigoBarras(codigoBarrasGenerado);

        cstmt.close();
        connMySQL.close();

        //Devolvemos el ID de Cliente generado:
        return idArmazonGenerado;
    }

    public void update(Armazon a) throws Exception {
        //Definimos la consulta SQL que invoca al Stored Procedure:
        String sql = "{call actualizarArmazon(  ?, ?, ?, ?, ?, "
                + //Datos producto
                "?, ?, ?, ?, ?, "
                + //datos armazon
                "?, ?)}"; // IDs

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto invocaremos al StoredProcedure:
        CallableStatement cstmt = conn.prepareCall(sql);

        //Establecemos los parámetros de los datos personales en el orden
        //en que los pide el procedimiento almacenado, comenzando en 1:
        cstmt.setString(1, a.getProducto().getNombre().toUpperCase());
        cstmt.setString(2, a.getProducto().getMarca().toUpperCase());
        cstmt.setDouble(3, a.getProducto().getPrecioCompra());
        cstmt.setDouble(4, a.getProducto().getPrecioVenta());
        cstmt.setInt(5, a.getProducto().getExistencias());
        cstmt.setString(6, a.getModelo().toUpperCase());
        cstmt.setString(7, a.getColor().toUpperCase());
        cstmt.setString(8, a.getDimensiones().toUpperCase());
        cstmt.setString(9, a.getDescripcion().toUpperCase());
        cstmt.setString(10, a.getFotografia());

        cstmt.setInt(11, a.getProducto().getIdProducto());
        cstmt.setInt(12, a.getIdArmazon());

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

    public List<Armazon> getAll(String filtro) throws Exception {
        //La consulta SQL a ejecutar:
        String sql;
        sql = "SELECT * FROM v_armazones WHERE estatus=" + filtro;
        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto ejecutaremos la consulta:
        PreparedStatement pstmt = conn.prepareStatement(sql);

        //Aquí guardaremos los resultados de la consulta:
        ResultSet rs = pstmt.executeQuery();

        List<Armazon> armazones = new ArrayList<>();

        while (rs.next()) {
            armazones.add(fill(rs));
        }

        rs.close();
        pstmt.close();
        connMySQL.close();

        return armazones;
    }

    public List<Armazon> buscar(String filtro, String estatus) throws Exception {
        //La consulta SQL a ejecutar:
        String sql;

        //sql=armarConultaSQL(filtro, estatus);
        sql = "SELECT * FROM v_armazones WHERE (idArmazon like '%" + filtro + "%' or "
                + "modelo like '%" + filtro + "%' or "
                + "color like '%" + filtro + "%' or "
                + "dimensiones like '%" + filtro + "%' or "
                + "descripcion like '%" + filtro + "%' or "
                + "idProducto like '%" + filtro + "%' or "
                + "codigoBarras like '%" + filtro + "%' or "
                + "nombre like '%" + filtro + "%' or "
                + "marca like '%" + filtro + "%' or "
                + "precioCompra like '%" + filtro + "%' or "
                + "precioVenta like '%" + filtro + "%')"
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

        List<Armazon> armazones = new ArrayList<>();

        while (rs.next()) {
            armazones.add(fill(rs));
        }

        rs.close();
        pstmt.close();
        connMySQL.close();

        return armazones;
    }

    private Armazon fill(ResultSet rs) throws Exception {
        Armazon a = new Armazon();
        Producto p = new Producto();

        a.setIdArmazon(rs.getInt("idArmazon"));
        a.setModelo(rs.getString("modelo"));
        a.setColor(rs.getString("color"));
        a.setDimensiones(rs.getString("dimensiones"));
        a.setDescripcion(rs.getString("descripcion"));
        a.setFotografia(rs.getString("fotografia"));

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
