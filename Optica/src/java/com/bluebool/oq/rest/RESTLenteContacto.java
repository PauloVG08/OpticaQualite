package com.bluebool.oq.rest;

import com.bluebool.oq.core.ControllerLenteContacto;
import com.bluebool.oq.model.LenteContacto;
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

@Path("lenteContacto")
public class RESTLenteContacto {
    //Consultar registros

    @GET
    @Path("getAll")
    @Produces(MediaType.APPLICATION_JSON) //Los parametros se anotan como QueryParam ya que es un Get
    public Response getAll(@QueryParam("filtro") @DefaultValue("") String filtro,
            @QueryParam("token") @DefaultValue("") String token) throws SQLException {
        String out = null;
        ControllerLenteContacto clc = new ControllerLenteContacto();
        List<LenteContacto> lentesContacto = null;

        if (clc.validarToken(token) == true) {
            try {
                lentesContacto = clc.getAll(filtro);
                out = new Gson().toJson(lentesContacto);
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
    public Response save(@FormParam("datosLenteContacto") @DefaultValue("") String datosLenteContacto,
                          @FormParam("token") @DefaultValue("") String token) throws SQLException //se pone solo n parametro ya que se pasa un Gson
    {
        String out = null;
        Gson gson = new Gson();
        LenteContacto lente = null;
        ControllerLenteContacto clc = new ControllerLenteContacto();

        if (clc.validarToken(token) == true) {
            try {
                lente = gson.fromJson(datosLenteContacto, LenteContacto.class); //Se tranforma a un objeto del tipo empleado con ayudo de los getters y setters de la clase Empleado
                if ((lente.getIdLenteContacto() == 0)) {
                    clc.insert(lente);
                } else {
                    clc.update(lente);
                }
                out = gson.toJson(lente);
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
        }else {
            out = "{\"exception\":\"No se encontró un token.\"}";
        }
        

        return Response.status(Response.Status.OK).entity(out).build();
    }

    @Path("delete")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteLenteContacto(@FormParam("id") @DefaultValue("") String id,
            @FormParam("token") @DefaultValue("") String token) throws SQLException {
        String out = null;
        ControllerLenteContacto clc = new ControllerLenteContacto();

        if (clc.validarToken(token)) {
            try {
                clc.delete(id);
                out = """
                  {'Respuesta':"Lente de contacto eliminado"}                  
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

    @GET
    @Path("buscar")
    @Produces(MediaType.APPLICATION_JSON) //Los parametros se anotan como QueryParam ya que es un Get
    public Response buscar(@QueryParam("filtro") @DefaultValue("") String filtro,
            @QueryParam("estatus") @DefaultValue("") String estatus,
            @QueryParam("token") @DefaultValue("") String token) throws SQLException {
        String out = null;
        ControllerLenteContacto clc = null;
        List<LenteContacto> lenteContacto = null;

        if (clc.validarToken(token)) {
            try {
                clc = new ControllerLenteContacto();
                lenteContacto = clc.buscar(filtro, estatus);
                out = new Gson().toJson(lenteContacto);
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
