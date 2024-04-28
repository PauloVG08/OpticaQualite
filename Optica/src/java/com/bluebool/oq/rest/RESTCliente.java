package com.bluebool.oq.rest;

import com.bluebool.oq.core.ControllerCliente;
import com.bluebool.oq.model.Cliente;
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

@Path("cliente")
public class RESTCliente {

    //Consultar registros
    @GET
    @Path("getAll")
    @Produces(MediaType.APPLICATION_JSON) //Los parametros se anotan como QueryParam ya que es un Get
    public Response getAll(@QueryParam("filtro") @DefaultValue("") String filtro,
            @QueryParam("token") @DefaultValue("") String token) throws SQLException {
        String out = null;
        ControllerCliente cc = new ControllerCliente();
        List<Cliente> cliente = null;

        if (cc.validarToken(token) == true) {
            try {
                cliente = cc.getAll(filtro);
                out = new Gson().toJson(cliente);
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
    public Response save(@FormParam("datosCliente") @DefaultValue("") String datosCliente,
            @FormParam("token") @DefaultValue("") String token) throws SQLException //se pone solo n parametro ya que se pasa un Gson
    {
        String out = null;
        Gson gson = new Gson();
        Cliente cli = null;
        ControllerCliente cc = new ControllerCliente();

        if (cc.validarToken(token) == true) {
            try {
                cli = gson.fromJson(datosCliente, Cliente.class); //Se tranforma a un objeto del tipo empleado con ayudo de los getters y setters de la clase Empleado
                if ((cli.getIdCliente() == 0)) {
                    cc.insert(cli);
                } else {
                    cc.update(cli);
                }
                out = gson.toJson(cli);
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
    public Response deleteCliente(@FormParam("id") @DefaultValue("") String id,
            @FormParam("token") @DefaultValue("") String token) throws SQLException {
        String out = null;
        ControllerCliente cc = new ControllerCliente();

        if (cc.validarToken(token) == true) {
            try {
                cc.delete(id);
                out = """
                  {'Respuesta':"Cliente eliminado"}                  
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
