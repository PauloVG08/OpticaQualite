let indexGraduacionSeleccionada;
let clientesG = [];
fetch("modules/moduloExamenVista/data_ExamenVista.json")
        .then(function(response){
            return response.json();
        })
        .then(function(jsondata){
                clientesG = jsondata;
                console.log(clientesG);
                loadTablaExamen();
            }            
        );
let num = 1;
document.getElementById("txtNumUnico").value = num;
export function addExamenVista() {
    let     claveCliente,
            fecha, fech,
            hora, mes,
            esferaD,
            esferaI,
            distanciaInterpupilar,
            cilindroD,
            cilindroI,
            ejeD,
            ejeI;

    claveCliente = document.getElementById("txtNumUnico").value;
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
    esferaD = document.getElementById("txtEsferaD").value;
    esferaI = document.getElementById("txtEsferaI").value;
    distanciaInterpupilar = document.getElementById("txtDistanciaInter").value;
    cilindroD = document.getElementById("txtCilindroD").value;
    cilindroI = document.getElementById("txtCilindroI").value;
    ejeD = document.getElementById("txtEjeD").value;
    ejeI = document.getElementById("txtEjeI").value;
    if(claveCliente===''||esferaD===''||esferaI===''||distanciaInterpupilar===''||cilindroD===''||cilindroI===''||ejeD===''||ejeI==='')
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
    let clienteG = {};
    clienteG.claveCliente = claveCliente;
    clienteG.fecha = fecha;
    clienteG.hora = hora;
    clienteG.esferaD = esferaD;
    clienteG.esferaI = esferaI;
    clienteG.distanciaInterpupilar = distanciaInterpupilar;
    clienteG.cilindroD = cilindroD;
    clienteG.cilindroI = cilindroI;
    clienteG.ejeD = ejeD;
    clienteG.ejeI = ejeI;

    clientesG.push(clienteG);
    limpiarExamen();
    loadTablaExamen();
    alertaAdd();
    document.getElementById("txtNumUnico").value = num;
    num=num+1;
    }
}
function alertaAdd()
{
  Swal.fire({
  title: 'Completado con exito!',
  text: 'Se ha registrado un nuevo registro',
  icon: 'succes',
  confirmButtonText: 'Cool'
});
}
export function limpiarExamen(){
    document.getElementById("txtNumUnico").value="";
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
export function searchExamen() {
    let filtro = document.getElementById("txtBusquedaExamenVista").value;
    let resultados = clientesG.filter(element => element.claveCliente === filtro);
    let cuerpoG = "";
    resultados.forEach(function (clienteG){
        let registro =
                '<tr onclick="moduloExamenVista.selectExamen(' + clientesG.indexOf(clienteG) + ');">' +
                '<th>' + clienteG.claveCliente           + '</th>' +
                '<th>' + clienteG.fecha                  + '</th>' +
                '<th>' + clienteG.hora                   + '</th>' +
                '<th>' + clienteG.esferaD             + '</th>' +
                '<th>' + clienteG.esferaI             + '</th>' +
                '<th>' + clienteG.distanciaInterpupilar  + '</th>' +
                '<th>' + clienteG.cilindroD           + '</th>' +
                '<th>' + clienteG.cilindroI           + '</th>' +
                '<th>' + clienteG.ejeD                + '</th>' +
                '<th>' + clienteG.ejeI                + '</th></tr>';
        cuerpoG += registro;
    });
    console.log(cuerpoG);
    document.getElementById("tblExamenVista").innerHTML = cuerpoG;
}
export function selectExamen(index) {
    document.getElementById("txtNumUnico").value                = clientesG[index].claveCliente;
    document.getElementById("txtEsferaD").value              = clientesG[index].esferaD;
    document.getElementById("txtEsferaI").value              = clientesG[index].esferaI;
    document.getElementById("txtDistanciaInter").value   = clientesG[index].distanciaInterpupilar;
    document.getElementById("txtCilindroD").value             = clientesG[index].cilindroD;
    document.getElementById("txtCilindroI").value             = clientesG[index].cilindroI;
    document.getElementById("txtEjeD").value                    = clientesG[index].ejeD;
    document.getElementById("txtEjeI").value                    = clientesG[index].ejeI;
    document.getElementById("btnUpdate").classList.remove("disabled");
    document.getElementById("btnDelete").classList.remove("disabled");
    document.getElementById("btnAdd").classList.add("disabled");
    indexGraduacionSeleccionada = index;
}
export function loadTablaExamen() {
    let cuerpoG ="";
    clientesG.forEach(function (clienteG) {
        let registro =
                '<tr onclick="moduloExamenVista.selectExamen(' + clientesG.indexOf(clienteG) + ');">' +
                '<th>' + clienteG.claveCliente           + '</th>' +
                '<th>' + clienteG.fecha                  + '</th>' +
                '<th>' + clienteG.hora                   + '</th>' +
                '<th>' + clienteG.esferaD             + '</th>' +
                '<th>' + clienteG.esferaI             + '</th>' +
                '<th>' + clienteG.distanciaInterpupilar  + '</th>' +
                '<th>' + clienteG.cilindroD           + '</th>' +
                '<th>' + clienteG.cilindroI           + '</th>' +
                '<th>' + clienteG.ejeD                + '</th>' +
                '<th>' + clienteG.ejeI                + '</th></tr>';
        cuerpoG += registro;
    });
    console.log(cuerpoG);
    document.getElementById("tblExamenVista").innerHTML = cuerpoG;
}
export function updateExam(){
    
    let     claveCliente,
            fecha,
            hora,
            esferaD,
            esferaI,
            distanciaInterpupilar,
            cilindroD,
            cilindroI,
            ejeD,
            ejeI;

    claveCliente = document.getElementById("txtNumUnico").value;
    fecha=clientesG[indexGraduacionSeleccionada].fecha;
    hora=clientesG[indexGraduacionSeleccionada].hora;
    esferaD = document.getElementById("txtEsferaD").value;
    esferaI = document.getElementById("txtEsferaI").value;
    distanciaInterpupilar = document.getElementById("txtDistanciaInter").value;
    cilindroD = document.getElementById("txtCilindroD").value;
    cilindroI = document.getElementById("txtCilindroI").value;
    ejeD = document.getElementById("txtEjeD").value;
    ejeI = document.getElementById("txtEjeI").value;
    let clienteG = {};
    clienteG.claveCliente = claveCliente;
    clienteG.fecha = fecha;
    clienteG.hora = hora;
    clienteG.esferaD = esferaD;
    clienteG.esferaI = esferaI;
    clienteG.distanciaInterpupilar = distanciaInterpupilar;
    clienteG.cilindroD = cilindroD;
    clienteG.cilindroI = cilindroI;
    clienteG.ejeD = ejeD;
    clienteG.ejeI = ejeI;
    clientesG[indexGraduacionSeleccionada] = clienteG;
    limpiarExamen();
    loadTablaExamen();
    document.getElementById("txtNumUnico").value = num;
    alertaAct();
    document.getElementById("btnUpdate").classList.add("disabled");
    document.getElementById("btnDelete").classList.add("disabled");
    document.getElementById("btnAdd").classList.remove("disabled");
}

export function deleteExam(){
    let contra=prompt("Introduzca la contraseña",);
    if (contra==="holis")
    {
    clientesG.splice(indexGraduacionSeleccionada,1);
    alertaEli();
    limpiarExamen();
    loadTablaExamen();
    document.getElementById("txtNumUnico").value = num;
    document.getElementById("btnUpdate").classList.add("disabled");
    document.getElementById("btnDelete").classList.add("disabled");
    document.getElementById("btnAdd").classList.remove("disabled");
    }
    else
    {
        Swal.fire({
        title: 'Contraseña erronea',
        text: 'No se ha podido eliminar el registro',
        icon: 'error',
        confirmButtonText: 'ok:('  
        }); 
    }
}
function alertaEli()
{
  Swal.fire({
  title: 'Se ha eliminado el registro',
  text: 'Su registro ha sido eliminado',
  icon: 'success',
  confirmButtonText: 'Cool'
});
}
function alertaAct()
{
  Swal.fire({
  title: 'Se ha actualizado el registro!',
  text: 'Los nuevos datos se han guardadado exitosamente',
  icon: 'succes',
  confirmButtonText: 'Cool'
});
}