function comprobarLogin() {

    let usuario = document.getElementById("usuario").value;
    let password = document.getElementById("contrasenia").value;

    var hash = CryptoJS.MD5(password);
    
    let datos = null;
    let params = null;

    datos = {
        usuario: usuario,
        password: password
    };
    //alert(hash);
    params = new URLSearchParams(datos);

    fetch("api/login/obtenerUsuario",
            {method: "POST",
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                body: params
            }).then(response => {
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
                localStorage.setItem("CredencialOptica", JSON.stringify(data));
                window.location = "inicio.html";
            });

}

function cerrarSesion() {
    let datos = null;
    let params = null;
    
    datos = {
        usuario: (JSON.parse( localStorage.getItem("CredencialOptica")).usuario.nombre).toString(),
        password: (JSON.parse( localStorage.getItem("CredencialOptica")).usuario.contrasenia).toString()
    };
    params = new URLSearchParams(datos);

    fetch("api/login/out",
            {method: "POST",
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                body: params
            }).then(response => {
        return response.json();
    })
            .then(function (data)
            {
                //console.log(data);
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
                localStorage.removeItem("CredencialOptica");
            });

}
