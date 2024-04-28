let empleados = [];
let keynum;

export function inicializar() {
    configureTableFilter(document.getElementById("txtBusquedaEmpleado"),
            document.getElementById("tblEmp"));

    refrescarTabla();
}

export function save() {
    let datos = null;
    let params = null;

    let empleado = new Object();
    empleado.usuario = new Object();
    empleado.persona = new Object();

    if (document.getElementById("txtNumUnico").value.trim().length < 1) {
        empleado.idEmpleado = 0;
        empleado.persona.idPersona = 0;
        empleado.usuario.idUsuario = 0;
    } else {
        empleado.idEmpleado = parseInt(document.getElementById("txtCodigoEmpleado").value);
        empleado.persona.idPersona = parseInt(document.getElementById("txtCodigoPersona").value);
        empleado.usuario.idUsuario = parseInt(document.getElementById("txtCodigoUsuario").value);
        empleado.numeroUnico = document.getElementById("txtNumUnico").value;
    }

    empleado.persona.nombre = document.getElementById("txtNombre").value;
    empleado.persona.apellidoPaterno = document.getElementById("txtApePaterno").value;
    empleado.persona.apellidoMaterno = document.getElementById("txtApeMaterno").value;
    empleado.persona.genero = document.getElementById("cmbGenero").value;
    empleado.persona.rfc = document.getElementById("txtRfc").value;
    empleado.persona.telCasa = document.getElementById("txtTelefono").value;
    empleado.persona.telMovil = document.getElementById("txtMovil").value;
    empleado.persona.calle = document.getElementById("txtCalle").value;
    empleado.persona.numero = document.getElementById("txtNumero").value;
    empleado.persona.colonia = document.getElementById("txtColonia").value;
    empleado.persona.cp = document.getElementById("txtCodigoPostal").value;
    empleado.persona.ciudad = document.getElementById("txtCiudad").value;
    empleado.persona.estado = document.getElementById("txtEstado").value;
    empleado.persona.email = document.getElementById("txtCorreo").value;
    empleado.persona.fechaNacimiento = document.getElementById("dpFechaNacimiento").value;

    empleado.usuario.nombre = document.getElementById("txtUsuario").value;
    empleado.usuario.contrasenia = document.getElementById("txtContrasenia").value;
    empleado.usuario.rol = document.getElementById("txtRol").value;

    if (validarFormulario() === false) {
        return;
    }

    if (validarTelefono() === false) {
        return;
    }

    if (validarRfc() === false) {
        return;
    }

    datos = {
        datosEmpleado: JSON.stringify(empleado),
        token: (JSON.parse( localStorage.getItem("CredencialOptica")).usuario.lastToken).toString()
    };

    params = new URLSearchParams(datos);


    fetch("api/empleado/save",
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

                document.getElementById("txtCodigoEmpleado").value = data.idEmpleado;
                document.getElementById("txtCodigoUsuario").value = data.usuario.idUsuario;
                document.getElementById("txtCodigoPersona").value = data.persona.idPersona;
                document.getElementById("txtNumUnico").value = data.numeroUnico;

                Swal.fire('', "Datos del empleado actualizados correctamente", 'success');
                refrescarTabla();
                document.getElementById("collapseOne").classList.remove("show");
                document.getElementById("divTbl").classList.remove("d-none");
                clean();
            });

}

export function refrescarTabla() {
    let filtro = document.getElementById("cmbFiltro").value;
    let token = (JSON.parse( localStorage.getItem("CredencialOptica")).usuario.lastToken).toString();
    let url = "api/empleado/getAll?filtro=" + filtro + "&token=" + token;
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
                loadTable1(data);
            });
}

//Seleccionar datos
export function mostrarDetalle(id) {
    empleados.forEach(function (empleado)
    {
        if (id === empleado.idEmpleado)
        {
            document.getElementById("txtNombre").value = empleado.persona.nombre;
            document.getElementById("txtApePaterno").value = empleado.persona.apellidoPaterno;
            document.getElementById("txtApeMaterno").value = empleado.persona.apellidoMaterno;
            document.getElementById("cmbGenero").value = empleado.persona.genero;
            document.getElementById("txtRfc").value = empleado.persona.rfc;
            document.getElementById("txtTelefono").value = empleado.persona.telCasa;
            document.getElementById("txtMovil").value = empleado.persona.telMovil;
            document.getElementById("txtCalle").value = empleado.persona.calle;
            document.getElementById("txtNumero").value = empleado.persona.numero;
            document.getElementById("txtColonia").value = empleado.persona.colonia;
            document.getElementById("txtCodigoPostal").value = empleado.persona.cp;
            document.getElementById("txtCiudad").value = empleado.persona.ciudad;
            document.getElementById("txtEstado").value = empleado.persona.estado;
            document.getElementById("txtCorreo").value = empleado.persona.email;
            document.getElementById("dpFechaNacimiento").value = empleado.persona.fechaNacimiento;
            document.getElementById("txtUsuario").value = empleado.usuario.nombre;
            document.getElementById("txtContrasenia").value = empleado.usuario.contrasenia;
            document.getElementById("txtRol").value = empleado.usuario.rol;
            document.getElementById("txtCodigoEmpleado").value = empleado.idEmpleado;
            document.getElementById("txtCodigoUsuario").value = empleado.usuario.idUsuario;
            document.getElementById("txtCodigoPersona").value = empleado.persona.idPersona;
            document.getElementById("txtNumUnico").value = empleado.numeroUnico;

        }
    });
    document.getElementById("collapseOne").classList.add("show");
    document.getElementById("btnDelete").classList.remove("disabled");
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
    document.getElementById("txtUsuario").value = "";
    document.getElementById("txtContrasenia").value = "";
    document.getElementById("txtCodigoEmpleado").value = "";
    document.getElementById("txtCodigoUsuario").value = "";
    document.getElementById("txtCodigoPersona").value = "";
    document.getElementById("txtNumUnico").value = "";
    document.getElementById("btnDelete").classList.add("disabled");
}
export function loadTable1(data) {
    let cuerpo = "";
    empleados = data;

    empleados.forEach(function (empleado) {
        let registro =
                '<tr>' +
                '<td>' + empleado.numeroUnico + '</td>' +
                '<td>' + empleado.persona.nombre + '</td>' +
                '<td>' + empleado.persona.apellidoPaterno + ' ' + empleado.persona.apellidoMaterno + '</td>' +
                '<td>' + empleado.persona.telMovil + '</td>' +
                '<td><a href="#" onclick="moduloEmpleado.mostrarDetalle(' + empleado.idEmpleado + ')">Ver Detalle</a></td>' + '</tr>';
        cuerpo += registro;
    });
    document.getElementById("tblEmpleados").innerHTML = cuerpo;
}

export function deleteEmpleado() {
    let id2 = document.getElementById("txtCodigoEmpleado").value;
    let datos = {
        id: id2
    };
    let params = new URLSearchParams(datos);
    fetch("api/empleado/delete",
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

                Swal.fire('', "Empleado eliminado correctamente", 'success');
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

export function imprimir(el) {
    var restorepage = document.body.innerHTML;
    var printcontent = document.getElementById(el).innerHTML;
    document.body.innerHTML = printcontent;
    window.print();
    document.body.innerHTML = restorepage;

}

export function askDelete() {
    Swal.fire({
        title: '¿Deseas eliminar este empleado?',
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
                    deleteEmpleado(),
                    'Empleado eliminado',
                    'Se ha marcado como inactivo',
                    'success'
                    );
        }
    });
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

    if ((keynum > 47 && keynum < 58) || keynum === 8 || keynum === 13 || keynum === 144 || (keynum >= 97 && keynum <= 103)
            || keynum === 105 || keynum === 111 || keynum === 117 || keynum === 35 || keynum === 45 || keynum === 9) {
        return true;
    } else {
        Swal.fire('', "Solo puedes ingresar numeros y los digitos siguientes: 'a','b','c','d','e','f','g','i','o','u','#','-'", 'warning');
        return false;
    }
}

export function soloNumerosYLetras(e) {
    if (window.event) {
        keynum = e.keyCode;
    } else {
        keynum = e.which;
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

    let especiales = [8, 9, 13, 32, 20, 15, 132, 133, 126, 241, 209];
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

    if ((keynum > 47 && keynum < 58) || keynum === 8 || keynum === 13 || keynum === 47 || keynum === 9
            || keynum === 15) {
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
    if (document.getElementById("cmbGenero").value === "") {
        document.getElementById("cmbGenero").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Género'", 'warning');
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
    if (document.getElementById("txtUsuario").value === "") {
        document.getElementById("txtUsuario").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Usuario'", 'warning');
        return bandera;
    }
    if (document.getElementById("txtContrasenia").value === "") {
        document.getElementById("txtContrasenia").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Contraseña'", 'warning');
        return bandera;
    }
    if (document.getElementById("txtRol").value === "") {
        document.getElementById("txtRol").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Rol'", 'warning');
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
