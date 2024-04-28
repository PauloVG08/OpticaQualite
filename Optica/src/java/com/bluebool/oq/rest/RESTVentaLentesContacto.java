/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.bluebool.oq.rest;

import com.bluebool.oq.core.ControllerVentasLentesContacto;
import com.bluebool.oq.model.DetalleVPR;
import com.bluebool.oq.model.Presupuesto;
import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

/**
 *
 * @author Paulo
 */
@Path("ventaLC")
public class RESTVentaLentesContacto {

    @POST
    @Path("lc")
    @Produces(MediaType.APPLICATION_JSON)
    public Response generarVentaLC(@FormParam("datosVentaLC") @DefaultValue("") String datosVentaLC) {
        String out = null;
        Gson gson = new Gson();
        ControllerVentasLentesContacto cvlc = new ControllerVentasLentesContacto();
        DetalleVPR dvp = null;
        List<Presupuesto> p = null;
        try {
            dvp = gson.fromJson(datosVentaLC, DetalleVPR.class);
            p = cvlc.agregarPresupuesto(dvp);
            dvp = cvlc.agregarPresupuestoLentesContacto(dvp, p);
            dvp = cvlc.agregarVenta(dvp);
            dvp = cvlc.agregarVentaPresupuesto(dvp, p);

            out = """
                  {"respuesta":"exito"}
                  """;
        } catch (JsonParseException jpe) {
            jpe.printStackTrace();
            out = """
                  {"exception" : "Formato JSON de Datos Incorrecto"}
                  """;
        } catch (Exception e) {
            e.printStackTrace();
            out = """
                  {"exception" : "%s"}
                  """;
            out = String.format(out, e.toString());
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }
}
