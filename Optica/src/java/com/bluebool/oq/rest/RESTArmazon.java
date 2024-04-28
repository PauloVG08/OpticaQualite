package com.bluebool.oq.rest;

import com.bluebool.oq.core.ControllerArmazon;
import com.bluebool.oq.model.Armazon;
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

@Path("armazon")
public class RESTArmazon {
    //Consultar registros
    @GET
    @Path("getAll")
    @Produces(MediaType.APPLICATION_JSON) //Los parametros se anotan como QueryParam ya que es un Get
    public Response getAll(@QueryParam("filtro") @DefaultValue("") String filtro,
            @QueryParam("token") @DefaultValue("") String token) throws SQLException {
        String out = null;
        ControllerArmazon ca = new ControllerArmazon();
        List<Armazon> armazones = null;

        if (ca.validarToken(token) == true) {
            try {
                armazones = ca.getAll(filtro);
                out = new Gson().toJson(armazones);
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
    public Response save(@FormParam("datosArmazon") @DefaultValue("") String datosArmazon,
            @FormParam("token") @DefaultValue("") String token) throws SQLException //se pone solo n parametro ya que se pasa un Gson
    {
        String out = null;
        Gson gson = new Gson();
        Armazon arm = null;
        ControllerArmazon ca = new ControllerArmazon();

        if (ca.validarToken(token) == true) {
            try {
                arm = gson.fromJson(datosArmazon, Armazon.class); //Se tranforma a un objeto del tipo empleado con ayudo de los getters y setters de la clase Empleado
                if ((arm.getIdArmazon() == 0)) {
                    ca.insert(arm);
                } else {
                    ca.update(arm);
                }
                out = gson.toJson(arm);
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
    
        //Actualizar añadir
    @Path("save2")
    @POST
    @Produces(MediaType.APPLICATION_JSON)    //Los parametros se anotan como FormParam ya que es un post
    public Response save2(@FormParam("datosArmazon") @DefaultValue("") String datosArmazon) throws SQLException //se pone solo n parametro ya que se pasa un Gson
    {
        String out = null;
        Gson gson = new Gson();
        Armazon arm = null;
        ControllerArmazon ca = new ControllerArmazon();
            try {
                arm = gson.fromJson(datosArmazon, Armazon.class); //Se tranforma a un objeto del tipo empleado con ayudo de los getters y setters de la clase Empleado
                if ((arm.getIdArmazon() == 0)) {
                    ca.insert(arm);
                } else {
                    ca.update(arm);
                }
                out = gson.toJson(arm);
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

        return Response.status(Response.Status.OK).entity(out).build();
    }

    @Path("delete")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteArmazon(@FormParam("id") @DefaultValue("") String id,
            @FormParam("token") @DefaultValue("") String token) throws SQLException {
        String out = null;
        ControllerArmazon ca = new ControllerArmazon();

        if (ca.validarToken(token) == true) {
            try {
                ca.delete(id);
                out = """
                  {'Respuesta':"Armazón eliminado"}                  
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
    
    @Path("delete2")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteArmazon2(@FormParam("id") @DefaultValue("") String id) throws SQLException {
        String out = null;
        ControllerArmazon ca = new ControllerArmazon();
            try {
                ca.delete(id);
                out = """
                  {'Respuesta':"Armazón eliminado"}                  
                  """;
            } catch (Exception e) {
                e.printStackTrace();
                out = """
                {"exception":"%s"}
                """;
                out = String.format(out, e.toString());
            }
        
        return Response.status(Response.Status.OK).entity(out).build();
    }

    @GET
    @Path("buscar")
    @Produces(MediaType.APPLICATION_JSON) //Los parametros se anotan como QueryParam ya que es un Get
    public Response buscar(@QueryParam("filtro") @DefaultValue("") String filtro, @QueryParam("estatus") @DefaultValue("") String estatus,
            @QueryParam("token") @DefaultValue("") String token) throws SQLException {
        String out = null;
        ControllerArmazon ca = new ControllerArmazon();
        List<Armazon> armazones = null;

        if (ca.validarToken(token)) {
            try {
                armazones = ca.buscar(filtro, estatus);
                out = new Gson().toJson(armazones);
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
