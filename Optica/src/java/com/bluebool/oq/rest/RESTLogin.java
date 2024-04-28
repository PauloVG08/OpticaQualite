package com.bluebool.oq.rest;

import com.bluebool.oq.core.ControllerLogin;
import com.bluebool.oq.model.Empleado;
import com.bluebool.oq.model.Usuario;
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
import java.util.List;

/**
 *
 * @author Paulo
 */
@Path("login")
public class RESTLogin {

    @POST
    @Path("obtenerUsuario")
    @Produces(MediaType.APPLICATION_JSON)
    public Response recuperarUsuario(@FormParam("usuario") @DefaultValue("") String usuario,
            @FormParam("password") @DefaultValue("") String password) {
        String out = null;
        ControllerLogin cl = new ControllerLogin();
        Empleado usuarioEncontrado = null;
        try {
            usuarioEncontrado = cl.recuperarUsuario(usuario, password);
            if (usuarioEncontrado != null) {
                usuarioEncontrado.getUsuario().setLastToken();
                //usuarioEncontrado.getUsuario().setDateLastToken();
                cl.guardarToken(usuarioEncontrado);
                out = new Gson().toJson(usuarioEncontrado);
            } else {
                out = """
                      {"error" : "Usuario y/o contraseña incorrectos"}
                      """;
            }
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"exception\":\"Error interno del servidor.\"}";
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }

    @POST
    @Path("out")
    @Produces(MediaType.APPLICATION_JSON)
    public Response eliminarToken(@FormParam("usuario") @DefaultValue("") String usuario,
            @FormParam("password") @DefaultValue("") String password) {
        String out = null;
        ControllerLogin cl = new ControllerLogin();
        Empleado usuarioEncontrado = null;
        try {
            usuarioEncontrado = cl.recuperarUsuario(usuario, password);
            if (usuarioEncontrado != null) {
                cl.eliminarToken(usuarioEncontrado);
            }
            
            out = """
                      {"Logout" : "Logout realizado"}
                      """;

        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"exception\":\"Error interno del servidor.\"}";
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }
}
