/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.bluebool.oq.rest;

import com.bluebool.oq.core.ControllerVentaLA;
import com.bluebool.oq.core.ControllerVentasLentesContacto;
import com.bluebool.oq.model.DetalleVPR;
import com.bluebool.oq.model.DetalleVentaPreLen;
import com.bluebool.oq.model.Presupuesto;
import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.SQLException;
import java.util.List;
import javax.swing.JOptionPane;

/**
 *
 * @author Paulo
 */
@Path("ventaLA")
public class RESTVentaLentesArmazon {
    
    @POST
    @Path("la")
    @Produces(MediaType.APPLICATION_JSON)
    public Response generarVentaLA(@FormParam("datosVentaLA") @DefaultValue("") String datosVentaLA) {
        String out = null;
        Gson gson = new Gson();
        ControllerVentaLA cvla = new ControllerVentaLA();
        DetalleVentaPreLen dvpa = null;
        List<Presupuesto> p = null;
        try {
            dvpa = gson.fromJson(datosVentaLA, DetalleVentaPreLen.class);
            p = cvla.agregarPresupuesto(dvpa);
            dvpa = cvla.agregarPresupuestoLenteArmazon(dvpa, p);
            dvpa = cvla.agregarPresupuestoTratamientos(dvpa);
            dvpa = cvla.agregarVenta(dvpa);
            dvpa = cvla.agregarVentaPresupuesto(dvpa, p);
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
