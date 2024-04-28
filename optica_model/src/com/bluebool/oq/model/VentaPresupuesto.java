package com.bluebool.oq.model;

public class VentaPresupuesto {

    private Venta venta;
    private Presupuesto presupuesto;
    private int cantidad;
    private Double precioUnitario;
    private Double descuento;

    public VentaPresupuesto() {

    }

    public VentaPresupuesto(Venta venta, Presupuesto presupuesto, int cantidad, Double precioUnitario, Double descuento) {
        this.venta = venta;
        this.presupuesto = presupuesto;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.descuento = descuento;
    }

    public Venta getVenta() {
        return venta;
    }

    public void setVenta(Venta venta) {
        this.venta = venta;
    }

    public Presupuesto getPresupuesto() {
        return presupuesto;
    }

    public void setPresupuesto(Presupuesto presupuesto) {
        this.presupuesto = presupuesto;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public Double getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(Double precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public Double getDescuento() {
        return descuento;
    }

    public void setDescuento(Double descuento) {
        this.descuento = descuento;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("VentaPresupuesto{");
        sb.append("venta=").append(venta);
        sb.append(", presupuesto=").append(presupuesto);
        sb.append(", cantidad=").append(cantidad);
        sb.append(", precioUnitario=").append(precioUnitario);
        sb.append(", descuento=").append(descuento);
        sb.append('}');
        return sb.toString();
    }

}
