package com.bluebool.oq.model;

public class PresupuestoLentesdeContacto {

    private int idPresupuestoLentesContacto;
    private Presupuesto presupuesto;
    private ExamendelaVista examenVista;
    private LenteContacto lenteContacto;
    private String clave;

    public PresupuestoLentesdeContacto() {

    }

    public PresupuestoLentesdeContacto(int idPresupuestoLentesContacto, Presupuesto presupuesto, ExamendelaVista examenVista, LenteContacto lenteContacto, String clave) {
        this.idPresupuestoLentesContacto = idPresupuestoLentesContacto;
        this.presupuesto = presupuesto;
        this.examenVista = examenVista;
        this.lenteContacto = lenteContacto;
        this.clave = clave;
    }

    public int getIdPresupuestoLentesContacto() {
        return idPresupuestoLentesContacto;
    }

    public void setIdPresupuestoLentesContacto(int idPresupuestoLentesContacto) {
        this.idPresupuestoLentesContacto = idPresupuestoLentesContacto;
    }

    public ExamendelaVista getExamenVista() {
        return examenVista;
    }

    public void setExamenVista(ExamendelaVista examenVista) {
        this.examenVista = examenVista;
    }

    public LenteContacto getLenteContacto() {
        return lenteContacto;
    }

    public void setLenteContacto(LenteContacto lenteContacto) {
        this.lenteContacto = lenteContacto;
    }

    public String getClave() {
        return clave;
    }

    public void setClave(String clave) {
        this.clave = clave;
    }

    public Presupuesto getPresupuesto() {
        return presupuesto;
    }

    public void setPresupuesto(Presupuesto presupuesto) {
        this.presupuesto = presupuesto;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("PresupuestoLentesdeContacto{");
        sb.append("idPresupuestoLentesContacto=").append(idPresupuestoLentesContacto);
        sb.append(", presupuesto=").append(presupuesto);
        sb.append(", examenVista=").append(examenVista);
        sb.append(", lenteContacto=").append(lenteContacto);
        sb.append(", clave=").append(clave);
        sb.append('}');
        return sb.toString();
    }
}
