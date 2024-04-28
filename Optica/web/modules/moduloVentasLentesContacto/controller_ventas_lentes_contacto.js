let productos;
let productosCarrito = [];
let empleados;
let empleadoSeleccionado;
let clientes;
let clienteSeleccionado;
let lentesContacto;
let lenteContactoSeleccionado;
let examenesVista;
let examenVistaSeleccionado;
let cantidad = 0.0;
let subtotal = 0.0;
let descuento = 0.0;
let total = 0.0;

export function inicializar() {
    configureTableFilter(document.getElementById("txtBusquedaCliente"),
            document.getElementById("tblLCCliente"));
    refrescarTablaCliente();
    cargarEmpleados();
}

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

// Para el cliente
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
                '<td><button class="btn bg-oq-color" onclick= "moduloVentasLentesContacto.cerrarAccordion(); moduloVentasLentesContacto.mostrarDetalle(' + cliente.idCliente + ');">Seleccionar</button></td>'
                + '</tr>';
        contenido += registro;
    });
    document.getElementById("tblClientes").innerHTML = contenido;
}

export function mostrarDetalle(idCliente) {
    let contenido = "";
    for (var i = 0; i < clientes.length; i++) {
        if (idCliente === clientes[i].idCliente) {
            clienteSeleccionado = clientes[i];
            let registro =
                    "<tr>" +
                    "<td>" + clientes[i].numeroUnico + "</td>" +
                    "<td>" + clientes[i].persona.nombre + "</td>" +
                    "<td>" + clientes[i].persona.apellidoPaterno + "</td>" +
                    "<td>" + clientes[i].persona.telMovil + "</td>"
                    + '</tr>';
            contenido += registro;

            document.getElementById("tblDatosSelecCliente").innerHTML = contenido;
            traerExamenVista(clienteSeleccionado.idCliente);
        }
    }
    if(document.getElementById("contenidoVLC") != null) 
    {
        document.getElementById("contenidoVLC").classList.remove("d-none");
        document.getElementById("collapseClientes").classList.add("collapse");
    }
        
}

// Para lente de contacto
export function traerLenteContacto() {
    let token = (JSON.parse(localStorage.getItem("CredencialOptica")).usuario.lastToken).toString();
    let url = "api/lenteContacto/getAll?filtro=1&token=" + token;
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
                rellenarComboLenteContacto(data);
            });
}

export function rellenarComboLenteContacto(data) {
    limpiarComboLenteContacto();
    lentesContacto = data;
    let selectLenteContacto = document.getElementById("cmbLentesContacto");
    lentesContacto.forEach(function (lc) {
        let option = document.createElement('option');
        option.value = lc.idLenteContacto;
        option.text = lc.producto.nombre;
        selectLenteContacto.appendChild(option);
    });
}

export function limpiarComboLenteContacto() {
    let selectLenteContacto = document.getElementById("cmbLentesContacto");
    let options = selectLenteContacto.getElementsByTagName('option');
    for (var i = 0; i < options.length; i++) {
        selectLenteContacto.removeChild(options[i]);
        i--;
    }
    let option = document.createElement('option');
    option.value = "lenteContacto";
    option.text = "Lente de contacto";
    option.selected = true;
    option.disabled = true;
    selectLenteContacto.appendChild(option);
}

export function agregarLenteContacto() {
    let selectLenteContacto = document.getElementById("cmbLentesContacto");
    var opciones = selectLenteContacto.options;
    for (var i = 0; i < opciones.length; i++) {
        if (opciones[i].selected) {
            lenteContactoSeleccionado = buscarLenteContacto(opciones[i].value);
        }
    }
    
    if(lenteContactoSeleccionado !== null && examenVistaSeleccionado !== null){
        document.getElementById("btnAgregarLenteContacto").classList.remove("disabled");
    }
}

export function buscarLenteContacto(idLenteContacto) {
    let id = parseInt(idLenteContacto);
    for (var i = 0; i < lentesContacto.length; i++) {
        let lc = lentesContacto[i].idLenteContacto;
        if (id === lc) {
            return lentesContacto[i];
        }
    }
}

// Para examen de la vista
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
            option.text = ev.fecha+"";
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
    
    
    if(lenteContactoSeleccionado !== null && examenVistaSeleccionado !== null){
        document.getElementById("btnAgregarLenteContacto").classList.remove("disabled");
    }
    
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

// Para calcular los precios
export function calcularPrecios() {
    let precios = [];
    let cantidades = [];
    let descuentos = [];

    // Sacar los precios
    let celdasPrecio = document.getElementsByName("txtPrecioCarrito");
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

// Para gestionar carrito
export function agregarLenteContactoCarrito() {
    let selectExamenVista = document.getElementById("cmbExamenesVista");
    let selectLenteContacto = document.getElementById("cmbLentesContacto");
    let presupuestoLC = new Object();
    presupuestoLC.idPresupuestoLentesContacto = 0;
    presupuestoLC.presupuesto = new Object();
    presupuestoLC.presupuesto.idPresupuesto = 0;
    presupuestoLC.presupuesto.clave = "";
    presupuestoLC.examenVista = agregarExamenVista();
    presupuestoLC.lenteContacto = lenteContactoSeleccionado;
    presupuestoLC.clave = "";
    productosCarrito.push(presupuestoLC);
    console.log("Antes de agregar al carrito");
    console.log(productosCarrito);
    cargarProductosCarrito();
    selectExamenVista.selectedIndex = 0;
    selectLenteContacto.selectedIndex = 0;
    
    document.getElementById("tablaCarrito").classList.remove("d-none");
    document.getElementById("btnAgregarLenteContacto").classList.add("disabled");
    document.getElementById("btnGenerarVenta").classList.remove("disabled");
    
    calcularPrecios();
}

export function cargarProductosCarrito() {
    let contenido = "";
    // Atrapamos el tbody de la tabla que ya tenemos
    let tbody = document.getElementById("tblProductosCarrito");
    productosCarrito.forEach(function (p) {
        let registro =
                "<tr>" +
                "<td>" + p.lenteContacto.producto.nombre + "</td>" +
                "<td name='txtPrecioCarrito'>" + p.lenteContacto.producto.precioVenta + "</td>" +
                "<td name='txtExistencias'>" + p.lenteContacto.producto.existencias + "</td>" +
                "<td> <input onkeyup='moduloVentasLentesContacto.comprueba(this)' value='1' type='number' step='1' min='1' max='" + p.lenteContacto.producto.existencias + "'" + " id='txtCantidad' name='txtCantidadCarrito' class='form-control' style='text-align: center;'> </td>" +
                "<td> <input onkeyup='moduloVentasLentesContacto.comprueba(this)' value='0' type='number' step='1' min='0' max='100' id='txtDescuento' name='txtDescuentoCarrito' class='form-control' style='text-align: center;'> </td>" +
                "<td><a onclick='moduloVentasLentesContacto.eliminarDetalleCarrito(" + p.lenteContacto.producto.idProducto + ");'><button class='btn bg-oq-color'>Eliminar</button></a></td>" +
                "</tr>";
        contenido += registro;
    });
    tbody.innerHTML = contenido;
}

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
    calcularPrecios();
}

export function eliminarDetalleCarrito(id) {
    let index = productosCarrito.findIndex(p => p.lenteContacto.producto.idProducto === id);
    productosCarrito.splice(index, index + 1);
    cargarProductosCarrito();
    
    calcularPrecios();
}

// Para finalizar la venta
export function generarVenta() {
    // productosCarrito es el listaPresupuestoLentedeContacto, ya está armado
    // Generar la Venta y la listaVentaPresupuesto
    let empleadoVenta = empleadoSeleccionado;
    let venta = new Object();
    venta.empleado = new Object();
    venta.empleado = empleadoVenta;
    venta.idVenta = 0;
    venta.clave = "";

    // Traemos todas las cantidades y los descuentos para poder crear el objeto VentaProducto
    let cantidades = [];
    let descuentos = [];
    let contador = 0;
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

    // Pasamos a generar los datos para el List de ventaPresupuesto(Presupuesto, cantidad, precio, precioUnitario, descuento)
    let listVentaPresupuesto = [];
    for (var i = 0; i < productosCarrito.length; i++) {
        let ventaPresupuesto = new Object();
        ventaPresupuesto.venta = new Object;
        ventaPresupuesto.presupuesto = new Object();
        ventaPresupuesto.presupuesto.idPresupuesto = 0;
        ventaPresupuesto.presupuesto.clave = "";
        ventaPresupuesto.cantidad = cantidades[contador];
        ventaPresupuesto.precioUnitario = productosCarrito[i].lenteContacto.producto.precioVenta;
        ventaPresupuesto.descuento = descuentos[contador];
        listVentaPresupuesto.push(ventaPresupuesto);
        contador++;
    }

    // Generamos los datos que llegaran al servicio api
    // Ya generado el objeto Venta, con objeto Empleado adentro, lo metemos dentro de otro objeto junto con el List de VentaPresupuesto y la List de PresupuestoLentedeContacto
    let datos = {
        venta: venta,
        listaVP: listVentaPresupuesto,
        listaPLC: productosCarrito
    };
    // Generamos los datos que se mandaran al servicio api
    // Este ya contiene todos los objetos necesarios
    let datosVentaLC = {
        datosVentaLC: JSON.stringify(datos)
    };

    let params = new URLSearchParams(datosVentaLC);

    // Hacemos fetch
    fetch("api/ventaLC/lc",
            {
                method: "POST",
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                body: params
            })
            .then(response => {
                return response.json();
            })
            .then(function (data) {
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
    let selectLenteContacto = document.getElementById("cmbLentesContacto");
    selectExamenVista.selectedIndex = 0;
    selectLenteContacto.selectedIndex = 0;

    clienteSeleccionado = null;
    lenteContactoSeleccionado = null;
    examenVistaSeleccionado = null;

    traerLenteContacto();

    cargarProductosCarrito();
}

export function vaciarPresupuesto(){
    document.getElementById('contenidoVLC').classList.add('d-none');
    document.getElementById("btnAgregarLenteContacto").classList.add("disabled");
    document.getElementById("btnGenerarVenta").classList.add("disabled");
    document.getElementById("tablaCarrito").classList.add("d-none");
    
    document.getElementById("txtCantidadTotal").value = "";
    document.getElementById("txtSubtotalTotal").value = "";
    document.getElementById("txtTotalTotal").value = "";
    productosCarrito.splice(0, productosCarrito.length);
    console.log("despues de la venta");
    console.log(productosCarrito);

    let selectExamenVista = document.getElementById("cmbExamenesVista");
    let selectLenteContacto = document.getElementById("cmbLentesContacto");
    selectExamenVista.selectedIndex = 0;
    selectLenteContacto.selectedIndex = 0;

    clienteSeleccionado = null;
    lenteContactoSeleccionado = null;
    examenVistaSeleccionado = null;

    traerLenteContacto();

    cargarProductosCarrito();
    
}

export function cerrarAccordion(){
    document.getElementById('collapseClientes').classList.remove('show');
}