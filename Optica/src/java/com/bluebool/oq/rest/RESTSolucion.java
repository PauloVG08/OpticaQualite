package com.bluebool.oq.rest;

import com.bluebool.oq.core.ControllerSolucion;
import com.bluebool.oq.model.Solucion;
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

@Path("solucion")
public class RESTSolucion {

    @GET
    @Path("getAll")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(@QueryParam("filtro") @DefaultValue("") String filtro,
            @QueryParam("token") @DefaultValue("") String token) throws SQLException {
        String out = null;
        ControllerSolucion cs = new ControllerSolucion();
        List<Solucion> soluciones = null;

        if (cs.validarToken(token) == true) {
            try {
                soluciones = cs.getAll(filtro);
                out = new Gson().toJson(soluciones);
            } catch (Exception e) {
                e.printStackTrace();
                out = "{\"exception\":\"Error interno del servidor.\"}";
            }
        } else {
            out = "{\"exception\":\"No se encontró un token.\"}";
        }

        return Response.status(Response.Status.OK).entity(out).build();

    }

    //Rest para actualizar o añadir
    @Path("save")
    @POST
    @Produces(MediaType.APPLICATION_JSON)//Los parametros son en formparam al ser de tipo post
    public Response save(@FormParam("datosSolucion") @DefaultValue("") String datosSolucion,
            @FormParam("token") @DefaultValue("") String token) throws SQLException {
        String out = null;
        Gson gson = new Gson();
        Solucion sol = null;
        ControllerSolucion cs = new ControllerSolucion();

        if (cs.validarToken(token) == true) {
            try {
                sol = gson.fromJson(datosSolucion, Solucion.class);

                if ((sol.getIdSolucion() == 0)) {
                    cs.insert(sol);
                } else {
                    cs.update(sol);
                }
                out = gson.toJson(sol);
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
    public Response deleteSolucion(@FormParam("id") @DefaultValue("") String id,
            @FormParam("token") @DefaultValue("") String token) throws SQLException {
        String out = null;
        ControllerSolucion cs = new ControllerSolucion();

        if (cs.validarToken(token) == true) {
            try {
                cs.delete(id);
                out = """
                  {'Respuesta':"Solución eliminada"}
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
    public Response buscar(@QueryParam("filtro") @DefaultValue("") String filtro, @QueryParam("estatus") @DefaultValue("") String estatus,
            @QueryParam("token") @DefaultValue("") String token) throws SQLException {
        String out = null;
        ControllerSolucion cs = new ControllerSolucion();
        List<Solucion> solucion = null;

        if (cs.validarToken(token)) {
            try {
                solucion = cs.buscar(filtro, estatus);
                out = new Gson().toJson(solucion);
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
