/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.bluebool.oq.core;

import com.bluebool.oq.bd.ConexionMySQL;
import com.bluebool.oq.model.Cliente;
import com.bluebool.oq.model.Empleado;
import com.bluebool.oq.model.ExamendelaVista;
import com.bluebool.oq.model.Graduacion;
import com.bluebool.oq.model.Persona;
import com.bluebool.oq.model.Usuario;
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
 */public class ControllerExamenVista {

    public int insert(ExamendelaVista ev) throws Exception {
        //Definimos la consulta SQL que invoca al Stored Procedure:
        String sql = "{call insertarExamenVista(?, ?, ?, ?, ?, ?, ?,"//datos del examen
                + "?, "// Datos del empleado
                + "?, " //Datos del cliente
                + "?, ?, ?, ?)}";  // Valores de Retorno
        
        //Aquí guardaremos los ID's que se generarán:
        int idExamenVista = -1;
        int idGraduación = -1;
        String clave = "";
        String fecha = "";

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto invocaremos al StoredProcedure:
        CallableStatement cstmt = conn.prepareCall(sql);

        //Establecemos los parámetros de los datos personales en el orden
        //en que los pide el procedimiento almacenado, comenzando en 1:
        cstmt.setDouble(1, ev.getGraduacion().getEsferaod());
        cstmt.setDouble(2, ev.getGraduacion().getEsferaoi());
        cstmt.setInt(3, ev.getGraduacion().getCilindrood());
        cstmt.setInt(4, ev.getGraduacion().getCilindrooi());
        cstmt.setInt(5, ev.getGraduacion().getEjeod());
        cstmt.setInt(6, ev.getGraduacion().getEjeoi());
        cstmt.setString(7, ev.getGraduacion().getDip().toUpperCase());

        cstmt.setInt(8, ev.getEmpleado().getIdEmpleado());
        cstmt.setInt(9, ev.getCliente().getIdCliente());

        //Registramos los parámetros de salida:
        cstmt.registerOutParameter(10, Types.INTEGER);
        cstmt.registerOutParameter(11, Types.INTEGER);
        cstmt.registerOutParameter(12, Types.VARCHAR);
        cstmt.registerOutParameter(13, Types.VARCHAR);

        //Ejecutamos el Stored Procedure:
        cstmt.executeUpdate();

        //Recuperamos los ID's generados:
        idExamenVista = cstmt.getInt(10);
        idGraduación = cstmt.getInt(11);
        clave = cstmt.getString(12);
        fecha = cstmt.getString(13);

        ev.setIdExamenVista(idExamenVista);
        ev.getGraduacion().setIdGraduacion(idGraduación);
        ev.setClave(clave);
        ev.setFecha(fecha);

        cstmt.close();
        connMySQL.close();

        //Devolvemos el ID de Cliente generado:
        return idExamenVista;
    }
    
    public List<ExamendelaVista> getAll() throws Exception {
        //La consulta SQL a ejecutar:
        String sql;

        sql = "SELECT * FROM v_examenvista_cliente";
        
        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto ejecutaremos la consulta:
        PreparedStatement pstmt = conn.prepareStatement(sql);

        //Aquí guardaremos los resultados de la consulta:
        ResultSet rs = pstmt.executeQuery();

        List<ExamendelaVista> examenesDeVista = new ArrayList<>();

        while (rs.next()) {
            examenesDeVista.add(fill(rs));
        }

        rs.close();
        pstmt.close();
        connMySQL.close();

        return examenesDeVista;
    }

    public List<ExamendelaVista> getAll2(String idCliente) throws Exception {
        //La consulta SQL a ejecutar:
        String sql;

        sql = "SELECT * FROM v_examenvista_cliente WHERE idCliente = " + idCliente;
        
        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto ejecutaremos la consulta:
        PreparedStatement pstmt = conn.prepareStatement(sql);

        //Aquí guardaremos los resultados de la consulta:
        ResultSet rs = pstmt.executeQuery();

        List<ExamendelaVista> examenesDeVista = new ArrayList<>();

        while (rs.next()) {
            examenesDeVista.add(fill(rs));
        }

        rs.close();
        pstmt.close();
        connMySQL.close();

        return examenesDeVista;
    }

    private ExamendelaVista fill(ResultSet rs) throws Exception {
        ExamendelaVista ev = new ExamendelaVista();
        Cliente c = new Cliente();
        Empleado e = new Empleado();
        Graduacion g = new Graduacion();
        Persona pc = new Persona();
        Persona pe = new Persona();

        //Datos propios de Examen de la vista
        ev.setIdExamenVista(rs.getInt("idExamenVista"));
        ev.setClave(rs.getString("clave"));
        ev.setFecha(rs.getString("fecha"));

        //Datos de persona
        pc.setApellidoMaterno(rs.getString("apellidoMaternoCliente"));
        pc.setApellidoPaterno(rs.getString("apellidoPaternoCliente"));
        pc.setIdPersona(rs.getInt("idPersonaCliente"));
        pc.setNombre(rs.getString("nombreCliente"));

        //Datos de Cliente
        c.setIdCliente(rs.getInt("idCliente"));
        c.setNumeroUnico(rs.getString("numeroUnicoCliente"));

        //Le asignamos una persona a cliente
        c.setPersona(pc);

        //Asignamos las propiedades de empleado
        
        e.setIdEmpleado(rs.getInt("idEmpleado"));
        e.setNumeroUnico(rs.getString("numeroUnicoEmpleado"));
        
        //Datos de persona
        pe.setApellidoMaterno(rs.getString("apellidoMaternoEmpleado"));
        pe.setApellidoPaterno(rs.getString("apellidoPaternoEmpleado"));
        pe.setIdPersona(rs.getInt("idPersonaEmpleado"));
        pe.setNombre(rs.getString("nombreEmpleado"));
        
        //Le asignamos una persona a empleado
        e.setPersona(pe);

        //Asignamos los valores de graduación
        g.setIdGraduacion(rs.getInt("idGraduacion"));
        g.setEsferaod(rs.getDouble("esferaod"));
        g.setEsferaoi(rs.getDouble("esferaoi"));
        g.setCilindrood(rs.getInt("cilindrood"));
        g.setCilindrooi(rs.getInt("cilindrooi"));
        g.setEjeod(rs.getInt("ejeod"));
        g.setEjeoi(rs.getInt("ejeoi"));
        g.setDip(rs.getString("dip"));

        //Asignamos los objetos que necesitamos a examen de la vista
        ev.setCliente(c);
        ev.setEmpleado(e);
        ev.setGraduacion(g);

        return ev;
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
    
    public void update(ExamendelaVista ev) throws Exception {
        //Definimos la consulta SQL que invoca al Stored Procedure:
        String sql = "{call actualizarExamenVista(  ?, ?, ?, ?, ?, ?, ?, "
                + "?, ?)}"; // IDs

        //Con este objeto nos vamos a conectar a la Base de Datos:
        ConexionMySQL connMySQL = new ConexionMySQL();

        //Abrimos la conexión con la Base de Datos:
        Connection conn = connMySQL.open();

        //Con este objeto invocaremos al StoredProcedure:
        CallableStatement cstmt = conn.prepareCall(sql);

        //Establecemos los parámetros de los datos personales en el orden
        //en que los pide el procedimiento almacenado, comenzando en 1:
        cstmt.setDouble(1, ev.getGraduacion().getEsferaod());
        cstmt.setDouble(2, ev.getGraduacion().getEsferaoi());
        cstmt.setDouble(3, ev.getGraduacion().getCilindrood());
        cstmt.setDouble(4, ev.getGraduacion().getCilindrooi());
        cstmt.setDouble(5, ev.getGraduacion().getEjeod());
        cstmt.setDouble(6, ev.getGraduacion().getEjeoi());
        cstmt.setString(7, ev.getGraduacion().getDip());
        //IDs
        cstmt.setInt(8, ev.getGraduacion().getIdGraduacion());
        cstmt.setInt(9, ev.getIdExamenVista());

        //Ejecutamos el Stored Procedure:
        cstmt.executeUpdate();

        cstmt.close();
        connMySQL.close();
    }

    public void delete(int idGraduacion, int idExamenVista) throws Exception {
        String sql;
        sql = "{call EliminarExamenVista(?, ?)}";

        ConexionMySQL connMySQL = new ConexionMySQL();

        Connection conn = connMySQL.open();

        CallableStatement cstmt = conn.prepareCall(sql);

        cstmt.setInt(1, idGraduacion);
        cstmt.setInt(2, idExamenVista);

        //Ejecutamos el Stored Procedure:
        cstmt.executeUpdate();

        cstmt.close();
        connMySQL.close();

    }
    
}