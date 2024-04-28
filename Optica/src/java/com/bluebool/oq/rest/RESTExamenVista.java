package com.bluebool.oq.rest;

import com.bluebool.oq.core.ControllerExamenVista;
import com.bluebool.oq.model.ExamendelaVista;
import com.google.gson.Gson;
import com.google.gson.JsonParseException;
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

@Path("examenVista")
public class RESTExamenVista {
    @GET
    @Path("getAll")
    @Produces(MediaType.APPLICATION_JSON) //Los parametros se anotan como QueryParam ya que es un Get
    public Response getAll(@QueryParam("token") @DefaultValue("") String token) throws SQLException {
        String out = null;
        ControllerExamenVista cev = new ControllerExamenVista();
        List<ExamendelaVista> examenes = null;

        if (cev.validarToken(token)) {
            try {
                examenes = cev.getAll();
                out = new Gson().toJson(examenes);
                System.out.println(examenes);
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
    @Path("getAll2")
    @Produces(MediaType.APPLICATION_JSON) //Los parametros se anotan como QueryParam ya que es un Get
    public Response getAll2(@QueryParam("token") @DefaultValue("") String token,
                            @QueryParam("idCliente") @DefaultValue("") String idCliente) throws SQLException {
        String out = null;
        ControllerExamenVista cev = new ControllerExamenVista();
        List<ExamendelaVista> examenes = null;

        if (cev.validarToken(token)) {
            try {
                examenes = cev.getAll2(idCliente);
                out = new Gson().toJson(examenes);
                System.out.println(examenes);
            } catch (Exception e) {
                e.printStackTrace();
                out = "{\"exception\":\"Error interno del servidor.\"}";
            }
        } else {
            out = "{\"exception\":\"No se encontró un token.\"}";
        }

        return Response.status(Response.Status.OK).entity(out).build();
    }   
    
    //Actualizar añadir
    @Path("save")
    @POST
    @Produces(MediaType.APPLICATION_JSON)    //Los parametros se anotan como FormParam ya que es un post
    public Response save(@FormParam("datosEV") @DefaultValue("") String datosEV,
            @FormParam("token") @DefaultValue("") String token) throws SQLException //se pone solo n parametro ya que se pasa un Gson
    {
        String out = null;
        Gson gson = new Gson();
        ExamendelaVista ev = null;
        ControllerExamenVista cev = new ControllerExamenVista();

        if (cev.validarToken(token) == true) {
            try {
                ev = gson.fromJson(datosEV, ExamendelaVista.class); //Se tranforma a un objeto del tipo empleado con ayuda de los getters y setters de la clase ExamendelaVista
                //if (verificarClave(ev.getClave())) {
                    cev.insert(ev);
                //} else {
                    //pendiente de validacion 
                    //cev.update(ev);
                //}
                out = gson.toJson(ev);
            } catch (JsonParseException jpe) {
                jpe.printStackTrace();
                out = """
                {"exception":"%Formato JSON de datos incorrecto"}
                """;
            } catch (Exception e) {
                e.printStackTrace();
                out = """
                {"exception":"%s"}
                """;
                out = String.format(out, e.toString());
            }
        } else {
            out = "{\"exception\":\"No se encontró un token.\"}";
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }
    
    @Path("delete")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteExamenVista(@FormParam("idGraduacion") @DefaultValue("") String idGraduacion,
            @FormParam("idExamenVista") @DefaultValue("") String idExamenVista,
            @FormParam("token") @DefaultValue("") String token) throws SQLException {
        String out = null;
        ControllerExamenVista cev = new ControllerExamenVista();

        if (cev.validarToken(token) == true) {
            try {
                cev.delete(Integer.valueOf(idGraduacion), Integer.valueOf(idExamenVista));
                out = """
                  {'Respuesta':"Examen de la vista eliminado"}                  
                  """;
            } catch (Exception e) {
                e.printStackTrace();
                out = """
                {"exception":"%s"}
                """;
                out = String.format(out, e.toString());
            }
        } else {
            out = "{\"exception\":\"No se encontró un token.\"}";
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }
}
