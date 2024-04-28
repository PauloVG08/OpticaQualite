/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.bluebool.oq.rest;

import com.bluebool.oq.core.ControllerMaterial;
import com.bluebool.oq.model.Material;
import com.google.gson.Gson;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
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

@Path("material")
public class RESTMaterial {
    @GET
    @Path("getAll")
    @Produces(MediaType.APPLICATION_JSON) //Los parametros se anotan como QueryParam ya que es un Get
    public Response getAll(@QueryParam("token") @DefaultValue("") String token) throws SQLException {
        String out = null;
        ControllerMaterial ctm = new ControllerMaterial();
        List<Material> materiales = null;

        if (ctm.validarToken(token) == true) {
            try {
                materiales = ctm.getAll();
                out = new Gson().toJson(materiales);
            } catch (Exception e) {
                e.printStackTrace();
                out = "{\"exception\":\"Error interno del servidor.\"}";
            }
        } else {
            out = "{\"exception\":\"No se encontró un token.\"}";
        }

        return Response.status(Response.Status.OK).entity(out).build();
    }
}
