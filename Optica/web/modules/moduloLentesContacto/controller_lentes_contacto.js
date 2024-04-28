let lentesContacto = [];
let inputFileArmazon = null;
let fotoB64 = null;
let keynum;

//Mostrar datos en la tabla
export function inicializar() {
    inputFileArmazon = document.getElementById("inputFileImagenArmazon");
    inputFileArmazon.onchange = function (evt) {
        cargarFotografia(inputFileArmazon);
    };

    configureTableFilter(document.getElementById("txtBusquedaCompra"),
            document.getElementById("tblLC"));

    refrescarTabla();
}

export function refrescarTabla() {
    let filtro = document.getElementById("cmbFiltro").value;
    let token = (JSON.parse( localStorage.getItem("CredencialOptica")).usuario.lastToken).toString();
    let url = "api/lenteContacto/getAll?filtro=" + filtro + "&token=" + token;
    fetch(url)
            .then(response => {
                return response.json();
            })
            .then(function (data)
            {
                if (data.exception != null)
                {
                    swal.fire('', 'No se encontró un token o hay error interno.', 'Error');
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
    lentesContacto = data;
    lentesContacto.forEach(function (lentesContacto) {
        let registro =
                '<tr>' +
                '<td>' + lentesContacto.producto.codigoBarras + '</td>' +
                '<td>' + lentesContacto.producto.nombre + '</td>' +
                '<td>' + lentesContacto.producto.marca + '</td>' +
                '<td>' + lentesContacto.producto.precioVenta + '</td>' +
                '<td><a href="#" onclick="moduloLentesContacto.mostrarDetalle(' + lentesContacto.idLenteContacto + ')">Ver Detalle</a></td>' + '</tr>';
        cuerpo += registro;
    });
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
    lente.fotografia = fotoB64;

    datos = {
        datosLenteContacto: JSON.stringify(lente),
        token: (JSON.parse( localStorage.getItem("CredencialOptica")).usuario.lastToken).toString()
    };

    params = new URLSearchParams(datos);

    if (validarFormulario() === false) {
        return;
    }

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
                if (data.exception != null) {
                    Swal.fire('', "No se encontró un token o hay error interno.", 'error');
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

                Swal.fire('', "Datos del lente de contacto actualizados correctamente", 'success');
                refrescarTabla();
                document.getElementById("collapseOne").classList.remove("show");
                document.getElementById("divTbl").classList.remove("d-none");
                clean();
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
            document.getElementById("imgFoto").src = "data:image/" +
                    getImageFormat(fotoB64) + ";base64," + lenteContacto.fotografia;

            document.getElementById("txtIdProducto").value = lenteContacto.producto.idProducto;
            document.getElementById("txtIdLenteContacto").value = lenteContacto.idLenteContacto;
            document.getElementById("txtCodigoBarras").value = lenteContacto.producto.codigoBarras;
            //fotoB64 = lenteContacto.fotografia;
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

    document.getElementById("txtQuera").value = "";
    document.getElementById("inputFileImagenArmazon").value = "";

    document.getElementById("txtIdProducto").value = "";
    document.getElementById("txtIdLenteContacto").value = "";
    document.getElementById("txtCodigoBarras").value = "";
    document.getElementById("imgFoto").src = "resources/cargarFoto.png";
    fotoB64 = null;

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
                if (data.exception != null) {
                    Swal.fire('', "No se encontró un token o hay error interno.", 'error');
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

export function showInputDialog() {
    document.getElementById("inputFileImagenArmazon").click();
}

function cargarFotografia(objetoInputFile) {
    //Revisamos que el usuario haya seleccionado un archivo
    if (objetoInputFile.files && objetoInputFile.files[0]) {
        let reader = new FileReader();

        //Agregamos un oyente al lector del archivo para que,
        //en cuanto el usuario cargue una imagen, esta se lea
        //y se convierta de forma automatica en una cadena de Base64
        reader.onload = function (e) {
            fotoB64 = e.target.result;

            document.getElementById("imgFoto").src = fotoB64;
            fotoB64 = fotoB64.substring(fotoB64.indexOf(",") + 1, fotoB64.length);
        };

        //Leemos el archivo que seleccionó el usuario y lo
        //convertimos en una cadena con la Base64
        reader.readAsDataURL(objetoInputFile.files[0]);
    }
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
        title: '¿Deseas eliminar este lente?',
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
                    deleteLente(),
                    'Lente de contacto eliminado',
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

export function soloMarcas(e) {
    let key = e.keyCode || e.which;
    let tecla = String.fromCharCode(key).toString();
    let letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

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
    if (document.getElementById("txtExistencias").value === "") {
        document.getElementById("txtExistencias").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Existencias'", 'warning');
        return bandera;
    }
    if (document.getElementById("txtQuera").value === "") {
        document.getElementById("txtQuera").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Queratometria'", 'warning');
        return bandera;
    }
    if (fotoB64 === null) {
        Swal.fire('', "Asegúrate de cargar una foto.", 'warning');
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

export function getImageFormat(strb64) {
    let fc = strb64 != null && strb64.length > 0 ? strb64.subtr(0, 1) : "";

    switch (fc) {
        case "/" :
            return "jpeg";
        case "i" :
            return "png";
        case "Q" :
            return "bmp";
        case "S" :
            return "tiff";
        case "J" :
            return "pdf";
        case "U" :
            return "webp";
        case "R" :
            return "gif";
    }
}
