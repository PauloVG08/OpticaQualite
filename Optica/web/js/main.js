function checkUser(){
    let empleado = localStorage.getItem("CredencialOptica");
    if (empleado == null) {
        window.location = "index.html";
    }
}

let moduloAccesorio;

function cargarModuloAccesorios(){
    fetch("modules/moduloAccesorios/view_accesorios.html")
        .then(
            function(response){
                return response.text();
            }
        )
        .then(
            function(html){
                document.getElementById("contenedorPrincipal").innerHTML = html;
                import ("../modules/moduloAccesorios/controller_accesorios.js").then(
                    function(controller){
                        moduloAccesorio = controller;
                        moduloAccesorio.inicializar();
                    }
                );
            }
        );
}

let moduloTratamiento;

function cargarModuloTratamientos(){
    fetch("modules/moduloTratamientos/view_Tratamientos.html")
        .then(
            function(response){
                return response.text();
            }
        )
        .then(
            function(html){
                document.getElementById("contenedorPrincipal").innerHTML = html;
                import ("../modules/moduloTratamientos/controller_tratamientos.js").then(
                    function(controller){
                        moduloTratamiento = controller;
                    }
                );
            }
        );
}

let moduloLentesContacto;
function cargarLentesContacto(){
    fetch("modules/moduloLentesContacto/view_lentes_contacto.html")
            .then(
                function(response){
                    return response.text();
                }
            )
            .then(
                function(html){
                    document.getElementById("contenedorPrincipal").innerHTML = html;
                    import("../modules/moduloLentesContacto/controller_lentes_contacto.js").then(
                            function(controller){
                                moduloLentesContacto = controller;
                                moduloLentesContacto.inicializar(); 
                            }
                            );
                }
            );
}


let moduloSoluciones;

function cargarModuloSoluciones(){
    fetch("modules/moduloSoluciones/view_soluciones.html")
            .then(
                function(response){
                    return response.text();
                }
            )
           .then(
               function(html){
                   document.getElementById("contenedorPrincipal").innerHTML = html;
                    import("../modules/moduloSoluciones/controller_soluciones.js").then(    
                            function(controller){
                                moduloSoluciones = controller;
                                moduloSoluciones.inicializar();
                            }
                            );
              }
            );
};

let moduloEmpleado;

function cargarModuloEmpleados(){
    fetch("modules/moduloEmpleados/view_empleados.html")
            .then(
                function(response){
                    return response.text();
                }
            )
           .then(
               function(html){
                   document.getElementById("contenedorPrincipal").innerHTML = html;
                    import("../modules/moduloEmpleados/controller_empleados.js").then(    
                            function(controller){
                                moduloEmpleado = controller;
                                moduloEmpleado.inicializar();
                            }
                            );
              }
            );
};

//let moduloCompra;
//
//function cargarModulo(){
//    fetch("modules/Bitacora_Compra/view_compras.html")
//            .then(
//                function(response){
//                    return response.text();
//                }
//            )
//           .then(
//               function(html){
//                   document.getElementById("contenedorPrincipal").innerHTML = html;
//                    import("../modules/Bitacora_Compra/controller_Compras.js").then(    
//                            function(controller){
//                                moduloCompra = controller;
//                                moduloCompra.loadTabla();
//                            }
//                            );
//              }
//            );
//};

let moduloArmazon;

function cargarModuloArmazones(){
    fetch("modules/moduloArmazones/view_armazones.html")
            .then(
                function(response){
                    return response.text();
                }
            )
           .then(
               function(html){
                   document.getElementById("contenedorPrincipal").innerHTML = html;
                    import("../modules/moduloArmazones/controller_armazones.js").then(    
                            function(controller){
                                moduloArmazon = controller;
                                moduloArmazon.inicializar();
                            }
                            );
              }
            );
};

let moduloMateriales;

function cargarModuloMateriales(){
    fetch("modules/moduloMateriales/view_Materiales.html")
            .then(
                function(response){
                    return response.text();
                }
            )
           .then(
               function(html){
                   document.getElementById("contenedorPrincipal").innerHTML = html;
                    import("../modules/moduloMateriales/controller_materiales.js").then(    
                            function(controller){
                                moduloMateriales = controller;
                                moduloMateriales.loadTabla();
                            }
                            );
              }
            );
};

let moduloExamenVista;

function cargarModuloExamenVista(){
    fetch("modules/moduloExamenVista/view_ExamenVista.html")
            .then(
                function(response){
                    return response.text();
                }
            )
           .then(
               function(html){
                   document.getElementById("contenedorPrincipal").innerHTML = html;
                    import("../modules/moduloExamenVista/controller_examen_vista.js").then(    
                            function(controller){
                                moduloExamenVista = controller;
                                moduloExamenVista.inicializar();
                            }
                            );
              }
            );
};

let moduloClientes;

function cargarModuloClientes(){
    fetch("modules/moduloClientes/view_clientes.html")
            .then(
                function(response){
                    return response.text();
                }
            )
           .then(
               function(html){
                   document.getElementById("contenedorPrincipal").innerHTML = html;
                    import("../modules/moduloClientes/controller_clientes.js").then(    
                            function(controller){
                                moduloClientes = controller;
                                moduloClientes.inicializar();
                            }
                            );
              }
            );
};

let moduloVentas;

function cargarModuloVentas(){
    fetch("modules/moduloVentas/view_ventas.html")
        .then(
            function(response){
                return response.text();
            }
        )
        .then(
            function(html){
                document.getElementById("contenedorPrincipal").innerHTML = html;
                import ("../modules/moduloVentas/controller_ventas.js").then(
                    function(controller){
                        moduloVentas = controller;
                        moduloVentas.inicializar();
                    }
                );
            }
        );
}

let moduloVentasLentesContacto;

function cargarModuloVentasLentesContacto(){
    fetch("modules/moduloVentasLentesContacto/view_ventaLC.html")
        .then(
            function(response){
                return response.text();
            }
        )
        .then(
            function(html){
                document.getElementById("contenedorPrincipal").innerHTML = html;
                import ("../modules/moduloVentasLentesContacto/controller_ventas_lentes_contacto.js").then(
                    function(controller){
                        moduloVentasLentesContacto = controller;
                        moduloVentasLentesContacto.inicializar();
                    }
                );
            }
        );
}

let moduloVentasLentesArmazon;

function cargarModuloVentasLentesArmazon(){
    fetch("modules/moduloVentasLentesArmazon/view_ventaLA.html")
        .then(
            function(response){
                return response.text();
            }
        )
        .then(
            function(html){
                document.getElementById("contenedorPrincipal").innerHTML = html;
                import ("../modules/moduloVentasLentesArmazon/controller_ventas_lentes_armazon.js").then(
                    function(controller){
                        moduloVentasLentesArmazon = controller;
                        moduloVentasLentesArmazon.inicializar();
                    }
                );
            }
        );
}