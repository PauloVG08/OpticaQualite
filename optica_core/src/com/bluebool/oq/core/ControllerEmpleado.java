package com.bluebool.oq.core;

import com.bluebool.oq.bd.ConexionMySQL;
import com.bluebool.oq.model.Empleado;
import com.bluebool.oq.model.Persona;
import com.bluebool.oq.model.Usuario;
import java.util.ArrayList;
import java.util.List;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.CallableStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

public class ControllerEmpleado {

    public static boolean isAdmin(Empleado e) {
        if (e == null || e.getUsuario() == null || e.getUsuario().getNombre() == null) {
            return false;
        } else {
            return e.getUsuario().getRol().trim().toLowerCase().equals("administrador");
        }
    }

    public int insert(Empleado e) throws Exception {
        //Definimos la consulta SQL que invoca al Stored Procedure:
        String sql = "{call insertarEmpleado(?, ?, ?, ?, ?, ?, ?, "
                + // Datos Personales
                "?, ?, ?, ?, ?, ?, ?, ?, "
                + "?, ?, ?, "
                + // Datos de Seguridad
                "?, ?, ?, ?, ?)}";  // Valores de Retorno

        //Aquí guardaremos los ID's que se generarán:
        int idPersonaGenerado = -1;
        int idEmpleadoGenerado = -1;
        int idUsuarioGenerado = -1;
        String numeroUnicoGenerado = "";

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto invocaremos al StoredProcedure:
        CallableStatement cstmt = conn.prepareCall(sql);

        //Establecemos los parámetros de los datos personales en el orden
        //en que los pide el procedimiento almacenado, comenzando en 1:
        cstmt.setString(1, e.getPersona().getNombre().toUpperCase());
        cstmt.setString(2, e.getPersona().getApellidoPaterno().toUpperCase());
        cstmt.setString(3, e.getPersona().getApellidoMaterno().toUpperCase());
        cstmt.setString(4, e.getPersona().getGenero().toUpperCase());
        cstmt.setString(5, e.getPersona().getFechaNacimiento().toUpperCase());
        cstmt.setString(6, e.getPersona().getCalle().toUpperCase());
        cstmt.setString(7, e.getPersona().getNumero().toUpperCase());
        cstmt.setString(8, e.getPersona().getColonia().toUpperCase());
        cstmt.setString(9, e.getPersona().getCp().toUpperCase());
        cstmt.setString(10, e.getPersona().getCiudad().toUpperCase());
        cstmt.setString(11, e.getPersona().getEstado().toUpperCase());
        cstmt.setString(12, e.getPersona().getTelCasa().toUpperCase());
        cstmt.setString(13, e.getPersona().getTelMovil().toUpperCase());
        cstmt.setString(14, e.getPersona().getEmail().toUpperCase());
        cstmt.setString(15, e.getPersona().getRfc().toUpperCase());

        // Registramos parámetros de datos de seguridad:
        cstmt.setString(16, e.getUsuario().getNombre());
        cstmt.setString(17, e.getUsuario().getContrasenia());
        cstmt.setString(18, e.getUsuario().getRol().toUpperCase());

        //Registramos los parámetros de salida:
        cstmt.registerOutParameter(19, Types.INTEGER);
        cstmt.registerOutParameter(20, Types.INTEGER);
        cstmt.registerOutParameter(21, Types.INTEGER);
        cstmt.registerOutParameter(22, Types.VARCHAR);
        cstmt.registerOutParameter(23, Types.VARCHAR);

        //Ejecutamos el Stored Procedure:
        cstmt.executeUpdate();

        //Recuperamos los ID's generados:
        idPersonaGenerado = cstmt.getInt(19);
        idUsuarioGenerado = cstmt.getInt(20);
        idEmpleadoGenerado = cstmt.getInt(21);
        numeroUnicoGenerado = cstmt.getString(22);

        e.setIdEmpleado(idEmpleadoGenerado);
        e.getPersona().setIdPersona(idPersonaGenerado);
        e.getUsuario().setIdUsuario(idUsuarioGenerado);
        e.setNumeroUnico(numeroUnicoGenerado);

        cstmt.close();
        connMySQL.close();

        //Devolvemos el ID de Cliente generado:
        return idEmpleadoGenerado;
    }

    public void update(Empleado e) throws Exception {
        //Definimos la consulta SQL que invoca al Stored Procedure:
        String sql = "{call actualizarEmpleado(  ?, ?, ?, ?, ?, ?, ?, "
                + //Datos Personales
                "?, ?, ?, ?, ?, ?, ?, ?, "
                + "?, ?, ?, "
                + // Datos de Seguridad
                "?, ?, ?)}"; // IDs

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto invocaremos al StoredProcedure:
        CallableStatement cstmt = conn.prepareCall(sql);

        //Establecemos los parámetros de los datos personales en el orden
        //en que los pide el procedimiento almacenado, comenzando en 1:
        cstmt.setString(1, e.getPersona().getNombre().toUpperCase());
        cstmt.setString(2, e.getPersona().getApellidoPaterno().toUpperCase());
        cstmt.setString(3, e.getPersona().getApellidoMaterno().toUpperCase());
        cstmt.setString(4, e.getPersona().getGenero().toUpperCase());
        cstmt.setString(5, e.getPersona().getFechaNacimiento().toUpperCase());
        cstmt.setString(6, e.getPersona().getCalle().toUpperCase());
        cstmt.setString(7, e.getPersona().getNumero().toUpperCase());
        cstmt.setString(8, e.getPersona().getColonia().toUpperCase());
        cstmt.setString(9, e.getPersona().getCp().toUpperCase());
        cstmt.setString(10, e.getPersona().getCiudad().toUpperCase());
        cstmt.setString(11, e.getPersona().getEstado().toUpperCase());
        cstmt.setString(12, e.getPersona().getTelCasa().toUpperCase());
        cstmt.setString(13, e.getPersona().getTelMovil().toUpperCase());
        cstmt.setString(14, e.getPersona().getEmail().toUpperCase());
        cstmt.setString(15, e.getPersona().getRfc().toUpperCase());
        cstmt.setString(16, e.getUsuario().getNombre());
        cstmt.setString(17, e.getUsuario().getContrasenia());
        cstmt.setString(18, e.getUsuario().getRol().toUpperCase());

        cstmt.setInt(19, e.getPersona().getIdPersona());
        cstmt.setInt(20, e.getUsuario().getIdUsuario());
        cstmt.setInt(21, e.getIdEmpleado());

        //Ejecutamos el Stored Procedure:
        cstmt.executeUpdate();

        cstmt.close();
        connMySQL.close();
    }

    public void delete(String id) throws Exception {
        String sql;
        sql = "UPDATE empleado SET estatus = 0 WHERE idEmpleado=" + id;

        ConexionMySQL connMySQL = new ConexionMySQL();

        Connection conn = connMySQL.open();

        PreparedStatement pstmt = conn.prepareStatement(sql);

        pstmt.executeUpdate();
        pstmt.close();
        connMySQL.close();

    }

    public List<Empleado> getAll(String filtro) throws Exception {
        //La consulta SQL a ejecutar:
        String sql;
        sql = "SELECT * FROM v_empleados WHERE estatus =" + filtro;

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto ejecutaremos la consulta:
        PreparedStatement pstmt = conn.prepareStatement(sql);

        //Aquí guardaremos los resultados de la consulta:
        ResultSet rs = pstmt.executeQuery();

        List<Empleado> empleados = new ArrayList<>();

        while (rs.next()) {
            empleados.add(fill(rs));
        }

        rs.close();
        pstmt.close();
        connMySQL.close();

        return empleados;
    }

    private Empleado fill(ResultSet rs) throws Exception {
        Empleado e = new Empleado();
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

        e.setEstatus(rs.getInt("estatus"));
        e.setIdEmpleado(rs.getInt("idEmpleado"));
        e.setNumeroUnico(rs.getString("numeroUnico"));
        e.setUsuario(new Usuario());
        e.getUsuario().setContrasenia(rs.getString("contrasenia"));
        e.getUsuario().setIdUsuario(rs.getInt("idUsuario"));
        e.getUsuario().setNombre(rs.getString("nombreUsuario"));
        e.getUsuario().setRol(rs.getString("rol"));
        e.getUsuario().setLastToken(rs.getString("lastToken"));
        e.getUsuario().setDateLastToken(rs.getString("dateLastToken"));
        e.setNumeroUnico(rs.getString("numeroUnico"));

        e.setPersona(p);

        return e;
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
