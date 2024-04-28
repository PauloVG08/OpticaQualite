package com.bluebool.oq.model;

import java.util.List;

public class PresupuestoTratamientos {

    private PresupuestoLentesconArmazon presupuestoLentes;
    private List<Tratamiento> tratamientos;
    
    public PresupuestoTratamientos(){
        
    }
    
    public PresupuestoLentesconArmazon getPresupuestoLentes() {
        return presupuestoLentes;
    }

    public void setPresupuestoLentes(PresupuestoLentesconArmazon presupuestoLentes) {
        this.presupuestoLentes = presupuestoLentes;
    }

    public List<Tratamiento> getTratamientos() {
        return tratamientos;
    }

    public void setTratamientos(List<Tratamiento> tratamientos) {
        this.tratamientos = tratamientos;
    }

}
