package org.utl.dsm.opticaqualite.controlador;

import java.sql.Connection;
import java.sql.DriverManager;

public class ConexionMysql {
    Connection conn;

    public Connection open(){
        String user = "root";
        String password = "121217";
        String url = "jdbc:mysql://127.0.0.1:3306/intellij_db?useSSL=false&useUnicode=true&characterEncoding=utf-8";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn = DriverManager.getConnection(url, user, password);
            return conn;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void close() {
        if (conn != null) {
            try {
                conn.close();
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println("Exception controlada");
            }
        }
    }
}
