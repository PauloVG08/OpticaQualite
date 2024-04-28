package com.bluebool.oq.model;


public class ExamendelaVista {

    private int idExamenVista;
    private String clave;
    private Empleado empleado;
    private Cliente cliente;
    private Graduacion graduacion;
    private String fecha;

    public ExamendelaVista() {

    }

    public ExamendelaVista(int idExamenVista, String clave, Empleado empleado, Cliente cliente, Graduacion graduacion, String fecha) {
        this.idExamenVista = idExamenVista;
        this.clave = clave;
        this.empleado = empleado;
        this.cliente = cliente;
        this.graduacion = graduacion;
        this.fecha = fecha;
    }
    

    public int getIdExamenVista() {
        return idExamenVista;
    }

    public void setIdExamenVista(int idExamenVista) {
        this.idExamenVista = idExamenVista;
    }

    public String getClave() {
        return clave;
    }

    public void setClave(String clave) {
        this.clave = clave;
    }

    public Empleado getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Graduacion getGraduacion() {
        return graduacion;
    }

    public void setGraduacion(Graduacion graduacion) {
        this.graduacion = graduacion;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("ExamendelaVista{");
        sb.append("idExamenVista=").append(idExamenVista);
        sb.append(", clave=").append(clave);
        sb.append(", empleado=").append(empleado);
        sb.append(", cliente=").append(cliente);
        sb.append(", graduacion=").append(graduacion);
        sb.append(", fecha=").append(fecha);
        sb.append('}');
        return sb.toString();
    }
    

}
