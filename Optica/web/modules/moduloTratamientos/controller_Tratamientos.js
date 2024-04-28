let indexTratamientoSeleccionado;
let tratamientos = [];

fetch("modules/moduloTratamientos/data_Tratamientos.json")
        .then(function(response){
            return response.json();
        })
        .then(function(jsondata){
                tratamientos = jsondata;
                console.log(tratamientos);
                loadTabla1();
            }            
        );

// FUNCION PARA AGREGAR TRATAMIENTO
export function addTratamiento(){
    let nombre,
        precioC,
        precioV,
        cantidad;

    nombre = document.getElementById("txtNombre").value;
    precioC = document.getElementById("txtPrecioC").value;
    precioV = document.getElementById("txtPrecioV").value;
    cantidad = document.getElementById("txtCantidad").value;

    if (nombre=='' ||  precioC=='' || precioV =='' || cantidad==''){
        alertaVacio();
    } else {
    
    let tratamiento = {};
    
    tratamiento.nombre = nombre;
    tratamiento.precioC = precioC;
    tratamiento.precioV = precioV;
    tratamiento.cantidad = cantidad;
    tratamiento.estatus = "Activo";
    tratamientos.push(tratamiento);
    clean();
    loadTabla1();
    alertaAdd();
    }
}    


export function loadTabla1(){
    var combo = document.getElementById("estado");
    var estatus = combo.options[combo.selectedIndex].text;
    if(estatus == "Activo"){
        activos();
    }else{
        inactivos();
    }
    
}


//FUNCION PARA TABLA DE INACTIVOS
function inactivos(){

    let cuerpo = "";
    let filtro = "Inactivo";
    let resultados = tratamientos.filter(element => element.estatus === filtro);
    resultados.forEach(function (tratamiento){
        let registro =  
                '<tr onclick="moduloTratamiento.selectTratamiento('+ tratamientos.indexOf(tratamiento) +');">'+
                '<td>' + tratamiento.nombre + '</td>' +
                '<td>' + tratamiento.precioC +'</td>' +
                '<td>' + tratamiento.precioV + '</td>' +
                '<td>' + tratamiento.cantidad + '</td>' +
                '<td>' + tratamiento.estatus + '</td></tr>' ; 
        cuerpo += registro;
    });
    console.log(cuerpo);
    document.getElementById("tblTratamientos").innerHTML = cuerpo;
}


//FUNCION PARA TABLA DE ACTIVOS
function activos(){

    let cuerpo = "";
    let filtro = "Activo";
    let resultados = tratamientos.filter(element => element.estatus === filtro);
    resultados.forEach(function (tratamiento){
        let registro =  
                '<tr onclick="moduloTratamiento.selectTratamiento('+ tratamientos.indexOf(tratamiento) +');">'+
                '<td>' + tratamiento.nombre + '</td>' +
                '<td>' + tratamiento.precioC +'</td>' +
                '<td>' + tratamiento.precioV + '</td>' +
                '<td>' + tratamiento.cantidad + '</td>' +
                '<td>' + tratamiento.estatus + '</td></tr>' ; 
        cuerpo += registro;
    });
    console.log(cuerpo);
    document.getElementById("tblTratamientos").innerHTML = cuerpo;
}


//FUNCION PARA SELECCIONAR UN TRATAMIENTO 
export function selectTratamiento(index){
    document.getElementById("txtNombre").value = tratamientos[index].nombre ;
    document.getElementById("txtPrecioC").value = tratamientos[index].precioC;
    document.getElementById("txtPrecioV").value = tratamientos[index].precioV;
    document.getElementById("txtCantidad").value = tratamientos[index].cantidad;
    
    document.getElementById("btnUpdate").classList.remove("disabled");
    document.getElementById("btnDelete").classList.remove("disabled");
    document.getElementById("btnAdd").classList.add("disabled");
    indexTratamientoSeleccionado = index;
}


//FUNCION PARA LIMPIAR EL FORMULARIO 
export function clean(){
    document.getElementById("txtNombre").value = "" ;
    document.getElementById("txtPrecioC").value = "";
    document.getElementById("txtPrecioV").value = "";
    document.getElementById("txtCantidad").value = "";
    
    document.getElementById("txtNombre").focus();
    document.getElementById("btnUpdate").classList.add("disabled");
    document.getElementById("btnDelete").classList.add("disabled");
    document.getElementById("btnAdd").classList.remove("disabled");
    indexTratamientoSeleccionado = 0;
}

//FUNCION PARA ACTUALIZAR UN TRATAMIENTO
export function updateTratamiento(){
    let nombre,
        precioC,
        precioV,
        cantidad;
        

    nombre = document.getElementById("txtNombre").value;
    precioC = document.getElementById("txtPrecioC").value;
    precioV = document.getElementById("txtPrecioV").value;
    cantidad = document.getElementById("txtCantidad").value;

    Swal.fire({
        title: '¿Esta seguro de actualizar el tratamiento seleccionado?',
        showCancelButton: true,
        showConfirmButton: true,
        CancelButtonText: 'Cancelar',
        ConfirmButtonText: 'Actualizar'
    }).then((result) =>{
        if(result.isConfirmed){
    
            let tratamiento= {};
            
            tratamiento.nombre = nombre;
            tratamiento.precioC = precioC;
            tratamiento.precioV = precioV;
            tratamiento.cantidad = cantidad;
            tratamiento.estatus = "Activo";
            tratamientos[indexTratamientoSeleccionado] = tratamiento;
            clean();
            loadTabla1();
            alertaActualizar();
        }
    });
}

//FUNCION PARA BORRAR UN TRATAMIENTO
export function deleteTratamiento(){
    Swal.fire({
        title: '¿Esta seguro de eliminar el tratamiento seleccionado?',
        showCancelButton: true,
        showConfirmButton: true,
        CancelButtonText: 'Cancelar',
        ConfirmButtonText: 'Eliminar'
    }).then((result) =>{
        if(result.isConfirmed){
            tratamientos[indexTratamientoSeleccionado].estatus = "Inactivo";
            clean();
            loadTabla1();
            alertaBorrar();
        }
    });
}

//FUNCION PARA BUSCAR UN TRATAMIENTO
export function searchTratamiento(){
    let filtro = document.getElementById("txtBusquedaTratamiento").value;
    
    let filtroMin=filtro.toLowerCase();

    let resultados = tratamientos.filter(element => element.nombre.toLowerCase()===filtroMin);
    let cuerpo = "";

    if(filtroMin===''){
        alertaNohay();
        loadTabla1();

    }else{
    resultados.forEach(function (tratamiento){
        let registro =  
                '<tr onclick="moduloTratamiento.selectTratamiento('+ tratamientos.indexOf(tratamiento) +');">'+
                '<td>' + tratamiento.nombre + '</td>' +
                '<td>' + tratamiento.precioC +'</td>' +
                '<td>' + tratamiento.precioV + '</td>' +
                '<td>' + tratamiento.cantidad + '</td>' +
                '<td>' + tratamiento.estatus + '</td></tr>' ; 
        cuerpo += registro;
    });
    console.log(cuerpo);
    document.getElementById("tblTratamientos").innerHTML = cuerpo;
    }
}


export function imprimir(el){
    var restorepage = document.body.innerHTML;
    var printcontent = document.getElementById(el).innerHTML;
    document.body.innerHTML = printcontent;
    window.print();
    document.body.innerHTML = restorepage;
    
}


// ALERTAS 
function alertaAdd(){
    Swal.fire({
    title: '¡Tratamiento agregado con exito!',
    text: 'Se actualizo el catalogo tratamientos',
    icon: 'success',
    confirmButtonText: 'Aceptar'
    });
  }

function alertaVacio(){
    Swal.fire({
        title: '¡Un campo esta vacío!',
        text: 'Por favor, rellena todos los campos',
        icon: 'error'
    })
}  

function alertaActualizar(){
    Swal.fire({
        title: '¡Tratamiento modificado con exito!',
        text: 'Se actualizo el catalogo tratamientos',
        icon: 'success'

    })
}

function alertaBorrar(){
    Swal.fire({
        title: '¡Tratamiento eliminado con exito!',
        text: 'El estatus del tratamiento se modifico a inactivo',
        icon: 'warning'
    })
}

function alertaNohay(){
    Swal.fire({
        title: '¡Campo vacio!',
        text: 'Ingresa el dato a buscar',
        icon: 'error'
    })
}