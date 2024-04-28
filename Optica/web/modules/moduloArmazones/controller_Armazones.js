let armazones = [];
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
            document.getElementById("tblArm"));
    refrescarTabla();
}

export function refrescarTabla() {
    let filtro = document.getElementById("cmbFiltro").value;
    let token = (JSON.parse( localStorage.getItem("CredencialOptica")).usuario.lastToken).toString(); 
    let url = "api/armazon/getAll?filtro=" + filtro + "&token=" + token;
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
    armazones = data;
    armazones.forEach(function (armazones) {
        let registro =
                '<tr>' +
                '<td>' + armazones.producto.codigoBarras + '</td>' +
                '<td>' + armazones.producto.nombre + '</td>' +
                '<td>' + armazones.producto.marca + '</td>' +
                '<td>' + armazones.modelo + '</td>' +
                '<td><a href="#" onclick="moduloArmazon.mostrarDetalle(' + armazones.idArmazon + ')">Ver Detalle</a></td>' + '</tr>';
        cuerpo += registro;
    });
    document.getElementById("tblArmazones").innerHTML = cuerpo;
}

//añadir o actualizar
export function save() {
    let datos = null;
    let params = null;

    let armazon = new Object();
    armazon.producto = new Object();

    if (document.getElementById("txtNumUnico").value.trim().length < 1) {
        armazon.idArmazon = 0;
        armazon.producto.idProducto = 0;
    } else {
        armazon.idArmazon = parseInt(document.getElementById("txtIdArmazon").value);
        armazon.producto.idProducto = parseInt(document.getElementById("txtIdProducto").value);
        armazon.producto.codigoBarras = document.getElementById("txtNumUnico").value;
    }

    armazon.producto.nombre = document.getElementById("txtNombre").value;
    armazon.producto.marca = document.getElementById("txtMarca").value;
    armazon.producto.precioCompra = document.getElementById("txtPreCom").value;
    armazon.producto.precioVenta = document.getElementById("txtPreV").value;
    armazon.producto.existencias = document.getElementById("txtExis").value;

    armazon.modelo = document.getElementById("txtModelo").value;
    armazon.color = document.getElementById("txtColor").value;
    armazon.dimensiones = document.getElementById("txtDim").value;
    armazon.descripcion = document.getElementById("txtDes").value;
    armazon.fotografia = fotoB64;

    datos = {
        datosArmazon: JSON.stringify(armazon),
        token: (JSON.parse( localStorage.getItem("CredencialOptica")).usuario.lastToken).toString()
    };

    params = new URLSearchParams(datos);

    if (validarFormulario() === false) {
        return;
    }

    fetch("api/armazon/save",
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
                document.getElementById("txtIdArmazon").value = data.idArmazon;
                document.getElementById("txtNumUnico").value = data.producto.codigoBarras;

                Swal.fire('', "Datos del armazón actualizados correctamente", 'success');
                refrescarTabla();
                document.getElementById("collapseOne").classList.remove("show");
                document.getElementById("divTbl").classList.remove("d-none");
                clean();
            });

}

//Seleccionar datos
export function mostrarDetalle(id) {
    armazones.forEach(function (armazon)
    {
        if (id === armazon.idArmazon)
        {
            document.getElementById("txtNombre").value = armazon.producto.nombre;
            document.getElementById("txtMarca").value = armazon.producto.marca;
            document.getElementById("txtPreCom").value = armazon.producto.precioCompra;
            document.getElementById("txtPreV").value = armazon.producto.precioVenta;
            document.getElementById("txtExis").value = armazon.producto.existencias;

            document.getElementById("txtModelo").value = armazon.modelo;
            document.getElementById("txtColor").value = armazon.color;
            document.getElementById("txtDim").value = armazon.dimensiones;
            document.getElementById("txtDes").value = armazon.descripcion;
            document.getElementById("imgFoto").src = "data:image/" +
                    getImageFormat(fotoB64) + ";base64," + armazon.fotografia;

            document.getElementById("txtIdProducto").value = armazon.producto.idProducto;
            document.getElementById("txtIdArmazon").value = armazon.idArmazon;
            document.getElementById("txtNumUnico").value = armazon.producto.codigoBarras;
            //fotoB64 = armazon.fotografia;
            //console.log(fotoB64);
        }
    });
    document.getElementById("collapseOne").classList.add("show");
    document.getElementById("btnDelete").classList.remove("disabled");
    document.getElementById("divTbl").classList.add("d-none");
}

export function clean() {
    document.getElementById("txtNombre").value = "";
    document.getElementById("txtMarca").value = "";
    document.getElementById("txtPreCom").value = "";
    document.getElementById("txtPreV").value = "";
    document.getElementById("txtExis").value = "";

    document.getElementById("txtModelo").value = "";
    document.getElementById("txtColor").value = "";
    document.getElementById("txtDim").value = "";
    document.getElementById("txtDes").value = "";
    document.getElementById("inputFileImagenArmazon").value = "";

    document.getElementById("txtIdProducto").value = "";
    document.getElementById("txtIdArmazon").value = "";
    document.getElementById("txtNumUnico").value = "";
    document.getElementById("imgFoto").src = "resources/cargarFoto.png";
    fotoB64 = null;

    document.getElementById("btnDelete").classList.add("disabled");
}

//Eliminar
export function deleteArma() {
    let id = document.getElementById("txtIdProducto").value;
    let datos = {
        id: id,
        token: (JSON.parse( localStorage.getItem("CredencialOptica")).usuario.lastToken).toString()
    };
    let params = new URLSearchParams(datos);
    fetch("api/armazon/delete",
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

                Swal.fire('', "Armazón eliminado correctamente", 'success');
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
            //document.getElementById("txtBase64").value = fotoB64.substring(fotoB64.indexOf(",") + 1, fotoB64.length);
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
        title: '¿Deseas eliminar este armazón?',
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
                    deleteArma(),
                    'Armazón eliminado',
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

export function soloDimensiones(evt) {
    if (window.event) {
        keynum = evt.keyCode;
    } else {
        keynum = evt.which;
    }

    if ((keynum > 47 && keynum < 58) || keynum === 8 || keynum === 13 || keynum === 120 || keynum === 88
            || keynum === 32 || keynum === 9) {
        return true;
    } else {
        Swal.fire('', "Solo debes ingresar numeros y la letra 'x' mayúscula o minúscula.", 'warning');
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

    if (document.getElementById("txtModelo").value === "") {
        document.getElementById("txtModelo").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Modelo'", 'warning');
        return bandera;
    }

    if (document.getElementById("txtColor").value === "") {
        document.getElementById("txtColor").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Color'", 'warning');
        return bandera;
    }

    if (document.getElementById("txtDes").value === "") {
        document.getElementById("txtDes").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Descripción'", 'warning');
        return bandera;
    }

    if (document.getElementById("txtDim").value === "") {
        document.getElementById("txtDim").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Dimensiones'", 'warning');
        return bandera;
    }

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
    if (document.getElementById("txtExis").value === "") {
        document.getElementById("txtExis").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Existencias'", 'warning');
        return bandera;
    }
    if (document.getElementById("txtPreCom").value === "") {
        document.getElementById("txtPreCom").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Precio de compra'", 'warning');
        return bandera;
    }
    if (document.getElementById("txtPreV").value === "") {
        document.getElementById("txtPreV").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Precio de venta'", 'warning');
        return bandera;
    }

    let precioVenta = parseFloat(document.getElementById("txtPreV").value);
    let precioCompra = parseFloat(document.getElementById("txtPreCom").value);
    if (precioCompra > precioVenta) {
        document.getElementById("txtPreV").focus();
        Swal.fire('', "El precio de venta no puede ser menor al precio de compra", 'warning');
        return bandera;
    }
    if (fotoB64 === null) {
        Swal.fire('', "Asegúrate de cargar una foto.", 'warning');
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

