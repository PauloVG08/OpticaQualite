let indexGraduacionSeleccionada;
let clientes = [];
let examenesV = [];

export function inicializar()
{
    buscarClientes();
    refrescarTabla();
}

export function buscarClientes()
{
    let token = (JSON.parse( localStorage.getItem("CredencialOptica")).usuario.lastToken).toString(); 
    let url = "api/cliente/getAll?filtro=" + 1 + "&token=" + token;
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
                
                llenarDropdownCliente(data);
            });
}

export function llenarDropdownCliente(data)
{
    var dropdown = document.getElementById("dropdownClave");
    let clientes = data;
    clientes.forEach(function (cliente) {
        var option = document.createElement("option");
        option.value = cliente.idCliente;
        option.text = cliente.persona.nombre + " " + cliente.persona.apellidoPaterno + ' ' + cliente.persona.apellidoMaterno;
        dropdown.add(option);
    });
}

//Guardar cliente
export function save() {
    let datos = null;
    let params = null;

    let examendelavista = new Object();
    examendelavista.cliente = new Object();
    examendelavista.empleado = new Object();
    examendelavista.graduacion = new Object();

    examendelavista.cliente.idCliente = document.getElementById("dropdownClave").value;
    
    examendelavista.empleado = JSON.parse( localStorage.getItem("CredencialOptica"));

    examendelavista.graduacion.esferaod = document.getElementById("txtEsferaD").value;
    examendelavista.graduacion.esferaoi = document.getElementById("txtEsferaI").value;
    examendelavista.graduacion.cilindrood = document.getElementById("txtCilindroD").value;
    examendelavista.graduacion.cilindrooi = document.getElementById("txtCilindroI").value;
    examendelavista.graduacion.ejeoi = document.getElementById("txtEjeI").value;
    examendelavista.graduacion.ejeod = document.getElementById("txtEjeD").value;
    examendelavista.graduacion.dip = document.getElementById("txtDistanciaInter").value;

    datos = {
        datosEV: JSON.stringify(examendelavista),
        token: (JSON.parse( localStorage.getItem("CredencialOptica")).usuario.lastToken).toString()
    };

    params = new URLSearchParams(datos);

    if (validarFormulario() === false) {
        return;
    }


    fetch("api/examenVista/save",
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

                Swal.fire('', "Datos del empleado actualizados correctamente", 'success');
                //refrescarTabla();
                limpiarExamen();
                alert("data de save: " );
                alert(JSON.stringify(data));
                refrescarTabla();
            });
            
}

export function refrescarTabla() {
    let token = (JSON.parse( localStorage.getItem("CredencialOptica")).usuario.lastToken).toString(); 
    let url = "api/examenVista/getAll?token=" + token;
    fetch(url)
            .then(response => {
                return response.json();
        alert(response.json());
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
                    
                    return;
                }
                loadTable(data);
            });
}

export function loadTable(data) {
    let cuerpo = "";
    examenesV = data;
    examenesV.forEach(function (ev) {
        let registro =
                '<tr>' +
                '<td>' + ev.cliente.numeroUnico + '</td>' +
                '<td>' + ev.fecha + '</td>' +
                '<td><a href="#" onclick="moduloExamenVista.mostrarDetalle(' + ev.idExamenVista + ')">Ver Detalle</a></td>' + '</tr>';
        cuerpo += registro;
    });
    document.getElementById("tblExamenVista").innerHTML = cuerpo;
}

export function mostrarDetalle(id) {
    examenesV.forEach(function (ev)
    {
        if (id === ev.idExamenVista)
        {
            document.getElementById("dropdownClave").value = ev.cliente.idCliente;
            
            document.getElementById("txtEsferaD").value = ev.graduacion.esferaod;
            document.getElementById("txtEsferaI").value = ev.graduacion.esferaoi;
            document.getElementById("txtCilindroD").value = ev.graduacion.cilindrood;
            document.getElementById("txtCilindroI").value = ev.graduacion.cilindrooi;
            document.getElementById("txtEjeI").value = ev.graduacion.ejeoi;
            document.getElementById("txtEjeD").value = ev.graduacion.ejeod;
            document.getElementById("txtDistanciaInter").value = ev.graduacion.dip;

        }
    });

    document.getElementById("btnDelete").classList.remove("disabled");
}

export function validarFormulario() {
    let bandera = false;

    if (document.getElementById("txtEsferaD").value === "") {
        document.getElementById("txtEsferaD").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Esfera OD'", 'warning');
        return bandera;
    }
    if (document.getElementById("txtEsferaI").value === "") {
        document.getElementById("txtEsferaI").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Esfera OI'", 'warning');
        return bandera;
    }
    if (document.getElementById("txtCilindroD").value === "") {
        document.getElementById("txtCilindroD").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Cilindro D'", 'warning');
        return bandera;
    }
    if (document.getElementById("txtCilindroI").value === "") {
        document.getElementById("txtCilindroI").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Cilindro I'", 'warning');
        return bandera;
    }
    if (document.getElementById("txtEjeI").value === "") {
        document.getElementById("txtEjeI").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Eje I'", 'warning');
        return bandera;
    }
    if (document.getElementById("txtEjeD").value === "") {
        document.getElementById("txtEjeD").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Eje D'", 'warning');
        return bandera;
    }
    if (document.getElementById("txtDistanciaInter").value === "") {
        document.getElementById("txtDistanciaInter").focus();
        Swal.fire('', "Asegúrate de llenar el campo 'Distancia Inter'", 'warning');
        return bandera;
    }
    return;
}

export function limpiarExamen(){
    document.getElementById("dropdownClave").value="-1";
    document.getElementById("txtEsferaD").value="";
    document.getElementById("txtEsferaI").value="";
    document.getElementById("txtDistanciaInter").value="";
    document.getElementById("txtCilindroD").value="";
    document.getElementById("txtCilindroI").value="";
    document.getElementById("txtEjeD").value="";
    document.getElementById("txtEjeI").value="";
}
export function imprimir(el) 
{
    var restorepage= document.body.innerHTML;
    var printcontent = document.getElementById(el).innerHTML;
    document.body.innerHTML=printcontent;
    window.print();
    document.body.innerHTML=restorepage;
}
