package com.bluebool.oq.model;

import java.util.List;

public class PresupuestoLentesconArmazon {

    private int idPresupuestolentes;
    private Presupuesto presupuesto;
    private int alturaOblea;
    private ExamendelaVista examenVista;
    private TipoMica tipoMica;
    private Material material;
    private Armazon armazon;
    private List<Tratamiento> listaTratamientos;

     public PresupuestoLentesconArmazon(){
        
    }

    public PresupuestoLentesconArmazon(int idPresupuestoleentes, Presupuesto presupuesto, ExamendelaVista examenVista, int alturaOblea, TipoMica tipoMica, Material material, Armazon armazon) {
        this.idPresupuestolentes = idPresupuestoleentes;
        this.presupuesto = presupuesto;
        this.examenVista = examenVista;
        this.alturaOblea = alturaOblea;
        this.tipoMica = tipoMica;
        this.material = material;
        this.armazon = armazon;
    }

    public int getIdPresupuestoleentes() {
        return idPresupuestolentes;
    }

    public void setIdPresupuestoleentes(int idPresupuestoleentes) {
        this.idPresupuestolentes = idPresupuestoleentes;
    }

    public Presupuesto getPresupuesto() {
        return presupuesto;
    }

    public void setPresupuesto(Presupuesto presupuesto) {
        this.presupuesto = presupuesto;
    }

    public int getAlturaOblea() {
        return alturaOblea;
    }

    public void setAlturaOblea(int alturaOblea) {
        this.alturaOblea = alturaOblea;
    }

    public TipoMica getTipoMica() {
        return tipoMica;
    }

    public void setTipoMica(TipoMica tipoMica) {
        this.tipoMica = tipoMica;
    }

    public Material getMaterial() {
        return material;
    }

    public void setMaterial(Material material) {
        this.material = material;
    }

    public Armazon getArmazon() {
        return armazon;
    }

    public void setArmazon(Armazon armazon) {
        this.armazon = armazon;
    }

    public ExamendelaVista getExamenVista() {
        return examenVista;
    }

    public void setExamenVista(ExamendelaVista examenVista) {
        this.examenVista = examenVista;
    }
    
    

}
