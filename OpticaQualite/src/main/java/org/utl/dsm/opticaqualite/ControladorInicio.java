package org.utl.dsm.opticaqualite;

import com.jfoenix.controls.JFXButton;
import javafx.animation.TranslateTransition;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Label;
import javafx.scene.layout.AnchorPane;
import javafx.util.Duration;

import java.net.URL;
import java.util.ResourceBundle;

public class ControladorInicio implements Initializable{

    @FXML
    private AnchorPane anc_barraLateral;


    @FXML
    private Label lbl_menuAbierto;

    @FXML
    private Label lbl_menuCerrado;

    @FXML
    private JFXButton btn_accesorios;

    @FXML
    private JFXButton btn_armazones;

    @FXML
    private JFXButton btn_clientes;

    @FXML
    private JFXButton btn_empleados;

    @FXML
    private JFXButton btn_lentesContacto;

    @FXML
    private JFXButton btn_soluciones;

    @FXML
    private JFXButton img_optica;

    @FXML
    private AnchorPane vista_clientes;

    @FXML
    private AnchorPane vista_empleados;

    @FXML
    private AnchorPane vista_accesorios;

    @FXML
    private AnchorPane vista_lentesContacto;

    @FXML
    private AnchorPane vista_soluciones;

    @FXML
    private AnchorPane vista_armazones;

    @FXML
    private AnchorPane vista_menu;


    @FXML
    private void handleModules(ActionEvent event){
        if (event.getSource() == img_optica){
            vista_menu.toFront();
        } else if (event.getSource() == btn_accesorios) {
            vista_accesorios.toFront();
        }
        else if (event.getSource() == btn_empleados) {
            vista_empleados.toFront();
        }
        else if (event.getSource() == btn_clientes) {
            vista_clientes.toFront();
        }
        else if (event.getSource() == btn_armazones) {
            vista_armazones.toFront();
        }
        else if (event.getSource() == btn_soluciones) {
            vista_soluciones.toFront();
        }
        else if (event.getSource() == btn_lentesContacto) {
            vista_lentesContacto.toFront();
        }
    }

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        vista_menu.toFront();

        anc_barraLateral.setTranslateX(0);
        lbl_menuCerrado.setVisible(true);
        lbl_menuAbierto.setVisible(false);

        lbl_menuAbierto.setOnMouseClicked(event -> {
            TranslateTransition slide = new TranslateTransition();
            slide.setDuration(Duration.seconds(0.4));
            slide.setNode(anc_barraLateral);

            slide.setToX(0);
            slide.play();

            anc_barraLateral.setTranslateX(-200);
            anc_barraLateral.setStyle("display: block");

            slide.setOnFinished((ActionEvent e)-> {
                lbl_menuCerrado.setVisible(true);
                lbl_menuAbierto.setVisible(false);
            });
        });

        lbl_menuCerrado.setOnMouseClicked(event -> {
            TranslateTransition slide = new TranslateTransition();
            slide.setDuration(Duration.seconds(0.4));
            slide.setNode(anc_barraLateral);

            slide.setToX(-200);
            slide.play();

            anc_barraLateral.setTranslateX(0);
            anc_barraLateral.setStyle("display: none");

            slide.setOnFinished((ActionEvent e)-> {
                lbl_menuCerrado.setVisible(false);
                lbl_menuAbierto.setVisible(true);
            });
        });
    }

}
