let apiToken = (JSON.parse( localStorage.getItem("CredencialOptica")).usuario.lastToken).toString(); 
let idEmpleado = (JSON.parse( localStorage.getItem("CredencialOptica")).idEmpleado).toString();

let productos = [];
let producto_selec = [];
let cantidadProductos = [];
let indexVenta = 0;
let cuerpoCarrito = "";
let keynum;

const formatoMoneda = {style: 'currency', currency: 'MXN'};

comprobarCache();

function comprobarCache() {
    const carrito = localStorage.getItem("carrito");
    const cantidad = localStorage.getItem("cantidad");
    if (carrito !== null) {
    } else {
        localStorage.setItem("carrito", "");
    }
    if (cantidad !== null) {
    } else {
        localStorage.setItem("cantidad", "");
    }
}

//Mostrar datos en la tabla
export function inicializar() {
    configureTableFilter(document.getElementById("txtBusqueda"),
            document.getElementById("tblProd"));
    refrescarTabla();
    document.getElementById("tabla").classList.add("d-none");

}

export function refrescarTabla() {
    let filtro = document.getElementById("cmbFiltro").value;
    let token = (JSON.parse(localStorage.getItem("CredencialOptica")).usuario.lastToken).toString();

    let url = "api/venta/getAll?filtro=" + filtro + "&token=" + token;
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
                cargarCatalogo();
                cargarCantidad();
                calcularPrecio();
            });
}

export function loadTable(data) {
    let cuerpo = "";
    productos = data;
    productos.forEach(function (producto) {
        let registro =
                '<tr>' +
                '<td><button class="btn btn-primary" onclick="moduloVentas.agregarCarrito(' + producto.idProducto + ')">Agregar producto</button></td>' +
                '<td>' + producto.codigoBarras + '</td>' +
                '<td>' + producto.nombre + '</td>' +
                '<td>' + producto.precioVenta.toLocaleString('es-MX', formatoMoneda) + '</td>' +
                '<td>' + producto.existencias + '</td>' +
                '</tr>';
        cuerpo += registro;
    });
    
    document.getElementById("tblProductos").innerHTML = cuerpo;
    document.getElementById("tabla").classList.remove("d-none");
}

//Metodo para agregar a la tabla de Carrito
export function agregarCarrito(index) {
    //Activamos el boton de venta
    document.getElementById('btnVenta').classList.remove("disabled");

    //Obtenemos el iTEM conforme nuestro indice
    let item = productos.find(item => item.idProducto === index);
    //Si el ITEM ya esta en el carrito
    if (producto_selec.includes(item)) {
        //Se lanza notificacion
        alert("Modifique la cantidad desde la tabla de carrito");
    } else {
        //Si no se agrega
        producto_selec.push(item);
        //Se carga la tabla
        cargarProducto(producto_selec);
        //Se guarda en el cache
        localStorage.setItem("carrito", JSON.stringify(producto_selec));
        cargarCantidad();
        calcularPrecio();
    }

}

export function descuentoProducto(index) {
    let item = productos.find(item => item.idProducto === index);
    let cantidad = document.getElementById('producto'+ index).value;
    let descuento = document.getElementById('descuentoProducto' + index);
    
    console.log(document.getElementById('producto'+ index).value);

    if (descuento.value > 100) {
        alert("No puede tener más del 100% de descuento");
        descuento.value = 0;
    }
    if (descuento.value < 0) {
        alert("Introduce un descuento valido");
        descuento.value = 0;
    }
}

//Funcion donde generamos la tabla de los productos seleccionados
export function cargarProducto(item) {
    
    document.getElementById("tabla").classList.add("d-none");
    
    let cuerpo = "";
    producto_selec = item;
    producto_selec.forEach(function (producto) {

        let registro =
                '<tr id="' + productos.indexOf(producto) + '">' +
                '<td>' + producto.nombre + '</td>' +
                '<td>' + producto.codigoBarras + '</td>' +
                '<td>' + producto.precioVenta.toLocaleString('es-MX', formatoMoneda) + '</td>' +
                '<td>' + "<input id='descuentoProducto" + producto.idProducto + "' style='width: 50%;' onChange='moduloVentas.descuentoProducto(" + producto.idProducto + "); moduloVentas.calcularPrecio()' type='number' style='width:50px;' min='0' value='0'>" + '</td>' +
                //'<td>' + "<input id='cantidad" + producto.idProducto + "' style='width: 50%;' onChange='moduloVentas.addCantidad(" + producto.idProducto + ");' type='number' style='width:50px;' min='0' value='1'>" + '</td></tr>';
                '<td>' + "<button class='btn btn-success' onclick=moduloVentas.addCantidad(" + producto.idProducto + ")>+</button> " + "<input id=producto" + producto.idProducto + " type='number' style='width:50px;' value='1' disabled>" + "<button onclick=moduloVentas.delCantidad(" + producto.idProducto + ") class='btn btn-danger'>-</button> " + '</td>' +
                '<td>' + "<button class='btn btn-outline-danger' onclick=moduloVentas.removeCart(" + producto.idProducto + ") > Eliminar </button>" + '</td></tr>';
        cuerpo += registro;
    });
    document.getElementById("tblProductosCarrito").innerHTML = cuerpo;
}

function cargarCantidad() {
    if (localStorage.getItem("cantidad") !== "") {
        //Obtenemos nuestra cantidad del CACHE
    let carritoCantidad = JSON.parse(localStorage.getItem("cantidad"));
    //Pasamos al arreglo de cantidadProducto lo que obtenemos
    cantidadProductos = carritoCantidad;
    //Hacemos un ciclo para todos los objetos de nuestro carrito
    for (let i = 0; i < cantidadProductos.length; i++) {
        document.getElementById("producto" + cantidadProductos[i].idProducto).value = cantidadProductos[i].cantidad;
    }
    calcularPrecio();
    }
    
}

//Metodo para eliminar cantidad del carrito
export function delCantidad(index) {
    //Obtenemos nuestro ITEM conforme el INDICE
    let item = productos.find(item => item.idProducto === index);
    //Obtenemos el valor de la cantidad de productos
    let cantidad = document.getElementById("producto" + index).value;

    //Si es mayor que uno
    if (1 < cantidad) {
        //se resta uno a la cantidad
        cantidad--;
        //Se actualiza en pantalla la cantidad
        document.getElementById("producto" + index).value = cantidad;

        //Obteneemos nuestro ITEM de nuestro INDICE
        let item = cantidadProductos.find(item => item.idProducto === index);

        //Si nuestro arreglo de cantidad ya tiene nuestro ITEM
        if (cantidadProductos.includes(item)) {
            //Hacemos un for
            for (let i = 0; i < cantidadProductos.length; i++) {
                //Si el IDProducfto ES IGUAL al indice
                if (cantidadProductos[i].idProducto === index) {
                    //Actualizamos la CANTIDAD de I en el PRODUCTO
                    cantidadProductos[i].cantidad = cantidad;
                    //terminamos el for
                    break;
                }
            }
        } else {
            //Si no está, lo agregamos
            cantidadProductos.push({idProducto: index, cantidad: cantidad});
        }
        //Guardamos en CACHE
        localStorage.setItem("cantidad", JSON.stringify(cantidadProductos));
        calcularPrecio();

    } else {
        //Si llegamos al menor que 1
        //Eliminamos del carrito
        removeCart(index);

        //Si nuestro arreglo ya tiene el ITEM
        if (cantidadProductos.includes(item)) {
            //Hacemos un for
            for (let i = 0; i < cantidadProductos.length; i++) {
                //Encontramos nuestro IDProducto igual al INDICE
                if (cantidadProductos[i].idProducto === index) {
                    //Actualizamos la cantidad
                    cantidadProductos[i].cantidad = 0;
                    //terminamos
                    break;
                }
            }
        }


        //Guardamos en cache
        localStorage.setItem(index, cantidad);
        calcularPrecio();
    }
}

//Metodo para agregar cantidad del carrito
export function addCantidad(index) {
    //Obtenemos nuestro ITEM conforme nuestro INDICE
    let item = productos.find(item => item.idProducto === index);
    //Obtenemos la cantidad de pantalla
    let cantidad = document.getElementById("producto" + index).value;
    //Si es menor que las existencias
    if (item.existencias > cantidad) {
        //Se suma una cantidad
        cantidad++;

        localStorage.setItem("cantidad", JSON.stringify(cantidadProductos));

        //Se actualiza en pantalla
        document.getElementById("producto" + index).value = cantidad;

        //Obtenemos nuestro item de nuestro INDICE
        let item = cantidadProductos.find(item => item.idProducto === index);

        //Si nuestro arreglo ya tiene el ITEM
        if (cantidadProductos.includes(item)) {
            //Hacemos un for
            for (let i = 0; i < cantidadProductos.length; i++) {
                //Encontramos nuestro IDProducto igual al INDICE
                if (cantidadProductos[i].idProducto === index) {
                    //Actualizamos la cantidad
                    cantidadProductos[i].cantidad = cantidad;
                    //terminamos
                    break;
                }
            }
        } else {
            //Si no, agregamos la cantidad
            cantidadProductos.push({idProducto: index, cantidad: cantidad});
        }
        //Guardamos en cache
        localStorage.setItem("cantidad", JSON.stringify(cantidadProductos));
    } else {
        //Si no, llegamos al limite y no hay mas productos
        alert("no hay mas produtos");
        //guardamos en cache el indice y cantidad
        localStorage.setItem(index, cantidad);

    }
    calcularPrecio();

}

export function calcularPrecio() {
    let idProductoCarrito, precioVenta, cantidad, idProductoCantidad = 0;
    let subTotal = 0;
    let descuento = 0;
    let cantidadTotal = 0;
    let descuentoProducto = 0;


// Inicializar variables antes de los ciclos


    for (var i = 0; i < producto_selec.length; i++) {
        for (var j = 0; j < cantidadProductos.length; j++) {
            if (producto_selec[i].idProducto === cantidadProductos[j].idProducto) {
                // Calcular subtotal del producto
                let precio = producto_selec[i].precioVenta;
                let cantidad = cantidadProductos[j].cantidad;
                let subTotalProducto = precio * cantidad;
                subTotal += subTotalProducto;

                // Calcular descuento del producto
                let descuentoPorcentaje = document.getElementById("descuentoProducto" + producto_selec[i].idProducto).value / 1;
                descuentoProducto += subTotalProducto * (descuentoPorcentaje / 100);

                cantidadTotal += cantidad;
            }
        }
    }

    let total = subTotal - descuentoProducto;

// Actualizar etiquetas HTML con los resultados
  

    document.getElementById('lblSubTotal').innerHTML = subTotal.toLocaleString('es-MX', formatoMoneda) + " MXN";
    document.getElementById('lblDescuento').innerHTML = descuentoProducto.toLocaleString('es-MX', formatoMoneda) + " MXN";
    document.getElementById('lblTotal').innerHTML = total.toLocaleString('es-MX', formatoMoneda) + " MXN";
    document.getElementById('lblCantidad').innerHTML = cantidadTotal;

}


export function removeCart(index) {
    //Obtenemos nuestro ITEM conforme al indice
    let item = productos.find(item => item.idProducto === index);
    let itemCantidad = cantidadProductos.find(item => item.idProducto === index);
    //Eliminamos de nuestro carrito el ITEM


    producto_selec.pop(item);
    cantidadProductos.pop(itemCantidad);
    //Guardamos en el localStorage
    localStorage.setItem("carrito", JSON.stringify(producto_selec));
    localStorage.setItem("cantidad", JSON.stringify(cantidadProductos));
    calcularPrecio();

    //Actualizamos la tabla
    cargarProducto(producto_selec);
    document.getElementById("tabla").classList.remove("d-none");
    cargarCantidad();

}

function cargarCatalogo() {
    if (localStorage.getItem("carrito") !== "") {
        //Obtenemos del Cache nuestro carrito
        let carritoCache = JSON.parse(localStorage.getItem("carrito"));

        //Lo pasamos al arreglo de carrito
        producto_selec = carritoCache;
        //Cargamos la tabla
        cargarProducto(producto_selec);
    }
}

//FUNCION PARA IMPRIMIR TABLA
export function imprimir(el) {
    var restorepage = document.body.innerHTML;
    var printcontent = document.getElementById(el).innerHTML;
    document.body.innerHTML = printcontent;
    window.print();
    document.body.innerHTML = restorepage;

}

export function soloMarcas(e) {
    let key = e.keyCode || e.which;
    let tecla = String.fromCharCode(key).toString();
    let letras = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZabcdefghijklmnñopqrstuvwxyz1234567890";

    let especiales = [8, 9, 32, 20, 15, 132, 133, 126, 241, 209, 128, 135, 164, 165];
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

export function soloLetras(e) {
    let key = e.keyCode || e.which;
    let tecla = String.fromCharCode(key).toString();
    let letras = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZabcdefghijklmnñopqrstuvwxyz";

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

function venta() {
    let datos = null;
    let params = null;

    let detallevp = new Object();
    detallevp.listaProductos = new Array();
    detallevp.venta = new Object();
    detallevp.venta.empleado = new Object();


    for (let i = 0; i < producto_selec.length; i++) {
        detallevp.venta.clave = generarClave();
        detallevp.venta.empleado.idEmpleado = idEmpleado;

        let producto = new Object();
        producto.producto = new Object();

        producto.producto.nombre = producto_selec[i].nombre;
        producto.producto.idProducto = producto_selec[i].idProducto;
        producto.cantidad = document.getElementById("producto" + producto_selec[i].idProducto).value;
        producto.precioUnitario = producto_selec[i].precioVenta;
        producto.descuento = document.getElementById("descuentoProducto" + producto_selec[i].idProducto).value;

        detallevp.listaProductos.push(producto);
    }
    //alert(apiToken + ", " + idEmpleado);
    datos = {
        datosVP: JSON.stringify(detallevp)
    };

    params = new URLSearchParams(datos);

    fetch("api/venta/crearVenta?&token=" + apiToken,
            {
                method: "POST",
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                body: params
            })
            .then(response => {
                return response.json();
            })
            .then(function (data) {
                if (data.exception != null) {
                    Swal.fire('', 'Error interno del servidor. Intente nuevamente más tarde.', 'error');
                    return;
                }
                if (data.error != null) {
                    Swal.fire('', data.error, 'warning');
                    return;
                }
                if (data.errorperm != null) {
                    Swal.fire('', 'No tiene permiso para realizar esta acción.', 'warning');
                    return;
                }
                //cargarModuloCatalogoVentas();
                localStorage.setItem("carrito", "");
                localStorage.setItem("cantidad", "");
                document.getElementById('lblSubTotal').innerHTML = "";
                refrescarTabla();
                cargarCatalogo();
            });
}

//Notificaciones dinamicas
export function ejecutarVenta() {
    if (producto_selec.length === 0) {
        notificacion("error", "No hay productos");
        document.getElementById('btnVenta').classList.add("disabled");
    } else {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons.fire({
            title: 'Confirmar venta',
            text: "Al aceptar confirmas que los datos ingresados están correctos.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: ' Cancelar',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                venta();
                refrescarTabla();
                cargarCatalogo();
                   
                swalWithBootstrapButtons.fire(
                        'Venta realizada!',
                        'Se realizó correctamente la venta.',
                        'success'
                        );
            } else if (
                    result.dismiss === Swal.DismissReason.cancel
                    ) {
                swalWithBootstrapButtons.fire(
                        'Cancelado',
                        'La venta se ha cancelado',
                        'error'
                        );
            }
        });
    }
}
    
function generarClave() {
    let clave = '';
    for (let i = 0; i < 69; i++) {
        const numeroAleatorio = Math.floor(Math.random() * 10);
        clave += numeroAleatorio.toString();
    }
    return clave;
}
