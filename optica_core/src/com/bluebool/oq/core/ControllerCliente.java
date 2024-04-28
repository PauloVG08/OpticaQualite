package com.bluebool.oq.core;

import com.bluebool.oq.bd.ConexionMySQL;
import com.bluebool.oq.model.Cliente;
import com.bluebool.oq.model.Persona;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.ResultSet;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;

public class ControllerCliente {

    public int insert(Cliente c) throws Exception {
        //Definimos la consulta SQL que invoca al Stored Procedure:
        String sql = "{call insertarCliente(?, ?, ?, ?, ?, ?, ?, "
                + // Datos Personales
                "?, ?, ?, ?, ?, ?, ?, ?, "
                + "?, ?, ?)}";  // Valores de Retorno

        //Aquí guardaremos los ID's que se generarán:
        int idPersonaGenerado = -1;
        int idClienteGenerado = -1;
        String numeroUnicoGenerado = "";

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto invocaremos al StoredProcedure:
        CallableStatement cstmt = conn.prepareCall(sql);

        //Establecemos los parámetros de los datos personales en el orden
        //en que los pide el procedimiento almacenado, comenzando en 1:
        cstmt.setString(1, c.getPersona().getNombre().toUpperCase());
        cstmt.setString(2, c.getPersona().getApellidoPaterno().toUpperCase());
        cstmt.setString(3, c.getPersona().getApellidoMaterno().toUpperCase());
        cstmt.setString(4, c.getPersona().getGenero().toUpperCase());
        cstmt.setString(5, c.getPersona().getFechaNacimiento().toUpperCase());
        cstmt.setString(6, c.getPersona().getCalle().toUpperCase());
        cstmt.setString(7, c.getPersona().getNumero().toUpperCase());
        cstmt.setString(8, c.getPersona().getColonia().toUpperCase());
        cstmt.setString(9, c.getPersona().getCp().toUpperCase());
        cstmt.setString(10, c.getPersona().getCiudad().toUpperCase());
        cstmt.setString(11, c.getPersona().getEstado().toUpperCase());
        cstmt.setString(12, c.getPersona().getTelCasa().toUpperCase());
        cstmt.setString(13, c.getPersona().getTelMovil().toUpperCase());
        cstmt.setString(14, c.getPersona().getEmail().toUpperCase());
        cstmt.setString(15, c.getPersona().getRfc().toUpperCase());

        //Registramos los parámetros de salida:
        cstmt.registerOutParameter(16, Types.INTEGER);
        cstmt.registerOutParameter(17, Types.INTEGER);
        cstmt.registerOutParameter(18, Types.VARCHAR);

        //Ejecutamos el Stored Procedure:
        cstmt.executeUpdate();

        //Recuperamos los ID's generados:
        idPersonaGenerado = cstmt.getInt(16);
        idClienteGenerado = cstmt.getInt(17);
        numeroUnicoGenerado = cstmt.getString(18);

        c.setIdCliente(idClienteGenerado);
        c.getPersona().setIdPersona(idPersonaGenerado);
        c.setNumeroUnico(numeroUnicoGenerado);

        cstmt.close();
        connMySQL.close();

        //Devolvemos el ID de Cliente generado:
        return idClienteGenerado;
    }

    public void update(Cliente c) throws Exception {
        //Definimos la consulta SQL que invoca al Stored Procedure:
        String sql = "{call actualizarCliente(  ?, ?, ?, ?, ?, ?, ?, "
                + //Datos Personales
                "?, ?, ?, ?, ?, ?, ?, ?, "
                + "?)}"; // IDs

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto invocaremos al StoredProcedure:
        CallableStatement cstmt = conn.prepareCall(sql);

        //Establecemos los parámetros de los datos personales en el orden
        //en que los pide el procedimiento almacenado, comenzando en 1:
        cstmt.setString(1, c.getPersona().getNombre().toUpperCase());
        cstmt.setString(2, c.getPersona().getApellidoPaterno().toUpperCase());
        cstmt.setString(3, c.getPersona().getApellidoMaterno().toUpperCase());
        cstmt.setString(4, c.getPersona().getGenero().toUpperCase());
        cstmt.setString(5, c.getPersona().getFechaNacimiento().toUpperCase());
        cstmt.setString(6, c.getPersona().getCalle().toUpperCase());
        cstmt.setString(7, c.getPersona().getNumero().toUpperCase());
        cstmt.setString(8, c.getPersona().getColonia().toUpperCase());
        cstmt.setString(9, c.getPersona().getCp().toUpperCase());
        cstmt.setString(10, c.getPersona().getCiudad().toUpperCase());
        cstmt.setString(11, c.getPersona().getEstado().toUpperCase());
        cstmt.setString(12, c.getPersona().getTelCasa().toUpperCase());
        cstmt.setString(13, c.getPersona().getTelMovil().toUpperCase());
        cstmt.setString(14, c.getPersona().getEmail().toUpperCase());
        cstmt.setString(15, c.getPersona().getRfc().toUpperCase());

        cstmt.setInt(16, c.getPersona().getIdPersona());

        //Ejecutamos el Stored Procedure:
        cstmt.executeUpdate();

        cstmt.close();
        connMySQL.close();
    }

    public void delete(String id) throws Exception {
        String sql;
        sql = "UPDATE cliente SET estatus = 0 WHERE idCliente=" + id;

        ConexionMySQL connMySQL = new ConexionMySQL();

        Connection conn = connMySQL.open();

        PreparedStatement pstmt = conn.prepareStatement(sql);

        pstmt.executeUpdate();
        pstmt.close();
        connMySQL.close();

    }

    public List<Cliente> getAll(String filtro) throws Exception {
        //La consulta SQL a ejecutar:
        String sql;
        sql = "SELECT * FROM v_Clientes WHERE estatus =" + filtro;

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto ejecutaremos la consulta:
        PreparedStatement pstmt = conn.prepareStatement(sql);

        //Aquí guardaremos los resultados de la consulta:
        ResultSet rs = pstmt.executeQuery();

        List<Cliente> clientes = new ArrayList<>();

        while (rs.next()) {
            clientes.add(fill(rs));
        }

        rs.close();
        pstmt.close();
        connMySQL.close();

        return clientes;
    }

    private Cliente fill(ResultSet rs) throws Exception {
        Cliente c = new Cliente();
        Persona p = new Persona();

        p.setApellidoMaterno(rs.getString("apellidoMaterno"));
        p.setApellidoPaterno(rs.getString("apellidoPaterno"));
        p.setCalle(rs.getString("calle"));
        p.setCiudad(rs.getString("ciudad"));
        p.setColonia(rs.getString("colonia"));
        p.setCp(rs.getString("cp"));
        p.setEmail(rs.getString("email"));
        p.setEstado(rs.getString("estado"));
        p.setFechaNacimiento(rs.getString("fechaNacimiento"));
        p.setGenero(rs.getString("genero"));
        p.setIdPersona(rs.getInt("idPersona"));
        p.setNombre(rs.getString("nombre"));
        p.setNumero(rs.getString("numero"));
        p.setTelCasa(rs.getString("telcasa"));
        p.setTelMovil(rs.getString("telmovil"));
        p.setRfc(rs.getString("rfc"));

        c.setEstatus(rs.getInt("estatus"));
        c.setIdCliente(rs.getInt("idCliente"));
        c.setNumeroUnico(rs.getString("numeroUnico"));

        c.setPersona(p);

        return c;
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
