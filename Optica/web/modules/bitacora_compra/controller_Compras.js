let indexCompraSeleccionada;
let compras = [];
let num=1;
fetch("modules/Bitacora_Compra/data_Compras.json")
        .then(function(response){
            return response.json();
        })
        .then(function(jsondata){
                compras = jsondata;
                console.log(compras);
                loadTabla();
            }            
        );
document.getElementById("txtNumUnico").value = "OQBC"+num;

export function imprimir(el) 
{
    loadTabla1();
    var restorepage= document.body.innerHTML;
    var printcontent = document.getElementById(el).innerHTML;
    document.body.innerHTML=printcontent;
    window.print();
    document.body.innerHTML=restorepage;
    document.getElementById("txtNumUnico").value = "OQ"+num;
    loadTabla();
}

export function addCompra(){
    let producto,
        fecha, fech,
        hora, mes,
        admi,
        precio,
        cantidad, cla;    
    cla = document.getElementById("txtNumUnico").value;
    producto = document.getElementById("txtProducto").value;
    fech = new Date();
        if((fech.getMonth()+1)<10)
        {
            mes="0"+(fech.getMonth()+1);
        }
        else
        {
            mes=fech.getMonth()+1;
        }
    fecha= fech.getDate()+"/"+mes+"/"+fech.getFullYear()+"";
    hora=fech.getHours()+":"+fech.getMinutes()+":"+fech.getSeconds()+"";
    admi = document.getElementById("txtAdmi").value;
    precio = document.getElementById("txtPrecom").value;
    cantidad = document.getElementById("txtCantidad").value;
    if(producto==='' || fecha==='' || admi==='' || hora==='' || cla==='' || precio=== '' || cantidad==='')
    {
        Swal.fire({
        title: '!Faltan datos!',
        text: 'Revisa bien tus datos',
        icon: 'error',
        confirmButtonText: 'ok:('  
        });
    }
    else
    {
    let compra = {};
    compra.claveUnica= cla;
    compra.producto= producto;
    compra.fecha= fecha;
    compra.hora= hora;
    compra.administrador= admi;
    compra.precio= precio;
    compra.cantidad= cantidad;
    compra.estatus= "Activo";
    
    compras.push(compra);
    clean();
    loadTabla();
    num=num+1;
    document.getElementById("txtNumUnico").value = "OQBC"+num;
    alertaAdd();
    }
}
function alertaAdd()
{
  Swal.fire({
  title: 'Completado con exito!',
  text: 'Se ha registrado una nueva compra',
  icon: 'succes',
  confirmButtonText: 'Cool'
});
}
export function cargartabla() {
    loadTabla();
}
export function loadTabla(){
    var combo = document.getElementById("esta");
    var esta = combo.options[combo.selectedIndex].text;
    if(esta=="Activo")
    {
        aclis();
    }
    else
    {
        Inaclis();
    }
}
function aclis()
{
    let cuerpo = "";
    let filtro = "Activo";
    let resultados = compras.filter(element => element.estatus === filtro);
    resultados.forEach(function (compra){
        let registro =  
                '<tr onclick="moduloCompra.selectCompra('+ compras.indexOf(compra) +');">'+
                '<td>' + compra.claveUnica + '</td>' +
                '<td>' + compra.producto + '</td>' +
                '<td>' + compra.fecha + '</td>' +
                '<td>' + compra.hora + '</td>' +
                '<td>' + compra.administrador + '</td>' +
                '<td>' + compra.precio + '</td>' +
                '<td>' + compra.cantidad + '</td>' +
                '<td>' + compra.estatus + '</td></tr>' ; 
        cuerpo += registro;
    });
    console.log(cuerpo);
    document.getElementById("tblCompras").innerHTML = cuerpo;
}

function Inaclis()
{
    let cuerpo = "";
    let filtro = "Inactivo";
    let resultados = compras.filter(element => element.estatus === filtro);
    resultados.forEach(function (compra){
        let registro =  
                '<tr onclick="moduloCompra.selectCompra('+ compras.indexOf(compra) +');">'+
                '<td>' + compra.claveUnica + '</td>' +
                '<td>' + compra.producto + '</td>' +
                '<td>' + compra.fecha + '</td>' +
                '<td>' + compra.hora + '</td>' +
                '<td>' + compra.administrador + '</td>' +
                '<td>' + compra.precio + '</td>' +
                '<td>' + compra.cantidad + '</td>' +
                '<td>' + compra.estatus + '</td></tr>' ; 
        cuerpo += registro;
    });
    console.log(cuerpo);
    document.getElementById("tblCompras").innerHTML = cuerpo;
}


export function selectCompra(index){
    document.getElementById("txtNumUnico").value = compras[index].claveUnica;
    document.getElementById("txtProducto").value = compras[index].producto;
//    document.getElementById("txtHora").value = compras[index].hora;
    document.getElementById("txtAdmi").value = compras[index].administrador;
    document.getElementById("txtPrecom").value = compras[index].precio;
    document.getElementById("txtCantidad").value = compras[index].cantidad;
//    document.getElementById("txtFecha").value = (date) (compras[index].fecha);
    indexCompraSeleccionada = index;
    document.getElementById("btnUpdate").classList.remove("disabled");
    document.getElementById("btnDelete").classList.remove("disabled");
    document.getElementById("btnAdd").classList.add("disabled");
}

export function clean(){
    document.getElementById("txtNumUnico").value = "";
    document.getElementById("txtProducto").value = "" ;
//    document.getElementById("txtFecha").value = "";
//    document.getElementById("txtHora").value = "";
    document.getElementById("txtAdmi").value = "";
    document.getElementById("txtPrecom").value = "";
    document.getElementById("txtCantidad").value = "";
    
    document.getElementById("txtProducto").focus();
    document.getElementById("btnUpdate").classList.add("disabled");
    document.getElementById("btnDelete").classList.add("disabled");
    document.getElementById("btnAdd").classList.remove("disabled");
    indexCompraSeleccionada = 0;
}

export function updateCompra(){
    let numero_unico, 
        producto,
        admi,
        prec,
        canti, fecha,hora;
    fecha=compras[indexCompraSeleccionada].fecha;
    hora=compras[indexCompraSeleccionada].hora;
    numero_unico = document.getElementById("txtNumUnico").value;
    producto = document.getElementById("txtProducto").value;
    admi = document.getElementById("txtAdmi").value;
    prec = document.getElementById("txtPrecom").value;
    canti = document.getElementById("txtCantidad").value;
    
    Swal.fire({
        title: '¿Quieres actualizar la compra seleccionada?',
        showCancelButton: true,
        showConfirmButton: true,
        CancelButtonText: 'Cancelar',
        ConfirmButtonText: 'Actualizar'
    }).then((result) =>{
        if(result.isConfirmed)
        {
            let compra = {};
            compra.claveUnica=numero_unico,
            compra.producto= producto;
            compra.administrador= admi;
            compra.precio= prec;
            compra.cantidad= canti;
            compra.fecha= fecha;
            compra.hora= hora;
            compra.estatus= compras[indexCompraSeleccionada].estatus;
            compras[indexCompraSeleccionada] = compra;
            clean();
            loadTabla();
            document.getElementById("txtNumUnico").value = "OQBC"+num;
        }
    }); 
    loadTabla();
}

export function deleteCompra(){
    Swal.fire({
        title: '¿Quieres eliminar la compra seleccionada?',
        showCancelButton: true,
        showConfirmButton: true,
        CancelButtonText: 'Cancelar',
        ConfirmButtonText: 'Eliminar'
    }).then((result) =>{
        if(result.isConfirmed)
        {
            compras[indexCompraSeleccionada].estatus = "Inactivo";
            clean();
            loadTabla();
            document.getElementById("txtNumUnico").value = "OQBC"+num;
        }
    }); 
}


export function searchCompra(){
    let filtro = document.getElementById("txtBusquedaCompra").value;
    let resultados = compras.filter(element => element.producto === filtro);
    let cuerpo = "";
    resultados.forEach(function (compra){
        let registro =  
                '<tr onclick="moduloCompra.selectCompra('+ compras.indexOf(compra) +');">'+
                '<td>' + compra.claveUnica + '</td>' +
                '<td>' + compra.producto + '</td>' +
                '<td>' + compra.fecha + '</td>' +
                '<td>' + compra.hora + '</td>' +
                '<td>' + compra.administrador + '</td>' +
                '<td>' + compra.precio + '</td>' +
                '<td>' + compra.cantidad + '</td>' +
                '<td>' + compra.estatus + '</td></tr>' ; 
        cuerpo += registro;
    });
    console.log(cuerpo);
    document.getElementById("tblCompras").innerHTML = cuerpo;
}

export function loadTabla1(){
    var combo = document.getElementById("esta");
    var esta = combo.options[combo.selectedIndex].text;
    if(esta=="Activo")
    {
        aclis1();
    }
    else
    {
        Inaclis1();
    }
}
function aclis1()
{
    let cuerpo = "";
    let a="";
    let filtro = "Activo";
    a='<tr><th>Clave unica</th>'+
                    '<th>Producto</th>'+
                    '<th>Fecha</th>'+
                    '<th>Hora</th>'+
                    '<th>Administrador</th>'+
                    '<th>Precio</th>'+
                    '<th>Cantidad</th>'+
                    '<th>Estatus</th></tr>';
    let resultados = compras.filter(element => element.estatus === filtro);
    resultados.forEach(function (compra){
        let registro =  
                '<tr onclick="moduloCompra.selectCompra('+ compras.indexOf(compra) +');">'+
                '<td>' + compra.claveUnica + '</td>' +
                '<td>' + compra.producto + '</td>' +
                '<td>' + compra.fecha + '</td>' +
                '<td>' + compra.hora + '</td>' +
                '<td>' + compra.administrador + '</td>' +
                '<td>' + compra.precio + '</td>' +
                '<td>' + compra.cantidad + '</td>' +
                '<td>' + compra.estatus + '</td></tr>' ; 
        cuerpo += registro;
    });
    console.log(cuerpo);
    document.getElementById("tb2").innerHTML = a;
    document.getElementById("tblCompras").innerHTML = cuerpo;
}
function Inaclis1()
{
    let cuerpo = "";
    let filtro = "Inactivo";
    a='<tr><th>Clave unica</th>'+
                    '<th>Producto</th>'+
                    '<th>Fecha</th>'+
                    '<th>Hora</th>'+
                    '<th>Administrador</th>'+
                    '<th>Precio</th>'+
                    '<th>Cantidad</th>'+
                    '<th>Estatus</th></tr>';
    let resultados = compras.filter(element => element.estatus === filtro);
    resultados.forEach(function (compra){
        let registro =  
                '<tr onclick="moduloCompra.selectCompra('+ compras.indexOf(compra) +');">'+
                '<td>' + compra.claveUnica + '</td>' +
                '<td>' + compra.producto + '</td>' +
                '<td>' + compra.fecha + '</td>' +
                '<td>' + compra.hora + '</td>' +
                '<td>' + compra.administrador + '</td>' +
                '<td>' + compra.precio + '</td>' +
                '<td>' + compra.cantidad + '</td>' +
                '<td>' + compra.estatus + '</td></tr>' ; 
        cuerpo += registro;
    });
    console.log(cuerpo);
    document.getElementById("tb2").innerHTML = a;
    document.getElementById("tblCompras").innerHTML = cuerpo;
}
