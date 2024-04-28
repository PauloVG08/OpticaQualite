let indexMaterialSeleccionado;
let materiales = [];

export function addMaterial() {
    let     nombre,
            precioV,
            precioC,
            estatus;
            
    nombre      = document.getElementById("txtNombreMaterial").value;
    precioV     = document.getElementById("txtPrecioV").value;
    precioC     = document.getElementById("txtPrecioC").value;
    estatus     ="Activo";

    if (nombre=='' ||  precioV=='' || precioC =='' ){
        
        Swal.fire(
            '¡Un campo esta vacío',
            'Por favor, rellena todos los campos',
            'error'
          )
    } else {
    
    
    let material ={};
    material.nombre     = nombre;
    material.precioV    = precioV;
    material.precioC    = precioC;
    material.estatus    = estatus;
    
    materiales.push(material);
    cleanMateriales();
    loadTablaMateriales();

    //ALERTA QUE INDICA QUE SE AGREGO EL Material
    Swal.fire(
        '¡Material agregado con exito!',
        'Se actualizo el catalogo materiales',
        'success'
      )
    }
}

export function cargartabla() {
    loadTablaMateriales();
}
export function loadTablaMateriales() {
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

function aclis(){
    let cuerpo = "";
    let filtro = "Activo";
    let resultados = materiales.filter(element => element.estatus === filtro);
    resultados.forEach(function (material){
        let registro=
        '<tr onclick="moduloMateriales.selectMaterial('+materiales.indexOf(material)+');">'+
                '<td>'  + material.nombre  +            '</td>' +
                '<td>'  + material.precioV +            '</td>' +
                '<td>'  + material.precioC +            '</td>' +
                '<td>'  + material.estatus +            '</td></tr>';
        cuerpo +=registro;
    });
    console.log(cuerpo);
    document.getElementById("tblMateriales").innerHTML=cuerpo;   
}
function Inaclis(){
    let cuerpo = "";
    let filtro = "Inactivo";
    let resultados = materiales.filter(element => element.estatus === filtro);
    resultados.forEach(function (material){
        let registro=
        '<tr onclick="moduloMateriales.selectMaterial('+materiales.indexOf(material)+');">'+
                '<td>'  + material.nombre  +            '</td>' +
                '<td>'  + material.precioV +            '</td>' +
                '<td>'  + material.precioC +            '</td>' +
                '<td>'  + material.estatus +            '</td></tr>';
        cuerpo +=registro;
    });
    console.log(cuerpo);
    document.getElementById("tblMateriales").innerHTML=cuerpo;   
}

export function cleanMateriales() {
    document.getElementById("txtNombreMaterial").value="";
    document.getElementById("txtPrecioV").value="";
    document.getElementById("txtPrecioC").value="";
}
export function deleteMaterial() {
    materiales[indexMaterialSeleccionado].estatus="Inactivo";
    cleanMateriales();
    loadTablaMateriales();

    Swal.fire(
        '¡Material eliminado con exito!',
        'El estatus del material se modifico a inactivo',
        'warning'
      )
}
fetch("modules/moduloMateriales/data_Materiales.json")
    .then(function(response){
            return response.json();
        })
        .then(function(jsondata){
                materiales = jsondata;
                console.log(materiales);
                loadTablaMateriales();
            }            
        );


export function selectMaterial(index) {
    document.getElementById("txtNombreMaterial").value=materiales[index].nombre;
    document.getElementById("txtPrecioV").value=materiales[index].precioV;
    document.getElementById("txtPrecioC").value=materiales[index].precioC;
    
    document.getElementById("btnUpdate").classList.remove("disabled");
    document.getElementById("btnDelete").classList.remove("disabled");
    document.getElementById("btnAdd").classList.add("disabled");

    indexMaterialSeleccionado=index;
}

export function updateMaterial() {
    let     nombre,
            precioV,
            precioC,
            estatus;
            
    nombre      = document.getElementById("txtNombreMaterial").value;
    precioV     = document.getElementById("txtPrecioV").value;
    precioC     = document.getElementById("txtPrecioC").value;
    estatus     ="Activo";
    
    
    let material ={};
    material.nombre     = nombre;
    material.precioV    = precioV;
    material.precioC    = precioC;
    material.estatus    = estatus;
    
    materiales[indexMaterialSeleccionado]=material;
    cleanMateriales();
    loadTablaMateriales();

    Swal.fire(
        '¡Material modificado con exito!',
        'Se actualizo el catalogo materiales',
        'success'
      )

}
//de aqui paraa arriba ni lo mires

export function searchMaterial(){
    let filtro = document.getElementById("txtBusquedaMaterial").value;
    
    let resultados = materiales.filter(element => element.nombre === filtro);
    let cuerpo = "";
    resultados.forEach(function (material){
        let registro =  
                '<tr onclick="moduloMateriales.selectMaterial('+materiales.indexOf(material)+');">'+
                '<td>'  + material.nombre  +            '</td>' +
                '<td>'  + material.precioV +            '</td>' +
                '<td>'  + material.precioC +            '</td>' +
                '<td>'  + material.estatus +            '</td></tr>';
        cuerpo += registro;
    });
    console.log(cuerpo);
    document.getElementById("tblMateriales").innerHTML = cuerpo;
}
//de aqui paraa arriba ni lo mires

export function imprimir(el){
    var restorepage = document.body.innerHTML;
    var printcontent = document.getElementById(el).innerHTML;
    document.body.innerHTML = printcontent;
    window.print();
    document.body.innerHTML = restorepage;
    
}