/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.bluebool.oq.core;

import com.bluebool.oq.bd.ConexionMySQL;
import com.bluebool.oq.model.Empleado;
import com.bluebool.oq.model.Persona;
import com.bluebool.oq.model.Usuario;
import com.mysql.cj.xdevapi.Result;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 *
 * @author Paulo
 */
public class ControllerLogin {

    public Empleado recuperarUsuario(String var_usuario, String var_password) throws SQLException {
        //Creamos nuestra consulta de SQL
        String sql = "SELECT * FROM v_empleados WHERE nombreUsuario = '" + var_usuario + "' AND contrasenia = '" + var_password + "'";

        //Hacemos instancia de la clase que nos permite abrir y cerrar la base de datos
        ConexionMySQL connMySQL = new ConexionMySQL();

        try {

            //Abrimos nuestra base de datos con la instacia previamente hecha
            Connection conexion = connMySQL.open();

            //Creamos el objeto para ejecutar nuestra consulta de SQL
            PreparedStatement pstmt = conexion.prepareStatement(sql);

            //Creamos una variable tipo ResultSet para guardar los resultados de la consulta
            ResultSet rs = pstmt.executeQuery();

            while (rs.next()) {

                Empleado e = new Empleado();
                Persona p = new Persona();
                Usuario u = new Usuario();

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

                pstmt.close();
                conexion.close();
                connMySQL.close();

                return e;
            }
        } catch (SQLException ex) {
            java.util.logging.Logger.getLogger(Usuario.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        return null;
    }

    public void guardarToken(Empleado e) throws SQLException {
        String query = "UPDATE usuario SET lastToken= ?, dateLastToken = current_timestamp() WHERE idUsuario = ?";

        ConexionMySQL connMySQL = new ConexionMySQL();

        Connection conexion = connMySQL.open();

        PreparedStatement pstmt = conexion.prepareStatement(query);

        pstmt.setString(1, e.getUsuario().getLastToken());
        pstmt.setInt(2, e.getUsuario().getIdUsuario());

        pstmt.execute();

        pstmt.close();
        conexion.close();
        connMySQL.close();
    }

    public Empleado buscarUsuario(String var_usuario) throws SQLException {
        //Creamos nuestra consulta de SQL
        String sql = "SELECT * FROM v_empleados WHERE nombreUsuario = '" + var_usuario + "'";

        //Hacemos instancia de la clase que nos permite abrir y cerrar la base de datos
        ConexionMySQL connMySQL = new ConexionMySQL();

        try {

            //Abrimos nuestra base de datos con la instacia previamente hecha
            Connection conexion = connMySQL.open();

            //Creamos el objeto para ejecutar nuestra consulta de SQL
            PreparedStatement pstmt = conexion.prepareStatement(sql);

            //Creamos una variable tipo ResultSet para guardar los resultados de la consulta
            ResultSet rs = pstmt.executeQuery();

            while (rs.next()) {

                Empleado e = new Empleado();
                Persona p = new Persona();
                Usuario u = new Usuario();

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

                pstmt.close();
                conexion.close();
                connMySQL.close();
                return e;
            }
        } catch (SQLException ex) {
            java.util.logging.Logger.getLogger(Usuario.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        return null;
    }

    public void eliminarToken(Empleado empleado){
        String query = "UPDATE usuario SET lastToken = '', dateLastToken = current_timestamp() WHERE idUsuario = ?";
        
        try {
            ConexionMySQL connMySQL = new ConexionMySQL();
            Connection connection = connMySQL.open();
            PreparedStatement ps = connection.prepareCall(query);
            
            ps.setInt(1, empleado.getUsuario().getIdUsuario());
            
            ps.execute();

            ps.close();
            connection.close();
            connMySQL.close();
            
        }catch(SQLException ex){
            java.util.logging.Logger.getLogger(Usuario.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
    }
}
