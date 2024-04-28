package org.utl.dsm.opticaqualite.modelo;

public class LenteContacto{
    private int idLenteContacto;
    private Producto producto;
    private int queratometria;
    private String fotografia;

    public LenteContacto(){
        
    }

    public int getIdLenteContacto() {
        return idLenteContacto;
    }

    public void setIdLenteContacto(int idLenteContacto) {
        this.idLenteContacto = idLenteContacto;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public int getQueratometria() {
        return queratometria;
    }

    public void setQueratometria(int queratometria) {
        this.queratometria = queratometria;
    }

    public String getFotografia() {
        return fotografia;
    }

    public void setFotografia(String fotografia) {
        this.fotografia = fotografia;
    }
}
