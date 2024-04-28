    package com.bluebool.oq.model;

import java.util.List;

/**
 *
 * @author Paulo
 */
public class DetalleVPR {
    private Venta venta;
    private List<VentaPresupuesto> listaVP;
    private List<PresupuestoLentesdeContacto> listaPLC;
    
    public DetalleVPR(){
        
    }

    public DetalleVPR(Venta venta, List<VentaPresupuesto> listaVP, List<PresupuestoLentesdeContacto> listaPLC) {
        this.venta = venta;
        this.listaVP = listaVP;
        this.listaPLC = listaPLC;
    }

    public Venta getVenta() {
        return venta;
    }

    public void setVenta(Venta venta) {
        this.venta = venta;
    }

    public List<VentaPresupuesto> getListaVP() {
        return listaVP;
    }

    public void setListaVP(List<VentaPresupuesto> listaVP) {
        this.listaVP = listaVP;
    }

    public List<PresupuestoLentesdeContacto> getListaPLC() {
        return listaPLC;
    }

    public void setListaPLC(List<PresupuestoLentesdeContacto> listaPLC) {
        this.listaPLC = listaPLC;
    }

    @Override
    public String toString() {
        String mensaje = "";
        String mensaje2 = "";

        for (VentaPresupuesto listaPresupuesto : listaVP) {
            mensaje += listaPresupuesto.toString();
        }
        
        for (PresupuestoLentesdeContacto listaPrlc : listaPLC) {
            mensaje2 = listaPrlc.toString();
        }
        
        StringBuilder sb = new StringBuilder();
        sb.append("DetalleVPR{");
        sb.append("venta=").append(venta.toString());
        sb.append(", listaVP=").append(mensaje);
        sb.append(", listaPLC=").append(mensaje2);
        sb.append('}');
        return sb.toString();
    }
}
