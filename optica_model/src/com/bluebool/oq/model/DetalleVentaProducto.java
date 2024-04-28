/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.bluebool.oq.model;

import java.util.ArrayList;

/**
 *
 * @author Paulo
 */
public class DetalleVentaProducto {

    private Venta venta;
    private ArrayList<VentaProducto> listaProductos;

    public DetalleVentaProducto() {

    }

    public DetalleVentaProducto(Venta venta, ArrayList<VentaProducto> listaProductos) {
        this.venta = venta;
        this.listaProductos = listaProductos;
    }

    public Venta getVenta() {
        return venta;
    }

    public void setVenta(Venta venta) {
        this.venta = venta;
    }

    public ArrayList<VentaProducto> getListaProductos() {
        return listaProductos;
    }

    public void setListaProductos(ArrayList<VentaProducto> listaProductos) {
        this.listaProductos = listaProductos;
    }

    @Override
    public String toString() {
        String mensaje = "";

        for (VentaProducto listaProducto : listaProductos) {
            mensaje += listaProducto.toString();
        }

        StringBuilder sb = new StringBuilder();
        sb.append("DetalleVentaProducto{");
        sb.append("venta=").append(venta);
        sb.append(", listaProductos=").append(listaProductos);
        sb.append('}');
        return sb.toString();
    }

}
