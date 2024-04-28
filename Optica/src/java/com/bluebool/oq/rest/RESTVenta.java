/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.bluebool.oq.rest;

import com.bluebool.oq.core.ControllerVenta;
import com.bluebool.oq.model.DetalleVentaProducto;
import com.bluebool.oq.model.Producto;
import com.google.gson.Gson;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.SQLException;
import java.util.List;

/**
 *
 * @author Paulo
 */
@Path("venta")
public class RESTVenta {

    @GET
    @Path("getAll")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(@QueryParam("filtro") @DefaultValue("") String filtro,
            @QueryParam("token") @DefaultValue("") String token) throws SQLException {
        String out = null;
        ControllerVenta cv = new ControllerVenta();
        List<Producto> productos = null;

        if (cv.validarToken(token) == true) {
            try {
                productos = cv.getAll(filtro);
                out = new Gson().toJson(productos);
            } catch (Exception e) {
                e.printStackTrace();
                out = "{\"exception\":\"Error interno del servidor.\"}";
            }
        } else {
            out = "{\"exception\":\"No se encontró un token.\"}";
        }

        return Response.status(Response.Status.OK).entity(out).build();
    }

    @GET
    @Path("buscar")
    @Produces(MediaType.APPLICATION_JSON) //Los parametros se anotan como QueryParam ya que es un Get
    public Response buscar(@QueryParam("filtro") @DefaultValue("") String filtro,
            @QueryParam("token") @DefaultValue("") String token) throws SQLException {
        String out = null;
        ControllerVenta cv = new ControllerVenta();
        List<Producto> producto = null;

        if (cv.validarToken(token)) {
            try {
                producto = cv.buscar(filtro);
                out = new Gson().toJson(producto);
            } catch (Exception e) {
                e.printStackTrace();
                out = "{\"exception\":\"Error interno del servidor.\"}";
            }
        } else {
            out = "{\"exception\":\"No se encontró un token.\"}";
        }

        return Response.status(Response.Status.OK).entity(out).build();
    }

    @POST
    @Path("crearVenta")
    @Produces(MediaType.APPLICATION_JSON)
    public Response crearVentaP(@FormParam("datosVP") @DefaultValue("") String datosVP,
            @FormParam("token") @DefaultValue("") String token) throws SQLException {

        ControllerVenta cv = new ControllerVenta();
        String out = "";

        if (cv.validarToken(token)) {
            DetalleVentaProducto dvp = null;
            Gson gson = new Gson();
            dvp = gson.fromJson(datosVP, DetalleVentaProducto.class);
            boolean r = cv.transaccionarVenta(dvp);

            if (r) {
                out = """
                  {"respuesta":"Exito"}
                  """;
            } else {
                out = """
                  {"error":"Fallo"}
                  """;
            }
        }else{
            out = """
                  {"error":"No hay token"}
                  """;
        }

        return Response.status(Response.Status.OK).entity(out).build();
    }
}
