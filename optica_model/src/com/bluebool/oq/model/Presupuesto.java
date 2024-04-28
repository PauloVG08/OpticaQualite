package com.bluebool.oq.model;

public class Presupuesto {

    private int idPresupuesto;
    private String clave;
    private ExamendelaVista examenVista;

    public Presupuesto() {

    }

    public Presupuesto(int idPresupuesto, String clave) {
        this.idPresupuesto = idPresupuesto;
        this.clave = clave;
    }

    public Presupuesto(int idPresupuesto, String clave, ExamendelaVista examenVista) {
        this.idPresupuesto = idPresupuesto;
        this.clave = clave;
        this.examenVista = examenVista;
    }

    public int getIdPresupuesto() {
        return idPresupuesto;
    }

    public void setIdPresupuesto(int idPresupuesto) {
        this.idPresupuesto = idPresupuesto;
    }

    public String getClave() {
        return clave;
    }

    public void setClave(String clave) {
        this.clave = clave;
    }

    public ExamendelaVista getExamenVista() {
        return examenVista;
    }

    public void setExamenVista(ExamendelaVista examenVista) {
        this.examenVista = examenVista;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("Presupuesto{");
        sb.append("idPresupuesto=").append(idPresupuesto);
        sb.append(", clave=").append(clave);
        sb.append(", examenVista=").append(examenVista);
        sb.append('}');
        return sb.toString();
    }

    

}
