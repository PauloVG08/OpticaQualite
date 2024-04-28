let clientes;
let clienteSeleccionado;
let empleados;
let empleadoSeleccionado;
let examenesVista;
let examenVistaSeleccionado;
let micas;
let micaSeleccionada;
let materiales;
let materialSeleccionado;
let armazones;
let armazonSeleccionado;
let cantidad = 0.0;
let subtotal = 0.0;
let descuento = 0.0;
let total = 0.0;
let productos;
let tratamientos;
let productosCarrito = [];
let listaTratamientosSeleccionados;
let totalPrecioTratamiento;
//let listaVentaPresupuestoLentes;

export function inicializar(){
    refrescarTablaCliente();
     cargarEmpleados();
     traerTiposMica();
     traerMateriales();
     traerArmazones();
     traerTratamientos();
}

//Espacio para clientes -------------------------------------------
export function refrescarTablaCliente() {
    let token = (JSON.parse(localStorage.getItem("CredencialOptica")).usuario.lastToken).toString();
    let url = "api/cliente/getAll?filtro=1&token=" + token;
    fetch(url)
            .then(response => {
                return response.json();
            })
            .then(function (data)
            {
                if (data.exception != null)
                {
                    Swal.fire('',
                            'Error interno del servidor. Intente nuevamente mas tarde.',
                            'error');
                    return;
                }
                if (data.error != null)
                {
                    Swal.fire('', data.error, 'warning');
                    return;
                }
                if (data.errorsec != null)
                {
                    Swal.fire('', data.errorsec, 'error');
                    alert("Regresando al index por error");
                    window.location.replace('index.html');
                    return;
                }
                cargarTabla(data);
            });
}

export function cargarTabla(data) {
    let contenido = "";
    clientes = data;
    clientes.forEach(function (cliente) {
        let registro =
                "<tr>" +
                "<td>" + cliente.numeroUnico + "</td>" +
                "<td>" + cliente.persona.nombre + "</td>" +
                "<td>" + cliente.persona.apellidoPaterno + "</td>" +
                "<td>" + cliente.persona.telMovil + "</td>" +
                '<td><a href="#"  onclick= "moduloVentasLentesArmazon.cerrarAccordion(); moduloVentasLentesArmazon.mostrarDetalle(' + cliente.idCliente + ');"><button class="btn bg-oq-color">Seleccionar</button></a></td>'
                + '</tr>';
        contenido += registro;
    });
    document.getElementById("tblClientes").innerHTML = contenido;
}

export function mostrarDetalle(idCliente) {
    for (var i = 0;
    i < clientes.length; i++) {
        if (idCliente === clientes[i].idCliente) {
            clienteSeleccionado = clientes[i];
            document.getElementById("txtInformacionCliente").value = clientes[i].persona.nombre + " " + clientes[i].persona.apellidoPaterno;
            traerExamenVista(clienteSeleccionado.idCliente);
        }
    }
    if (document.getElementById("contenidoVLC") != null)
    {
        document.getElementById("contenidoVLC").classList.remove("d-none");
        document.getElementById("collapseClientes").classList.add("collapse");
    }
}

//Espacio para empleados ----------------------------------------------
//Para el empleado
export function cargarEmpleados() {
    let token = (JSON.parse(localStorage.getItem("CredencialOptica")).usuario.lastToken).toString();
    let url = "api/empleado/getAll?filtro=1&token=" + token;
    fetch(url)
            .then(response => {
                return response.json();
            })
            .then(function (data)
            {
                if (data.exception != null)
                {
                    Swal.fire('',
                            'Error interno del servidor. Intente nuevamente mas tarde.',
                            'error');
                    return;
                }
                if (data.error != null)
                {
                    Swal.fire('', data.error, 'warning');
                    return;
                }
                if (data.errorsec != null)
                {
                    Swal.fire('', data.errorsec, 'error');
                    alert("Regresando al index por error");
                    window.location.replace('index.html');
                    return;
                }
                cargarComboBoxEmpleado(data);
            });
}

export function cargarComboBoxEmpleado(data) {
    empleados = data;
    let nombreStorage = JSON.parse(localStorage.getItem("CredencialOptica"));
    empleados.forEach(function (em) {
        if (em.usuario.nombre === nombreStorage.usuario.nombre) {
            empleadoSeleccionado = em;
            document.getElementById("txtEmpleado").value = em.persona.nombre + " " + em.persona.apellidoPaterno;
        }
    });
}

//Espacio para examenes de la vista -----------------------------------------------
export function traerExamenVista(idCliente) {
    let token = (JSON.parse(localStorage.getItem("CredencialOptica")).usuario.lastToken).toString();
    let url = "api/examenVista/getAll2?token=" + token + "&idCliente=" + idCliente;
    fetch(url)
            .then(response => {
                return response.json();
            })
            .then(function (data)
            {
                if (data.exception != null)
                {
                    Swal.fire('',
                            'Error interno del servidor. Intente nuevamente mas tarde.',
                            'error');
                    return;
                }
                if (data.error != null)
                {
                    Swal.fire('', data.error, 'warning');
                    return;
                }
                if (data.errorsec != null)
                {
                    Swal.fire('', data.errorsec, 'error');
                    alert("Regresando al index por error");
                    window.location.replace('index.html');
                    return;
                }
                rellenarComboExamenVista(data);
            });
}

export function rellenarComboExamenVista(data) {
    if (data !== null) {
        limpiarComboExamenVista();
        examenesVista = data;
        let selectExamenVista = document.getElementById("cmbExamenesVista");
        examenesVista.forEach(function (ev) {
            let option = document.createElement('option');
            option.value = ev.idExamenVista;
            option.text = ev.clave;
            selectExamenVista.appendChild(option);
        });
    }
}

export function limpiarComboExamenVista() {
    let selectExamen = document.getElementById("cmbExamenesVista");
    let options = selectExamen.getElementsByTagName('option');

    for (var i = 0; i < options.length; i++) {
        selectExamen.removeChild(options[i]);
        i--;
    }
    let option = document.createElement('option');
    option.value = "selectExamen";
    option.text = "Examen de la vista";
    option.selected = true;
    option.disabled = true;
    selectExamen.appendChild(option);
}

export function agregarExamenVista() {
    let selectExamenVista = document.getElementById("cmbExamenesVista");
    var opciones = selectExamenVista.options;
    for (var i = 0; i < opciones.length; i++) {
        if (opciones[i].selected) {
            examenVistaSeleccionado = buscarExamenVista(opciones[i].value);
        }
    }
    verificarFormulario();
    return examenVistaSeleccionado;
}

export function buscarExamenVista(idExamenVista) {
    let id = parseInt(idExamenVista);
    for (var i = 0; i < examenesVista.length; i++) {
        let lc = examenesVista[i].idExamenVista;
        if (id === lc) {
            return examenesVista[i];
        }
    }
}

//Espacio para los tipos de mica --------------------------------------------------------------------
export function traerTiposMica() {
    let token = (JSON.parse(localStorage.getItem("CredencialOptica")).usuario.lastToken).toString();
    let url = "api/mica/getAll?token=" + token;
    fetch(url)
            .then(response => {
                return response.json();
            })
            .then(function (data)
            {
                if (data.exception != null)
                {
                    Swal.fire('', 'Error interno del servidor. Intente nuevamente más tarde.', 'error');
                    return;
                }
                if (data.error != null)
                {
                    Swal.fire('', data.error, 'warning');
                    return;
                }
                if (data.errorsec != null)
                {
                    Swal.fire('', data.errorsec, 'error');
                    alert("Regresando al index por error");
                    window.location.replace('index.html');
                    return;
                }
                rellenarComboMicas(data);
            });
}
            
export function rellenarComboMicas(data) {
    limpiarComboMicas();
    micas = data;
    let selectLenteContacto = document.getElementById("cmbTiposMica");
    micas.forEach(function (tm) {
        let option = document.createElement('option');
        option.value = tm.idTipoMica;
        option.text = tm.nombre;
        selectLenteContacto.appendChild(option);
    });
}

export function limpiarComboMicas() {
    let selectTipoMica = document.getElementById("cmbTiposMica");
    let options = selectTipoMica.getElementsByTagName('option');
    for (var i = 0; i < options.length; i++) {
        selectTipoMica.removeChild(options[i]);
        i--;
    }
    let option = document.createElement('option');
    option.value = "tipoMica";
    option.text = "Tipo de mica";
    option.selected = true;
    option.disabled = true;
    selectTipoMica.appendChild(option);
}

export function agregarTipoMica() {
    let selectTipoMica = document.getElementById("cmbTiposMica");
    var opciones = selectTipoMica.options;
    for (var i = 0; i < opciones.length; i++) {
        if (opciones[i].selected) {
            micaSeleccionada = buscarLTipoMica(opciones[i].value);
        }
    }
    verificarFormulario();
}

export function buscarLTipoMica(idTipoMica) {
    let id = parseInt(idTipoMica);
    for (var i = 0; i < micas.length; i++) {
        let lc = micas[i].idTipoMica;
        if (id === lc) {
            return micas[i];
        }
    }
}

//Espacio para materiales ---------------------------------------------------------------
export function traerMateriales() {
    let token = (JSON.parse(localStorage.getItem("CredencialOptica")).usuario.lastToken).toString();
    let url = "api/material/getAll?token=" + token;
    fetch(url)
            .then(response => {
                return response.json();
            })
            .then(function (data)
            {
                if (data.exception != null)
                {
                    Swal.fire('', 'Error interno del servidor. Intente nuevamente más tarde.', 'error');
                    return;
                }
                if (data.error != null)
                {
                    Swal.fire('', data.error, 'warning');
                    return;
                }
                if (data.errorsec != null)
                {
                    Swal.fire('', data.errorsec, 'error');
                    alert("Regresando al index por error");
                    window.location.replace('index.html');
                    return;
                }
                rellenarComboMateriales(data);
            });
}

export function rellenarComboMateriales(data) {
    limpiarComboMateriales();
    materiales = data;
    let selectMaterial = document.getElementById("cmbMateriales");
    materiales.forEach(function (m) {
        let option = document.createElement('option');
        option.value = m.idMaterial;
        option.text = m.nombre;
        selectMaterial.appendChild(option);
    });
}

export function limpiarComboMateriales() {
    let selectMaterial = document.getElementById("cmbMateriales");
    let options = selectMaterial.getElementsByTagName('option');
    for (var i = 0; i < options.length; i++) {
        selectMaterial.removeChild(options[i]);
        i--;
    }
    let option = document.createElement('option');
    option.value = "materiales";
    option.text = "Materiales";
    option.selected = true;
    option.disabled = true;
    selectMaterial.appendChild(option);
}

export function agregarMaterial() {
    let selectMaterial = document.getElementById("cmbMateriales");
    var opciones = selectMaterial.options;
    for (var i = 0; i < opciones.length; i++) {
        if (opciones[i].selected) {
            materialSeleccionado = buscarMaterial(opciones[i].value);
        }
    }
    verificarFormulario();
}

export function buscarMaterial(idMaterial) {
    let id = parseInt(idMaterial);
    for (var i = 0; i < materiales.length; i++) {
        let lc = materiales[i].idMaterial;
        if (id === lc) {
            return materiales[i];
        }
    }
}

//Espacio para Armazones -----------------------------------------------
export function traerArmazones() {
    let token = (JSON.parse(localStorage.getItem("CredencialOptica")).usuario.lastToken).toString();
    let url = "api/armazon/getAll?filtro=1&token=" + token;
    fetch(url)
            .then(response => {
                return response.json();
            })
            .then(function (data)
            {
                if (data.exception != null)
                {
                    Swal.fire('', 'Error interno del servidor. Intente nuevamente más tarde.', 'error');
                    return;
                }
                if (data.error != null)
                {
                    Swal.fire('', data.error, 'warning');
                    return;
                }
                if (data.errorsec != null)
                {
                    Swal.fire('', data.errorsec, 'error');
                    alert("Regresando al index por error");
                    window.location.replace('index.html');
                    return;
                }
                rellenarComboArmazones(data);
            });
}

export function rellenarComboArmazones(data) {
    limpiarComboArmazones();
    armazones = data;
    let selectArmazon = document.getElementById("cmbArmazones");
    armazones.forEach(function (lc) {
        let option = document.createElement('option');
        option.value = lc.idArmazon;
        option.text = lc.producto.nombre;
        selectArmazon.appendChild(option);
    });
}

export function limpiarComboArmazones() {
    let selectArmazon = document.getElementById("cmbArmazones");
    let options = selectArmazon.getElementsByTagName('option');
    for (var i = 0; i < options.length; i++) {
        selectArmazon.removeChild(options[i]);
        i--;
    }
    let option = document.createElement('option');
    option.value = "armazon";
    option.text = "Armazones";
    option.selected = true;
    option.disabled = true;
    selectArmazon.appendChild(option);
}

export function agregarArmazon() {
    let selectArmazon = document.getElementById("cmbArmazones");
    var opciones = selectArmazon.options;
    for (var i = 0; i < opciones.length; i++) {
        if (opciones[i].selected) {
            armazonSeleccionado = buscarArmazon(opciones[i].value);
        }
    }
    verificarFormulario();
}

export function buscarArmazon(idArmazon) {
    let id = parseInt(idArmazon);
    for (var i = 0; i < armazones.length; i++) {
        let lc = armazones[i].idArmazon;
        if (id === lc) {
            return armazones[i];
        }
    }
}

//Espacio para tratamientos -----------------------------------------
export function traerTratamientos() {
    let token = (JSON.parse(localStorage.getItem("CredencialOptica")).usuario.lastToken).toString();
    let url = "api/tratamiento/getAll?token=" + token;
    fetch(url)
            .then(response => {
                return response.json();
            })
            .then(function (data)
            {
                if (data.exception != null)
                {
                    Swal.fire('', 'Error interno del servidor. Intente nuevamente más tarde.', 'error');
                    return;
                }
                if (data.error != null)
                {
                    Swal.fire('', data.error, 'warning');
                    return;
                }
                if (data.errorsec != null)
                {
                    Swal.fire('', data.errorsec, 'error');
                    alert("Regresando al index por error");
                    window.location.replace('index.html');
                    return;
                }
                rellenarCheckBoxTratamientos(data);
            });
}

export function rellenarCheckBoxTratamientos(data) {
    tratamientos = data;
    const parentElement = document.getElementById("parteCheck");
    tratamientos.forEach(function (t) {
        const checkboxElement = document.createElement("input");
        checkboxElement.type = "checkbox";
        checkboxElement.id = "cbTratamiento" + t.idTratamiento;
        checkboxElement.name = "cbTratamiento" + t.idTratamiento;
        checkboxElement.value = t.idTratamiento;

        const labelElement = document.createElement("label");
        labelElement.innerHTML = t.nombre; // Texto que se muestra junto al checkbox
        labelElement.setAttribute("for", "cbTratamiento" + t.idTratamiento); // Asociar el label con el checkbox

        labelElement.style.marginRight = "20px";

        parentElement.appendChild(checkboxElement);
        parentElement.appendChild(labelElement);
    });
}

export function agregarTratamiento() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    let contador = 0;
    let totalPrecioTratamiento = 0.0;
    let listaTSN = [];
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            listaTSN.push(buscarTratamiento(checkboxes[i].value));
            totalPrecioTratamiento += listaTSN[contador].precioVenta;
            contador++;
        }
    }
    listaTSN.totalTratamientos = totalPrecioTratamiento;
    verificarFormulario();
    return listaTSN;
}

export function desmarcarCheck() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            checkboxes[i].checked = false;
        }
    }
}

export function buscarTratamiento(idMaterial) {
    let id = parseInt(idMaterial);
    for (var i = 0; i < tratamientos.length; i++) {
        let m = tratamientos[i].idTratamiento;
        if (id === m) {
            return tratamientos[i];
        }
    }
}

export function agregarLenteArmazonCarrito() {
    let selectExamenVista = document.getElementById("cmbExamenesVista");
    let selectLenteArmazon = document.getElementById("cmbArmazones");
    let selectMica = document.getElementById("cmbTiposMica");
    let selectMaterial = document.getElementById("cmbMateriales");

    // Armando el presupuesto de lentes con armazonw
    let presupuestoLentes = new Object();
    // Datos propios de este objeto
    presupuestoLentes.idPresupuestoLentes = 0;
    presupuestoLentes.alturaOblea = parseInt(document.getElementById("txtOblea").value);
    // El objeto presupuesto dentro del objeto del presupuesto lentes con armazon
    presupuestoLentes.presupuesto = new Object();
    presupuestoLentes.presupuesto.idPresupuesto = 0;
    presupuestoLentes.presupuesto.clave = "";
    // Objeto examen de la vista
    presupuestoLentes.examenVista = agregarExamenVista();
    // Objeto de tipo mica
    presupuestoLentes.tipoMica = micaSeleccionada;
    // Objeto de material
    presupuestoLentes.material = materialSeleccionado;
    // Objeto de armazon
    presupuestoLentes.armazon = armazonSeleccionado;

    // Este objeto contiene un objeto de tratamiento y uno de presupuesto lentes de armazon
    let listaPresupuestoTratamientos = new Object();

    // Objeto de presupuesto tratamientos que lleva dentro el presupuesto de lentes de armazon y la lista de tratamientos
    listaPresupuestoTratamientos.presupuestoLentes = new Object();
    listaPresupuestoTratamientos.presupuestoLentes = presupuestoLentes;
    listaPresupuestoTratamientos.tratamientos = new Object();
    listaPresupuestoTratamientos.tratamientos = agregarTratamiento();

    productosCarrito.push(listaPresupuestoTratamientos);

    document.getElementById("tablaCarrito").classList.remove("d-none");
    document.getElementById("btnAgregarLenteArmazon").classList.add("disabled");
    document.getElementById("btnGenerarVenta").classList.remove("disabled");

    cargarProductosCarrito();
    selectExamenVista.selectedIndex = 0;
    selectLenteArmazon.selectedIndex = 0;
    document.getElementById("txtOblea").value = "";
    desmarcarCheck();
    selectMica.selectedIndex = 0;
    selectMaterial.selectedIndex = 0;
    calcularPreciosArmazon();
}

export function cargarProductosCarrito() {
    let contenido = "";
    // Atrapamos el tbody de la tabla que ya tenemos
    let tbody = document.getElementById("tblProductosCarrito");
    productosCarrito.forEach(function (p) {
        let precioArmazon = p.presupuestoLentes.armazon.producto.precioVenta;
        let precioMica = p.presupuestoLentes.tipoMica.precioVenta;
        let precioMaterial = p.presupuestoLentes.material.precioVenta;

        let precioTratamientos = p.tratamientos.totalTratamientos;

        let suma = precioArmazon + precioMica + precioMaterial + precioTratamientos;
        let registro =
                "<tr>" +
                "<td>" + p.presupuestoLentes.armazon.producto.nombre + "</td>" +
                "<td name='txtPrecioCarrito'>" + precioArmazon + "</td>" +
                "<td name='txtPrecioCarritoMica'>" + precioMica + "</td>" +
                "<td name='txtPrecioCarritoMaterial'>" + precioMaterial + "</td>" +
                "<td name='txtPrecioCarritoTratamientos'>" + precioTratamientos + "</td>" +
                "<td name='txtPrecioCarritoSumatoria'>" + suma + "</td>" +
                "<td> <input onkeyup='moduloVentasLentesArmazon.comprueba(this)' type='number' step='1' min='1' max='" + p.presupuestoLentes.armazon.producto.existencias + "'" + " value='1' id='txtCantidad' name='txtCantidadCarrito' class='form-control' style='text-align: center;'> </td>" +
                "<td> <input onkeyup='moduloVentasLentesArmazon.comprueba(this)' type='number' step='1' min='0' value='0' max='100' id='txtDescuento' name='txtDescuentoCarrito' class='form-control' style='text-align: center;'> </td>" +
                "<td><a onclick='moduloVentasLentesArmazon.eliminarDetalleCarrito(" + p.presupuestoLentes.armazon.producto.idProducto + ");'><button class='btn bg-oq-color'>Eliminar</button></a></td>" +
                "</tr>";
        contenido += registro;
    });
    tbody.innerHTML = contenido;
}

//Espacio para el carrito ------------------------------------------------------
//export function cargarProductosCarrito() {
//    let contenido = "";
//    let tbody = document.getElementById("tblProductosCarrito");
//    console.log(productosCarrito);
//    productosCarrito.forEach(function (p) {
//        let tratamientos = "";
//        let totalTratamiento = 0;
//        p.tratamiento.forEach(function (t) {
//            tratamientos += t.nombre + " ($" + t.precioVenta + "), ";
//            totalTratamiento += t.precioVenta;
//        });
//        // Eliminamos la última coma y espacio sobrantes
//        tratamientos = tratamientos.slice(0, -2);
//        let registro =
//                "<tr>" +
//                "<td>" + p.tipoMica.nombre + "</td>" +
//                "<td name='txtPrecioCarrito'>" + p.tipoMica.precioVenta + "</td>" +
//                "<td>" + p.material.nombre + "</td>" +
//                "<td name='txtPrecioCarrito'>" + p.material.precioVenta + "</td>" +
//                "<td>" + p.armazon.producto.nombre + "</td>" +
//                "<td name='txtPrecioCarrito'>" + p.armazon.producto.precioVenta + "</td>" +
//                "<td>" + tratamientos + "</td>" +
//                "<td><a onclick='moduloVentasLentesArmazon.eliminarDetalleCarrito(" + p.tipoMica.idMica + ");'><i class='fa-solid fa-minus'></i></td>" +
//                "</tr>";
//        contenido += registro;
//    });
//    tbody.innerHTML = contenido;
//}

//export function cargarProductosCarrito() {
//    let contenido = "";
//    let tbody = document.getElementById("tblProductosCarrito");
//    console.log(productosCarrito);
//    productosCarrito.forEach(function (p) {
//        let tratamientos = "";
//        let totalTratamiento = 0;
//        p.tratamiento.forEach(function (t) {
//            
//                tratamientos += t.nombre + ", ";
//                totalTratamiento += t.precioVenta;
//            
//        });
//        tratamientos = tratamientos.slice(0, -2); // Eliminar la última coma y el espacio en blanco
//        let registro =
//                "<tr>" +
//                "<td>" + p.tipoMica.nombre + "</td>" +
//                "<td name='txtPrecioCarrito'>" + p.tipoMica.precioVenta + "</td>" +
//                "<td>" + p.material.nombre + "</td>" +
//                "<td name='txtPrecioCarrito'>" + p.material.precioVenta + "</td>" +
//                "<td>" + p.armazon.producto.nombre +
//                "<td name='txtPrecioCarrito'>" + p.armazon.producto.precioVenta + "</td>" +
//                "<td>" + tratamientos + "</td>" +
//                "<td name='txtPrecioCarrito'>" + totalTratamiento + "</td>" +
//                "<td><a onclick='moduloVentasLentesArmazon.eliminarDetalleCarrito(" + p.tipoMica.idMica + ");'><i class='fa-solid fa-minus'></i></td>" +
//                "</tr>";
//        contenido += registro;
//    });
//    tbody.innerHTML = contenido;
//}

export function comprueba(valor) {
    let v = parseInt(valor.value);
    let vmx = parseInt(valor.max);
    let vmn = parseInt(valor.min);
    if (isNaN(v)) {
        valor.value = vmn;
    }
    if (v < vmn) {
        valor.value = vmn;
    }
    if (v > vmx) {
        valor.value = vmx;
    }
    calcularPreciosArmazon();
}

export function eliminarDetalleCarrito(id) {
    let index = productosCarrito.findIndex(p => p.presupuestoLentes.armazon.producto.idProducto === id);
    productosCarrito.splice(index, index + 1);
    cargarProductosCarrito();
}

// calcular precios ------------------------------------
export function calcularPreciosArmazon() {
    let precios = [];
    let cantidades = [];
    let descuentos = [];

    // Sacar los precios
    let celdasPrecio = document.getElementsByName("txtPrecioCarritoSumatoria");
    for (var i = 0; i < celdasPrecio.length; i++) {
        precios[i] = parseFloat(celdasPrecio[i].textContent);
    }
    // Sacar las cantidadades
    let celdasCantidad = document.getElementsByName("txtCantidadCarrito");
    for (var i = 0; i < celdasCantidad.length; i++) {
        cantidades[i] = parseInt(celdasCantidad[i].value);
    }
    // Sacar descuentos
    let celdasDescuento = document.getElementsByName("txtDescuentoCarrito");
    for (var i = 0; i < celdasDescuento.length; i++) {
        descuentos[i] = parseFloat(celdasDescuento[i].value);
    }

    // Generar el total de cantidad
    cantidades.forEach(function (c) {
        cantidad = cantidad + c;
    });
    document.getElementById("txtCantidadTotal").value = cantidad;

    // Generar el total del descuento
    descuentos.forEach(function (d) {
        descuento = descuento + d;
    });

    // Generar el subtotal de la venta precios[i] * cantidades[i]
    for (var i = 0; i < precios.length; i++) {
        subtotal = subtotal + (precios[i] * cantidades[i]);
    }
    document.getElementById("txtSubtotalTotal").value = subtotal;

    // Generar el total con descuento
    for (var i = 0; i < descuentos.length; i++) {
        total = total + ((precios[i]-(precios[i]/100*descuentos[i])) * cantidades[i]);
    }
    document.getElementById("txtTotalTotal").value = total;

    // Retablecer valores de variables
    total = 0.0;
    subtotal = 0.0;
    descuento = 0.0;
    cantidad = 0;
}

export function generarVentaLenteArmazon() {
    let cantidades = [];
    let descuentos = [];
    let contador = 0;
    
    let venta = new Object();
    venta.empleado = new Object();
    venta.empleado = empleadoSeleccionado;
    venta.idVenta = 0;
    venta.clave = "";
    
    //Obtener cantidades
    let celdasCantidad = document.getElementsByName("txtCantidadCarrito");
    for (var i = 0; i < celdasCantidad.length; i++) {
        cantidades[i] = parseInt(celdasCantidad[i].value);
    }
    //Obtener descuentos
    let celdasDescuento = document.getElementsByName("txtDescuentoCarrito");
    for (var i = 0; i < celdasDescuento.length; i++) {
        descuentos[i] = parseFloat(celdasDescuento[i].value);
    }

    // Pasamos a generar los datos para el List de ventaPresupuesto(Presupuesto, cantidad, precio, precioUnitario, descuento)
    let listVentaPresupuesto = [];
    for (var i = 0; i < productosCarrito.length; i++) {
        let ventaPresupuesto = new Object();
        ventaPresupuesto.venta = new Object;
        ventaPresupuesto.presupuesto = new Object();
        ventaPresupuesto.presupuesto.idPresupuesto = 0;
        ventaPresupuesto.presupuesto.clave = "";
        ventaPresupuesto.cantidad = cantidades[contador];
        ventaPresupuesto.precioUnitario = productosCarrito[i].presupuestoLentes.armazon.producto.precioVenta;
        ventaPresupuesto.descuento = descuentos[contador];
        listVentaPresupuesto.push(ventaPresupuesto);
        contador++;
    }

    // Generamos los datos que llegaran al servicio api
    // Ya generado el objeto Venta, con objeto Empleado adentro, lo metemos dentro de otro objeto junto con el List de VentaPresupuesto y la List de PresupuestoLentedeContacto
    let datos = {
        venta: venta,
        listaVentaPresupuesto: listVentaPresupuesto,
        listaPresupuestoTratamientos: productosCarrito
    };
    // Generamos los datos que se mandaran al servicio api
    // Este ya contiene todos los objetos necesarios
    let datosLA = {
        datosVentaLA: JSON.stringify(datos)
    };

    let params = new URLSearchParams(datosLA);

    // Hacemos fetch
    fetch("api/ventaLA/la",
            {
                method: "POST",
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                body: params
            })
            .then(response => {
                return response.json();
            })
            .then(function (data) {
                console.log("RESPUESTA");
                console.log(data.respuesta);
                if (data.respuesta === 'exito') {
                    Swal.fire('', 'Venta agregada exitosamente', 'success');
                    return;
                } else {
                    Swal.fire('', 'Algo fallo. Intente nuevamente mas tarde.', 'error');
                    return;
                }
            });
    document.getElementById("txtCantidadTotal").value = "";
    document.getElementById("txtSubtotalTotal").value = "";
    document.getElementById("txtTotalTotal").value = "";
    productosCarrito.splice(0, productosCarrito.length);
    console.log("despues de la venta");
    console.log(productosCarrito);
    
    let selectExamenVista = document.getElementById("cmbExamenesVista");
    let selectLenteArmazon = document.getElementById("cmbArmazones");
    let selectMica = document.getElementById("cmbTiposMica");
    let selectMaterial = document.getElementById("cmbMateriales");
    selectExamenVista.selectedIndex = 0;
    selectLenteArmazon.selectedIndex = 0;
    selectMica.selectedIndex = 0;
    selectMaterial.selectedIndex = 0;
    
    clienteSeleccionado = null;
    armazonSeleccionado = null;
    examenVistaSeleccionado = null;
    micaSeleccionada = null;
    materialSeleccionado = null;
    listaTratamientosSeleccionados = null;
    
    document.getElementById("txtInformacionCliente").value = "";
    
    traerArmazones();
    
    cargarProductosCarrito();
}

export function vaciarPresupuesto(){
    document.getElementById("txtCantidadTotal").value = "";
    document.getElementById("txtSubtotalTotal").value = "";
    document.getElementById("txtTotalTotal").value = "";
    productosCarrito.splice(0, productosCarrito.length);
    
    let selectExamenVista = document.getElementById("cmbExamenesVista");
    let selectLenteArmazon = document.getElementById("cmbArmazones");
    let selectMica = document.getElementById("cmbTiposMica");
    let selectMaterial = document.getElementById("cmbMateriales");
    selectExamenVista.selectedIndex = 0;
    selectLenteArmazon.selectedIndex = 0;
    selectMica.selectedIndex = 0;
    selectMaterial.selectedIndex = 0;
    
    clienteSeleccionado = null;
    armazonSeleccionado = null;
    examenVistaSeleccionado = null;
    micaSeleccionada = null;
    materialSeleccionado = null;
    listaTratamientosSeleccionados = null;
    
    document.getElementById("txtInformacionCliente").value = "";
    
    traerArmazones();
    
    cargarProductosCarrito();
}

export function cerrarAccordion(){
    document.getElementById('collapseClientes').classList.remove('show');
}

export function verificarFormulario(){
    if(document.getElementById("txtOblea").value !== "" && examenVistaSeleccionado !== null
            && armazonSeleccionado !== null
            && micaSeleccionada !== null
            && materialSeleccionado !== null){
            document.getElementById("btnAgregarLenteArmazon").classList.remove("disabled");
    }
}
