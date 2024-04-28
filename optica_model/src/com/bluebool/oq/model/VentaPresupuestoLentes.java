package com.bluebool.oq.model;

/**
 *
 * @author Paulo
 */
public class VentaPresupuestoLentes {
    private PresupuestoLentesconArmazon presupuestoLentes;
    private int cantidad;
    private double precioUnitario;
    private double descuento;
    
    public VentaPresupuestoLentes(){
        
    }

    public PresupuestoLentesconArmazon getPresupuestoLentes() {
        return presupuestoLentes;
    }

    public void setPresupuestoLentes(PresupuestoLentesconArmazon presupuestoLentes) {
        this.presupuestoLentes = presupuestoLentes;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public double getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(double precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public double getDescuento() {
        return descuento;
    }

    public void setDescuento(double descuento) {
        this.descuento = descuento;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("VentaPresupuestoLentes{");
        sb.append("presupuestoLentes=").append(presupuestoLentes);
        sb.append(", cantidad=").append(cantidad);
        sb.append(", precioUnitario=").append(precioUnitario);
        sb.append(", descuento=").append(descuento);
        sb.append('}');
        return sb.toString();
    }
    
    
    
}
