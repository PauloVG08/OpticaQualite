package com.bluebool.oq.core;

import com.bluebool.oq.bd.ConexionMySQL;
import com.bluebool.oq.model.Material;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Paulo
 */
public class ControllerMaterial {
    public List<Material> getAll() throws Exception {
        //La consulta SQL a ejecutar:
        String sql;
        sql = "SELECT * FROM v_materiales";
        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto ejecutaremos la consulta:
        PreparedStatement pstmt = conn.prepareStatement(sql);

        //Aquí guardaremos los resultados de la consulta:
        ResultSet rs = pstmt.executeQuery();

        List<Material> listaMateriales = new ArrayList<>();

        while (rs.next()) {
            listaMateriales.add(fill(rs));
        }

        rs.close();
        pstmt.close();
        connMySQL.close();

        return listaMateriales;
    }
    
    private Material fill(ResultSet rs) throws Exception {
        Material m = new Material();
        
        //Datos propios de los materiales
        m.setIdMaterial(rs.getInt("idMaterial"));
        m.setNombre(rs.getString("nombre"));
        m.setPrecioCompra(rs.getDouble("precioCompra"));
        m.setPrecioVenta(rs.getDouble("precioVenta"));
        
        return m;
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
