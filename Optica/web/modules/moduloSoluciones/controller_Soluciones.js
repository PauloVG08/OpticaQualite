let soluciones = [];
let keynum;

export function inicializar() {
    configureTableFilter(document.getElementById("txtBusquedaCompra"),
            document.getElementById("tblSol"));
    refrescarTabla();
}

export function refrescarTabla() {
    let filtro = document.getElementById("cmbFiltroSolucion").value;
    let token = (JSON.parse( localStorage.getItem("CredencialOptica")).usuario.lastToken).toString(); 
    let url = "api/solucion/getAll?filtro=" + filtro + "&token=" + token;
    fetch(url)
            .then(response => {
                return response.json();
            })
            .then(function (data)
            {
                if (data.exception != null)
                {
                    swal.fire('', 'Error interno del servidor. Intente nuevamente más tarde.', 'Error');
                    window.location.replace("index.html");
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
                    window.location.replace('index.html');
                    return;
                }
                loadTable(data);
            });
}

export function loadTable(data) {
    let cuerpo = "";
    soluciones = data;
    soluciones.forEach(function (soluciones) {
        let registro =
                '<tr>' +
                '<td>' + soluciones.producto.codigoBarras + '</td>' +
                '<td>' + soluciones.producto.nombre + '</td>' +
                '<td>' + soluciones.producto.marca + '</td>' +
                '<td>' + soluciones.producto.precioVenta + '</td>' +
                '<td><a href="#" onclick="moduloSoluciones.mostrarDetalle(' + soluciones.idSolucion + ')">Ver Detalle</a></td>' + '</tr>';
        cuerpo += registro;
    });
    document.getElementById("tblSoluciones").innerHTML = cuerpo;
}

export function save() {
    let datos = null;
    let params = null;

    let solucion = new Object();
    solucion.producto = new Object();

    if (document.getElementById("txtCodigoBarras").value.trim().length < 1) {
        solucion.idSolucion = 0;
        solucion.producto.idProducto = 0;
    } else {
        solucion.idSolucion = parseInt(document.getElementById("txtIdSolucion").value);
        solucion.producto.idProducto = parseInt(document.getElementById("txtIdProducto").value);
        solucion.producto.codigoBarras = document.getElementById("txtCodigoBarras").value;
    }

    solucion.producto.nombre = document.getElementById("txtNombre").value;
    solucion.producto.marca = document.getElementById("txtMarca").value;
    solucion.producto.precioCompra = document.getElementById("txtPrecioCompra").value;
    solucion.producto.precioVenta = document.getElementById("txtPrecioVenta").value;
    solucion.producto.existencias = document.getElementById("txtExistencias").value;

    datos = {
        datosSolucion: JSON.stringify(solucion),
        token: (JSON.parse( localStorage.getItem("CredencialOptica")).usuario.lastToken).toString()
    };

    params = new URLSearchParams(datos);

    if (validarFormulario() === false) {
        return;
    }

    fetch("api/solucion/save",
            {method: "POST",
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                body: params
            })
            .then(response => {
                return response.json();
            })
            .then(function (data)
            {
                if (data.exception != null) {
                    Swal.fire('', "Error interno del servidor. Intente nuevamente mas tarde.", 'error');
                    return;
                }

                if (data.error != null) {
                    Swal.fire('', data.error, 'warning');
                    return;
                }

                if (data.errorperm != null) {
                    Swal.fire('', "No tiene permiso para realizar esta operacion", 'warning');
                    return;
                }

                document.getElementById("txtIdProducto").value = data.producto.idProducto;
                document.getElementById("txtIdSolucion").value = data.idSolucion;
                document.getElementById("txtCodigoBarras").value = data.producto.codigoBarras;

                Swal.fire('', "Datos de la solución actualizados correctamente", 'success');
                refrescarTabla();
                document.getElementById("collapseOne").classList.remove("show");
                document.getElementById("divTbl").classList.remove("d-none");
                clean();
            });
}

export function mostrarDetalle(id) {
    soluciones.forEach(function (solucion)
    {
        if (id === solucion.idSolucion)
        {
            document.getElementById("txtNombre").value = solucion.producto.nombre;
            document.getElementById("txtMarca").value = solucion.producto.marca;
            document.getElementById("txtPrecioCompra").value = solucion.producto.precioCompra;
            document.getElementById("txtPrecioVenta").value = solucion.producto.precioVenta;
            document.getElementById("txtExistencias").value = solucion.producto.existencias;

            document.getElementById("txtIdProducto").value = solucion.producto.idProducto;
            document.getElementById("txtIdSolucion").value = solucion.idSolucion;
            document.getElementById("txtCodigoBarras").value = solucion.producto.codigoBarras;
        }
    });
    document.getElementById("collapseOne").classList.add("show");
    document.getElementById("btnDelete").classList.remove("disabled");
    document.getElementById("divTbl").classList.add("d-none");
}

export function clean() {
    document.getElementById("txtNombre").value = "";
    document.getElementById("txtMarca").value = "";
    document.getElementById("txtPrecioCompra").value = "";
    document.getElementById("txtPrecioVenta").value = "";
    document.getElementById("txtExistencias").value = "";


    document.getElementById("txtIdProducto").value = "";
    document.getElementById("txtIdSolucion").value = "";
    document.getElementById("txtCodigoBarras").value = "";

    document.getElementById("btnDelete").classList.add("disabled");
}


export function deleteSolucion() {
    let id = document.getElementById("txtIdProducto").value;
    let datos = {
        id: id,
        token: (JSON.parse( localStorage.getItem("CredencialOptica")).usuario.lastToken).toString()
    };
    let params = new URLSearchParams(datos);
    fetch("api/solucion/delete",
            {
                method: "POST",
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                body: params
            })
            .then(response => {
                return response
            })
            .then(function (data)
            {
                if (data.exception != null) {
                    Swal.fire('', "Error interno del servidor. Intente nuevamente mas tarde.", 'error');
                    return;
                }

                if (data.error != null) {
                    Swal.fire('', data.error, 'warning');
                    return;
                }

                if (data.errorperm != null) {
                    Swal.fire('', "No tiene permiso para realizar esta operacion", 'warning');
                    return;
                }

                Swal.fire('', "Solucion eliminada correctamente", 'success');
                refrescarTabla();
                document.getElementById("collapseOne").classList.remove("show");
                document.getElementById("divTbl").classList.remove("d-none");
                clean();
            });
}

//FUNCION PARA IMPRIMIR TABLA
export function imprimir(el) {
    var restorepage = document.body.innerHTML;
    var printcontent = document.getElementById(el).innerHTML;
    document.body.innerHTML = printcontent;
    window.print();
    document.body.innerHTML = restorepage;

}

document.getElementById("btnAccordion").addEventListener("click", ocultarTabla);

function ocultarTabla() {

    if (document.getElementById("divTbl").classList.contains("d-none")) {
        ocultar();
    } else {
        mostrar();
    }
}

function mostrar() {
    document.getElementById("divTbl").classList.add("d-none");
}
function ocultar() {
    document.getElementById("divTbl").classList.remove("d-none");
}

export function askDelete() {
    Swal.fire({
        title: '¿Deseas eliminar esta solución?',
        text: "Se marcará como inactivo",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                    deleteSolucion(),
                    'Soluición eliminada',
                    'Se ha marcado como inactivo',
                    'success'
                    );
        }
    });
}

export function soloLetras(e) {
    let key = e.keyCode || e.which;
    let tecla = String.fromCharCode(key).toString();
    let letras = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZÁÉÍÓÚabcdefghijklmnñopqrstuvwxyzáéíóú";

    let especiales = [8, 9, 32, 20, 15, 132, 133, 126, 241, 209];
    let tecla_especial = false;
    for (var i in especiales) {
        if (key === especiales[i]) {
            tecla_especial = true;
            break;
        }
    }

    if (letras.indexOf(tecla) === -1 && !tecla_especial) {
        Swal.fire('', "Solo debes ingresar letras.", 'warning');
        return false;
    }
}

export function soloNumeros(evt) {
    if (window.event) {
        keynum = evt.keyCode;
    } else {
        keynum = evt.which;
    }

    if ((keynum > 47 && keynum < 58) || keynum === 8 || keynum === 13 || keynum === 9) {
        return true;
    } else {
        Swal.fire('', "Solo debes ingresar números.", 'warning');
        return false;
    }
}

export function validarFormulario() {
    let bandera = false;

    if (document.getElementById("txtNombre").value === "") {
        document.getElementById("txtNombre").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Nombre'", 'warning');
        return bandera;
    }
    if (document.getElementById("txtMarca").value === "") {
        document.getElementById("txtMarca").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Marca'", 'warning');
        return bandera;
    }
    if (document.getElementById("txtExistencias").value === "") {
        document.getElementById("txtExistencias").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Existencias'", 'warning');
        return bandera;
    }
    if (document.getElementById("txtPrecioCompra").value === "") {
        document.getElementById("txtPrecioCompra").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Precio de compra'", 'warning');
        return bandera;
    }
    if (document.getElementById("txtPrecioVenta").value === "") {
        document.getElementById("txtPrecioVenta").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Precio de venta'", 'warning');
        return bandera;
    }

    let precioVenta = parseFloat(document.getElementById("txtPrecioVenta").value);
    let precioCompra = parseFloat(document.getElementById("txtPrecioCompra").value);
    if (precioCompra > precioVenta) {
        document.getElementById("txtPrecioVenta").focus();
        Swal.fire('', "El precio de venta no puede ser menor al precio de compra", 'warning');
        return bandera;
    }
    return;
}
