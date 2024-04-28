package com.bluebool.oq.model;

import java.util.Date;
import org.apache.commons.codec.digest.DigestUtils;

public class Usuario {

    int idUsuario;
    String nombre;
    String contrasenia;
    String rol;
    String lastToken;
    String dateLastToken;
    //Persona persona;

    public Usuario() {
    }

    public Usuario(int idUsuario, String nombre, String contrasenia, String rol, String lastToken, String dateLastToken) {
        this.idUsuario = idUsuario;
        this.nombre = nombre;
        this.contrasenia = contrasenia;
        this.rol = rol;
        this.lastToken = lastToken;
        this.dateLastToken = dateLastToken;
    }

    public int getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(int idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getContrasenia() {
        return contrasenia;
    }

    public void setContrasenia(String contrasenia) {
        this.contrasenia = contrasenia;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
    
    public void setLastToken()
    {
        String u = this.getNombre();
        String p = this.getContrasenia();
        String k = new Date().toString();
        String x = (DigestUtils.sha256Hex(u+";"+p+";"+k));
        this.lastToken = x;
    }
    
    public String getLastToken() {
        return lastToken;
    }

    public void setLastToken(String lastToken) {
        this.lastToken = lastToken;
    }

    public void setDateLastToken(String dateLastToken) {
        this.dateLastToken = dateLastToken;
    }

}
