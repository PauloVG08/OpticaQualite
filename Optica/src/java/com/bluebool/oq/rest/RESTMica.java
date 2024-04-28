package com.bluebool.oq.rest;

import com.bluebool.oq.core.ControllerTipoMica;
import com.bluebool.oq.model.TipoMica;
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

@Path("mica")
public class RESTMica {
    @GET
    @Path("getAll")
    @Produces(MediaType.APPLICATION_JSON) //Los parametros se anotan como QueryParam ya que es un Get
    public Response getAll(@QueryParam("token") @DefaultValue("") String token) throws SQLException {
        String out = null;
        ControllerTipoMica ctm = new ControllerTipoMica();
        List<TipoMica> micas = null;

        if (ctm.validarToken(token) == true) {
            try {
                micas = ctm.getAll();
                out = new Gson().toJson(micas);
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
