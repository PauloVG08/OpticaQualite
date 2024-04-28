package org.utl.dsm.opticaqualite;

import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.scene.input.KeyCode;
import javafx.stage.Stage;

import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;

public class ControladorLogin implements Initializable {

    @FXML
    private Button btn_login;

    @FXML
    private Button btn_cerrar;

    @FXML
    private PasswordField txt_contr;

    @FXML
    private TextField txt_usuario;

    public void validar() throws IOException {
        String user, password;
        user = txt_usuario.getText();
        password = txt_contr.getText();

        if (user.equals("Admin")){
            if (password.equals("1234")){
                Parent principal = FXMLLoader.load(this.getClass().getResource("Principal.FXML"));
                Scene scene = new Scene(principal);

                Stage ventana = new Stage();
                ventana.setScene(scene);
                ventana.setTitle("Optica Qualite");

                ventana.setMaximized(false);
                //ventana.setFullScreen(true);
                ventana.show();
                Stage ventanaLogin = (Stage) btn_login.getScene().getWindow();
                ventanaLogin.close();

                Alert alerta = new Alert(Alert.AlertType.INFORMATION, "Access successfull");
                alerta.show();
            }else {
                Alert alerta = new Alert(Alert.AlertType.ERROR, "Incorrect password");
                alerta.show();
            }
        }else {
            Alert alerta = new Alert(Alert.AlertType.ERROR, "Incorrect user");
            alerta.show();
        }
    }

    public void cerrar(){
        System.exit(0);
    }

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        txt_usuario.setOnKeyPressed(e->{
            if (e.getCode() == KeyCode.ENTER){
                txt_contr.requestFocus();
            }
        });

        txt_contr.setOnKeyPressed(e->{
            if (e.getCode() == KeyCode.ENTER){
                try {
                    validar();
                } catch (IOException ex) {
                    throw new RuntimeException(ex);
                }
            }
        });
    }
}
