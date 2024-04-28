package com.bluebool.oq.model;

import java.util.List;

/**
 *
 * @author Paulo
 */
public class DetalleVentaPreLen {
    private Venta venta;
    private List<VentaPresupuesto> listaVentaPresupuesto;
    private List<PresupuestoTratamientos> listaPresupuestoTratamientos;
    
    public DetalleVentaPreLen(){
        
    }

    public DetalleVentaPreLen(Venta venta, List<VentaPresupuesto> ventaPresupuesto, List<PresupuestoTratamientos> presupuestoTratamientos) {
        this.venta = venta;
        this.listaVentaPresupuesto = ventaPresupuesto;
        this.listaPresupuestoTratamientos = presupuestoTratamientos ;
    }

    
    public List<PresupuestoTratamientos> getPresupuestoTratamientos() {
        return listaPresupuestoTratamientos;
    }

    public void setPresupuestoTratamientos(List<PresupuestoTratamientos> presupuestoTratamientos) {
        this.listaPresupuestoTratamientos = presupuestoTratamientos;
    }

    public List<VentaPresupuesto> getVentaPresupuesto() {
        return listaVentaPresupuesto;
    }

    public void setVentaPresupuesto(List<VentaPresupuesto> ventaPresupuesto) {
        this.listaVentaPresupuesto = ventaPresupuesto;
    }

    public Venta getVenta() {
        return venta;
    }

    public void setVenta(Venta venta) {
        this.venta = venta;
    }
}
