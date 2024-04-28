module org.utl.dsm.opticaqualite {
    requires javafx.controls;
    requires javafx.fxml;
    requires com.jfoenix;
    requires mysql.connector.java;
    requires java.sql;


    opens org.utl.dsm.opticaqualite to javafx.fxml;
    exports org.utl.dsm.opticaqualite;
    exports org.utl.dsm.opticaqualite.controlador;
    opens org.utl.dsm.opticaqualite.controlador to javafx.fxml;
}