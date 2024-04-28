let clientes = [];
let keynum;

export function inicializar() {
    configureTableFilter(document.getElementById("txtBusquedaCliente"),
            document.getElementById("tblCli"));
    refrescarTabla();
}

export function refrescarTabla() {
    let filtro = document.getElementById("cmbFiltro").value;
    let token = (JSON.parse( localStorage.getItem("CredencialOptica")).usuario.lastToken).toString(); 
    let url = "api/cliente/getAll?filtro=" + filtro + "&token=" + token;
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
    clientes = data;

    clientes.forEach(function (cliente) {
        let registro =
                '<tr>' +
                '<td>' + cliente.numeroUnico + '</td>' +
                '<td>' + cliente.persona.nombre + '</td>' +
                '<td>' + cliente.persona.apellidoPaterno + ' ' + cliente.persona.apellidoMaterno + '</td>' +
                '<td>' + cliente.persona.telMovil + '</td>' +
                '<td><a href="#" onclick="moduloClientes.mostrarDetalle(' + cliente.idCliente + ')">Ver Detalle</a></td>' + '</tr>';
        cuerpo += registro;
    });
    document.getElementById("tblClientes").innerHTML = cuerpo;
}


//Guardar cliente
export function save() {
    let datos = null;
    let params = null;

    let clientes = new Object();
    clientes.persona = new Object();

    if (document.getElementById("txtNumUnico").value.trim().length < 1) {
        clientes.idCliente = 0;
        clientes.persona.idPersona = 0;
    } else {
        clientes.idCliente = parseInt(document.getElementById("txtCodigoCliente").value);
        clientes.persona.idPersona = parseInt(document.getElementById("txtCodigoPersona").value);
        clientes.numeroUnico = document.getElementById("txtNumUnico").value;
    }

    clientes.persona.nombre = document.getElementById("txtNombre").value;
    clientes.persona.apellidoPaterno = document.getElementById("txtApePaterno").value;
    clientes.persona.apellidoMaterno = document.getElementById("txtApeMaterno").value;
    clientes.persona.genero = document.getElementById("cmbGenero").value;
    clientes.persona.rfc = document.getElementById("txtRfc").value;
    clientes.persona.telCasa = document.getElementById("txtTelefono").value;
    clientes.persona.telMovil = document.getElementById("txtMovil").value;
    clientes.persona.calle = document.getElementById("txtCalle").value;
    clientes.persona.numero = document.getElementById("txtNumero").value;
    clientes.persona.colonia = document.getElementById("txtColonia").value;
    clientes.persona.cp = document.getElementById("txtCodigoPostal").value;
    clientes.persona.ciudad = document.getElementById("txtCiudad").value;
    clientes.persona.estado = document.getElementById("txtEstado").value;
    clientes.persona.email = document.getElementById("txtCorreo").value;
    clientes.persona.fechaNacimiento = document.getElementById("dpFechaNacimiento").value;

    datos = {
        datosCliente: JSON.stringify(clientes),
        token: (JSON.parse( localStorage.getItem("CredencialOptica")).usuario.lastToken).toString()
    };

    params = new URLSearchParams(datos);

    if (validarFormulario() === false) {
        return;
    }

    if (validarTelefono() === false) {
        return;
    }

    if (validarRfc() === false) {
        return;
    }

    fetch("api/cliente/save",
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


                document.getElementById("txtCodigoCliente").value = data.idCliente;
                document.getElementById("txtCodigoPersona").value = data.persona.idPersona;
                document.getElementById("txtNumUnico").value = data.numeroUnico;

                Swal.fire('', "Datos del empleado actualizados correctamente", 'success');
                refrescarTabla();
                document.getElementById("collapseOne").classList.remove("show");
                document.getElementById("divTbl").classList.remove("d-none");
                clean();
            });

}


//Seleccionar datos
export function mostrarDetalle(id) {
    clientes.forEach(function (cliente)
    {
        if (id === cliente.idCliente)
        {
            document.getElementById("txtNombre").value = cliente.persona.nombre;
            document.getElementById("txtApePaterno").value = cliente.persona.apellidoPaterno;
            document.getElementById("txtApeMaterno").value = cliente.persona.apellidoMaterno;
            document.getElementById("cmbGenero").value = cliente.persona.genero;
            document.getElementById("txtRfc").value = cliente.persona.rfc;
            document.getElementById("txtTelefono").value = cliente.persona.telCasa;
            document.getElementById("txtMovil").value = cliente.persona.telMovil;
            document.getElementById("txtCalle").value = cliente.persona.calle;
            document.getElementById("txtNumero").value = cliente.persona.numero;
            document.getElementById("txtColonia").value = cliente.persona.colonia;
            document.getElementById("txtCodigoPostal").value = cliente.persona.cp;
            document.getElementById("txtCiudad").value = cliente.persona.ciudad;
            document.getElementById("txtEstado").value = cliente.persona.estado;
            document.getElementById("txtCorreo").value = cliente.persona.email;
            document.getElementById("dpFechaNacimiento").value = cliente.persona.fechaNacimiento;
            document.getElementById("txtCodigoCliente").value = cliente.idCliente;
            document.getElementById("txtCodigoPersona").value = cliente.persona.idPersona;
            document.getElementById("txtNumUnico").value = cliente.numeroUnico;

        }
    });

    document.getElementById("btnDelete").classList.remove("disabled");
    document.getElementById("collapseOne").classList.add("show");
    document.getElementById("divTbl").classList.add("d-none");
}

export function clean() {
    document.getElementById("txtNombre").value = "";
    document.getElementById("txtApePaterno").value = "";
    document.getElementById("txtApeMaterno").value = "";
    document.getElementById("cmbGenero").value = "M";
    document.getElementById("txtRfc").value = "";
    document.getElementById("txtTelefono").value = "";
    document.getElementById("txtMovil").value = "";
    document.getElementById("txtCalle").value = "";
    document.getElementById("txtNumero").value = "";
    document.getElementById("txtColonia").value = "";
    document.getElementById("txtCodigoPostal").value = "";
    document.getElementById("txtCiudad").value = "";
    document.getElementById("txtEstado").value = "";
    document.getElementById("txtCorreo").value = "";
    document.getElementById("dpFechaNacimiento").value = "";
    document.getElementById("txtCodigoCliente").value = "";
    document.getElementById("txtCodigoPersona").value = "";
    document.getElementById("txtNumUnico").value = "";
    document.getElementById("btnDelete").classList.add("disabled");
}


//Eliminar
export function deleteCliente() {
    let id2 = document.getElementById("txtCodigoCliente").value;
    let datos = {
        id: id2,
        token: (JSON.parse( localStorage.getItem("CredencialOptica")).usuario.lastToken).toString()
    };
    let params = new URLSearchParams(datos);
    fetch("api/cliente/delete",
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

                Swal.fire('', "Cliente eliminado correctamente", 'success');
                refrescarTabla();
                document.getElementById("collapseOne").classList.remove("show");
                document.getElementById("divTbl").classList.remove("d-none");
                clean();
            });
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
        title: '¿Deseas eliminar este cliente?',
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
                    deleteCliente(),
                    'Cliente eliminado',
                    'Se ha marcado como inactivo',
                    'success'
                    );
        }
    });
}

export function imprimir(el) {

    var restorepage = document.body.innerHTML;
    var printcontent = document.getElementById(el).innerHTML;
    document.body.innerHTML = printcontent;
    window.print();
    document.body.innerHTML = restorepage;

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

export function soloEspeciales(evt) {
    if (window.event) {
        keynum = evt.keyCode;
    } else {
        keynum = evt.which;
    }

    if ((keynum > 47 && keynum < 58) || keynum === 8 || keynum === 13 || keynum >= 97 && keynum <= 103
            || keynum === 105 || keynum === 111 || keynum === 117 || keynum === 35 || keynum === 45 || keynum === 13) {
        return true;
    } else {
        Swal.fire('', "Solo puedes ingresar numeros y los digitos siguientes: 'a''b''c''d''e'f'g''i''o''u''#''-'", 'warning');
        return false;
    }
}

export function soloNumerosYLetras(evt) {
    if (window.event) {
        keynum = evt.keyCode;
    } else {
        keynum = evt.which;
    }

    if ((keynum > 47 && keynum < 58) || keynum === 20 || keynum === 32 || keynum === 9 || keynum === 8 || keynum === 13 || keynum > 64 && keynum < 91 || keynum > 96 && keynum < 123) {
        return true;
    } else {
        Swal.fire('', "Solo debes ingresar números y letras.", 'warning');
        return false;
    }
}

export function soloLetras(e) {
    let key = e.keyCode || e.which;
    let tecla = String.fromCharCode(key).toString();
    let letras = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZÁÉÍÓÚabcdefghijklmnñopqrstuvwxyzáéíóú";

    let especiales = [8, 9,13, 32, 20, 15, 132, 133, 126, 241, 209];
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

export function soloNumerosDiagonales(evt) {
    if (window.event) {
        keynum = evt.keyCode;
    } else {
        keynum = evt.which;
    }

    if ((keynum > 47 && keynum < 58) || keynum === 8 || keynum === 13 || keynum === 47 || keynum === 13) {
        return true;
    } else {
        Swal.fire('', "Solo debes ingresar números y diagonales.", 'warning');
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
    if (document.getElementById("txtApePaterno").value === "") {
        document.getElementById("txtApePaterno").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Apellido paterno'", 'warning');
        return bandera;
    }
    if (document.getElementById("cmbGenero").value === "") {
        document.getElementById("cmbGenero").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Genero'", 'warning');
        return bandera;
    }
    if (document.getElementById("dpFechaNacimiento").value === "") {
        document.getElementById("dpFechaNacimiento").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Fecha de nacimiento'", 'warning');
        return bandera;
    }
    if (document.getElementById("cmbGenero").value === "") {
        document.getElementById("cmbGenero").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Género'", 'warning');
    }
    if (document.getElementById("dpFechaNacimiento").value.length < 10) {
        document.getElementById("dpFechaNacimiento").focus();
        Swal.fire('', "Ingresa el formato correcto (dd/mm/aaaa) en el campo 'Fecha de nacimiento'", 'warning');
        return bandera;
    }

    if (document.getElementById("txtRfc").value === "") {
        document.getElementById("txtRfc").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'RFC'", 'warning');
        return bandera;
    }

    if (document.getElementById("txtCorreo").value === "") {
        document.getElementById("txtCorreo").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Correo'", 'warning');
        return bandera;
    }
    if (document.getElementById("txtCalle").value === "") {
        document.getElementById("txtCalle").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Calle'", 'warning');
        return bandera;
    }
    if (document.getElementById("txtNumero").value === "") {
        document.getElementById("txtNumero").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Número'", 'warning');
        return bandera;
    }
    if (document.getElementById("txtColonia").value === "") {
        document.getElementById("txtColonia").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Colonia'", 'warning');
        return bandera;
    }
    if (document.getElementById("txtCodigoPostal").value === "") {
        document.getElementById("txtCodigoPostal").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Códugo postal'", 'warning');
        return bandera;
    }
    if (document.getElementById("txtCodigoPostal").value.length < 5) {
        document.getElementById("txtCodigoPostal").focus();
        Swal.fire('', "Ingresa 5 digitos en el campo 'Código postal'", 'warning');
        return bandera;
    }
    if (document.getElementById("txtCiudad").value === "") {
        document.getElementById("txtCiudad").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Ciudad'", 'warning');
        return bandera;
    }
    if (document.getElementById("txtEstado").value === "") {
        document.getElementById("txtEstado").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Estado'", 'warning');
        return bandera;
    }
    return;
}

export function validarTelefono() {
    let bandera = false;

    if (document.getElementById("txtTelefono").value.length < 10 && document.getElementById("txtTelefono").value.length >= 1) {
        document.getElementById("txtTelefono").focus();
        Swal.fire('', "El teléfono fijo debe tener 10 dígitos.", 'warning');
        return bandera;
    }
    if (document.getElementById("txtMovil").value === "" || document.getElementById("txtMovil").value.length < 10) {
        document.getElementById("txtMovil").focus();
        Swal.fire('', "El teléfono móvil debe tener 10 dígitos.", 'warning');
        return bandera;
    }
    return;
}

export function validarRfc() {
    let bandera = false;

    if (document.getElementById("txtRfc").value.length < 12) {
        document.getElementById("txtRfc").focus();
        Swal.fire('', "El RFC debe tener 12 o 13 digitos según corresponda", 'warning');
        return bandera;
    }
    return;
}
