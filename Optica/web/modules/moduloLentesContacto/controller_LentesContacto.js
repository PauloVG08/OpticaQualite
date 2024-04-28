let lentesContacto = [];

//Mostrar datos en la tabla
export function inicializar() {
    configureTableFilter(document.getElementById("txtBusquedaCompra"),
                         document.getElementById("tblLC"));
    
    refrescarTabla();
}

export function refrescarTabla() {
    let url = "api/lenteContacto/getAll";
    fetch(url)
            .then(response => {
                return response.json();
            })
            .then(function (data)
            {
                if (data.exception != null)
                {
                    swal.fire('', 'Error interno del servidor. Intente nuevamente más tarde.', 'Error');
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
        console.log(data);
            });
}

export function loadTable(data) {
    let cuerpo = "";
    lentesContacto = data;
    lentesContacto.forEach(function (lentesContacto) {
        let registro =
                '<tr>' +
                '<td>' + lentesContacto.producto.codigoBarras + '</td>' +
                '<td>' + lentesContacto.producto.nombre + '</td>' +
                '<td>' + lentesContacto.producto.marca + '</td>' +
                '<td>' + lentesContacto.producto.precioVenta + '</td>' +
                '<td>' + lentesContacto.queratometria + '</td>' +
                '<td>' + lentesContacto.producto.estatus + '</td>' +
                '<td><a href="#" onclick="moduloLentesContacto.mostrarDetalle(' + lentesContacto.idLenteContacto + ')">Ver Detalle</a></td>' + '</tr>';
        cuerpo += registro;
    });
    console.log(cuerpo);
    document.getElementById("tblLentesContacto").innerHTML = cuerpo;
}


export function save() {
    let datos = null;
    let params = null;

    let lente = new Object();
    lente.producto = new Object();

    if (document.getElementById("txtCodigoBarras").value.trim().length < 1) {
        lente.idLenteContacto = 0;
        lente.producto.idProducto = 0;
    } else {
        lente.idLenteContacto = parseInt(document.getElementById("txtIdLenteContacto").value);
        lente.producto.idProducto = parseInt(document.getElementById("txtIdProducto").value);
        lente.producto.codigoBarras = document.getElementById("txtCodigoBarras").value;
    }

    lente.producto.nombre = document.getElementById("txtNombre").value;
    lente.producto.marca = document.getElementById("txtMarca").value;
    lente.producto.precioCompra = document.getElementById("txtPrecioCompra").value;
    lente.producto.precioVenta = document.getElementById("txtPrecioVenta").value;
    lente.producto.existencias = document.getElementById("txtExistencias").value;

    lente.queratometria = document.getElementById("txtQuera").value;
    lente.fotografia = document.getElementById("txtFoto").value;

    datos = {
        datosLenteContacto: JSON.stringify(lente)
    };

    params = new URLSearchParams(datos);

    fetch("api/lenteContacto/save",
            {method: "POST",
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                body: params
            })
            .then(response => {
                return response.json();
            })
            .then(function (data)
            {
                console.log(data);
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
                document.getElementById("txtIdLenteContacto").value = data.idLenteContacto;
                document.getElementById("txtCodigoBarras").value = data.producto.codigoBarras;

                Swal.fire('', "Datos del lente de contacto actualizados correctamente", 'succes');
                refrescarTabla();
                document.getElementById("collapseOne").classList.remove("show");
            });

}

export function mostrarDetalle(id) {
    lentesContacto.forEach(function (lenteContacto)
    {
        if (id === lenteContacto.idLenteContacto)
        {
            document.getElementById("txtNombre").value = lenteContacto.producto.nombre;
            document.getElementById("txtMarca").value = lenteContacto.producto.marca;
            document.getElementById("txtPrecioCompra").value = lenteContacto.producto.precioCompra;
            document.getElementById("txtPrecioVenta").value = lenteContacto.producto.precioVenta;
            document.getElementById("txtExistencias").value = lenteContacto.producto.existencias;
            
            document.getElementById("txtQuera").value = lenteContacto.queratometria;
            document.getElementById("txtFoto").value = lenteContacto.fotografia;

            document.getElementById("txtIdProducto").value = lenteContacto.producto.idProducto;
            document.getElementById("txtIdLenteContacto").value = lenteContacto.idLenteContacto;
            document.getElementById("txtCodigoBarras").value = lenteContacto.producto.codigoBarras;
        }
    });

    document.getElementById("collapseOne").classList.add("show");
    document.getElementById("btnDelete").classList.remove("disabled");
}

export function clean() {
            document.getElementById("txtNombre").value = "";
            document.getElementById("txtMarca").value = "";
            document.getElementById("txtPrecioCompra").value = "";
            document.getElementById("txtPrecioVenta").value = "";
            document.getElementById("txtExistencias").value = "";

            document.getElementById("txtQuera").value = "";
            document.getElementById("txtFoto").value = "";

            document.getElementById("txtIdProducto").value = "";
            document.getElementById("txtIdLenteContacto").value = "";
            document.getElementById("txtCodigoBarras").value = "";
            
            document.getElementById("btnDelete").classList.add("disabled");
}

export function deleteLente() {
    let id = document.getElementById("txtIdProducto").value;
    let datos = {
        id: id
    };
    let params = new URLSearchParams(datos);
    fetch("api/lenteContacto/delete",
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
                console.log(data);
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

                Swal.fire('', "Lente de contacto eliminado correctamente", 'success');
                refrescarTabla();
                document.getElementById("collapseOne").classList.remove("show");
                clean();
            });
}

//FUNCION PARA IMPRIMIR TABLA
export function imprimir(el){
    var restorepage = document.body.innerHTML;
    var printcontent = document.getElementById(el).innerHTML;
    document.body.innerHTML = printcontent;
    window.print();
    document.body.innerHTML = restorepage;
    
}

function esconderTabla(){
    document.getElementById("tabla").style.display = "none";
}