
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxNotificationService } from 'ngx-notification';
import { NgxSpinnerService } from "ngx-spinner";
import { CustomValidators } from 'ngx-custom-validators';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap'; 
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { NgForm }   from '@angular/forms';
import * as moment from 'moment';
 
import { DataApiService } from "../../services/data-api.service";

import { PacienteInterface } from "../../models/paciente-interface"; 
import { TablaPermisosInterface } from "../../models/tablaPermisos-interface"; 
import { ResultadoInterface } from "../../models/resultado-interface"; 
import { ConsultaInterface } from "../../models/consulta-interface"; 
import { HistoriaClinicaInterface } from "../../models/historiaClinica-interface"; 
import { NotaInterface } from "../../models/nota-interface"; 
import { MedicoInterface } from "../../models/medico-interface";


import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as JSZip from 'jszip';
declare var $: any;
declare var require: any
const FileSaver = require('file-saver');
let zipFile: JSZip = new JSZip();

@Component({
  selector: 'app-externo-expediente',
  templateUrl: './externo-expediente.component.html',
  styleUrls: ['./externo-expediente.component.css'] 
})
export class ExternoExpedienteComponent implements OnInit {

  constructor(
    private router: Router,
    private ngxNotificationService: NgxNotificationService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private dataApiService: DataApiService,
    private route: ActivatedRoute
    ) { }  

    tablaPermisos: TablaPermisosInterface = {};;
    paciente: PacienteInterface={};
    resultados: ResultadoInterface={};
    resultado: ResultadoInterface={};
    resultadoTmp: ResultadoInterface={};
    consultas: ConsultaInterface={};
    consulta: ConsultaInterface={};
    historiasClinica: HistoriaClinicaInterface={};
    historiaClinica: HistoriaClinicaInterface={};
    historiaClinicaTmp: HistoriaClinicaInterface={};
    notas: NotaInterface={};
    notasPrev: NotaInterface={};
    nota: NotaInterface={};
    notaTmp: NotaInterface={};
    
    // valores temporal 
    tmpDate = new Date(Date.now());
    tmpDate2 = new Date(Date.now());
    // toma la fecha actual y suma 12 meses
    maxDateToken = this.tmpDate.setMonth(this.tmpDate.getMonth() + 12);
    // toma la fecha actual y resta 1 dia
    minDate = this.tmpDate2.setDate(this.tmpDate2.getDate());
    // valor para almacenar la edad del doctor o del asistente calculada a partir de la fecha_nacimiento
    edad;
    edadMeses;
    pacienteCargado = 0;
    id=0;
    historiaVacia = null;
    notaVacia = 0;
    historiaCaducidad = 0;
    categoriaSeleccionada = 0;
    categoriaMedicoSeleccionada = 0;
    categoriaNuevaSeleccionada = 0;
    fechaSeleccionada = 0;
    consultaSeleccionada = 0;
    flagCarga = 0;
    flagPrevias = 0; 
    ultimaConsulta = "";
    email = "";
    flagInvitacion = 0;
    medicoFlag = 0;
    medicoEnviarStatus = 0;
    ultimaConsultaPrev ="";
    listasCategorias = ["Null","Medicina General","Medicina Interna","Cirugia","Endocrinologia","Ginecologia","Nefrologia","Neurocirugia","Neurologia","Pediatria","Traumatologia y Ortopedia","Urologia"]
    listasFechas = ["Null","Year","Month"]
    token = null
    msgError = ""  
    flagToken = false;
    imcMenor =  0;
    descargarPDF = true;
    sumaCaracteresHistPag2 = 0;
    sumaCaracteresHistPag3 = 0;
    sumaCaracteresHistPag4 = 0;
    sumaCaracteresHistTmpPag2 = 0;
    sumaCaracteresHistTmpPag3 = 0;
    sumaCaracteresHistTmpPag4 = 0;
    sumaCaracteresConsPag2 = 0
    sumaCaracteresConsPag3 = 0
    sumaCaracteresConsPag4 = 0

  ngOnInit() {
    window.scroll(0,0);
    this.listaEstudios();
    this.listaNotas();
    this.listaHist(); 
    this.validarToken();
  } 

  validarToken(){
    this.flagToken = false;
    this.spinner.show();  
    this.token =this.route.snapshot.paramMap.get('token');
    if(this.token.length==60){
      console.log(" tamaño correcto");
      this.buscarTablaPermiso();
    }else{
      this.msgError = "Este acceso a expediente no existe."  
      this.mensajeErrorTabla();
      console.log(this.route.snapshot.paramMap.get('token').length)
    }
  }

  // funcion para listado de todos los pacientes
  buscarTablaPermiso(){
    this.dataApiService.buscarTablaPermiso(this.token)
    .subscribe((
      data : TablaPermisosInterface) => { this.tablaPermisos = data; 
      console.log("Tabla Cargada")
      console.log(this.tablaPermisos)
      this.validarParametrosToken()
    }, error => this.mensajeError(error)  
    );  
  }

  validarParametrosToken(){
    this.spinner.hide();  
    if(this.tablaPermisos.length > 0){
      console.log("Existe")
      if(this.tablaPermisos[0].estatus == "ACTIVO"){
        const fechaCaducidad = new Date(this.tablaPermisos[0].caducidad).getTime() / 1000
        const fechaActual = new Date().getTime() / 1000
        if(fechaCaducidad > fechaActual){
          console.log("Todo Bien")
          this.consultarPacienteExterno()
        }else{
          this.msgError = "Este acceso a expediente ha vencido. Por favor solicita un nuevo acceso."  
          this.mensajeErrorTabla()
        }
      }
      else{
        this.msgError = "Este acceso a expediente no se encuentra activo. Por favor solicita un nuevo acceso."  
        this.mensajeErrorTabla()
      }
    }
    else{
      this.msgError = "Este acceso a expediente no existe. Por favor solicita un nuevo acceso."  
        this.mensajeErrorTabla()
    }
  }

  //aviso de exito en una operacion en el api
  mensajeExito(){
    this.spinner.hide();  
    this.ngxNotificationService.sendMessage('Búsqueda exitosa', 'success ', 'bottom-right');
  } 

  mensajeError(error){
    this.spinner.hide();  
    this.ngxNotificationService.sendMessage('Ha ocurrido un error ', 'danger ', 'bottom-right');
    console.log(error);
  }

  mensajeErrorTabla(){
    this.flagToken = true;
    this.spinner.hide();  
    this.ngxNotificationService.sendMessage('Ha ocurrido un error', 'danger ', 'bottom-right');
    console.log(this.msgError)
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 30000);
  }

  // funcion para abrir modal de estudios
  verModal(modal){
    console.log("abriendo modal");
    console.log(this.nota)
    this.modalService.open(modal, {
      size: 'xl'
    });
  }


  // funcion para abrir modal de estudios
  verModalMd(modal){
    console.log("abriendo modal");
    console.log(this.nota)
    this.modalService.open(modal, {
      size: 'lg'
    });
  }


  // funcion para abrir modal de estudios 
  verModalSmall(modal){
    console.log("abriendo modal");
    this.modalService.open(modal, {
    // @ts-ignore
      size: 'md'
    });
  }

  // funcion para abrir modal de estudios
  verModalEstudio(resultado, modal){
    console.log("abriendo modal "+resultado.id);
    this.resultado = resultado;
    this.modalService.open(modal, {
      size: 'xl'
    });
  }


  // funcion para abrir modal de estudios
  verModalNotas(nota, modal){
    console.log("abriendo modal "+nota.id);
    this.nota = nota;
    //SUMADOR
    this.sumaCaracteresConsPag2 = 0
    this.sumaCaracteresConsPag3 = 0
    this.sumaCaracteresConsPag4 = 0
    if(this.nota.clinicos){
      this.sumaCaracteresConsPag2 = this.sumaCaracteresConsPag2 + this.nota.clinicos.length
    }
    if(this.nota.impresionDiagnostica){
      this.sumaCaracteresConsPag2 = this.sumaCaracteresConsPag2 + this.nota.impresionDiagnostica.length
    }
    if(this.nota.manejoRecomendaciones){
      this.sumaCaracteresConsPag2 = this.sumaCaracteresConsPag2 + this.nota.manejoRecomendaciones.length
    }
    if(this.nota.subjetivo){
      this.sumaCaracteresConsPag3 = this.sumaCaracteresConsPag3 + this.nota.subjetivo.length
    }
    if(this.nota.objetivo){
      this.sumaCaracteresConsPag3 = this.sumaCaracteresConsPag3 + this.nota.objetivo.length
    }
    if(this.nota.analisis){
      this.sumaCaracteresConsPag3 = this.sumaCaracteresConsPag3 + this.nota.analisis.length
    }
    if(this.nota.plan){
      this.sumaCaracteresConsPag3 = this.sumaCaracteresConsPag3 + this.nota.plan.length
    }
    if(this.nota.notaUno){
      this.sumaCaracteresConsPag4 = this.sumaCaracteresConsPag4 + this.nota.notaUno.length
    }
    if(this.nota.notaDos){
      this.sumaCaracteresConsPag4 = this.sumaCaracteresConsPag4 + this.nota.notaDos.length
    }
    if(this.nota.notaTres){
      this.sumaCaracteresConsPag4 = this.sumaCaracteresConsPag4 + this.nota.notaTres.length
    }
    if(this.nota.notaCuatro){
      this.sumaCaracteresConsPag4 = this.sumaCaracteresConsPag4 + this.nota.notaCuatro.length
    }
    console.log(this.sumaCaracteresConsPag2)
    console.log(this.sumaCaracteresConsPag3)
    console.log(this.sumaCaracteresConsPag4)
      this.modalService.open(modal, {
        size: 'xl'
      });
    }

  // funcion para abrir modal de estudios
  verModalHistorial(historiaClinica, modal){
    console.log("abriendo modal "+historiaClinica.id);
    this.historiaClinicaTmp = historiaClinica;
  //SUMADOR
  this.sumaCaracteresHistTmpPag2 = 0
  this.sumaCaracteresHistTmpPag3 = 0
  this.sumaCaracteresHistTmpPag4 = 0
  if(this.historiaClinicaTmp.antecedentesFamiliares){
    this.sumaCaracteresHistTmpPag2 = this.sumaCaracteresHistTmpPag2 + this.historiaClinicaTmp.antecedentesFamiliares.length
  }
  if(this.historiaClinicaTmp.antecedentesPersonalesNoPatologicos){
    this.sumaCaracteresHistTmpPag2 = this.sumaCaracteresHistTmpPag2 + this.historiaClinicaTmp.antecedentesPersonalesNoPatologicos.length
  }
  if(this.historiaClinicaTmp.antecedentesPersonalesPatologicos){
    this.sumaCaracteresHistTmpPag2 = this.sumaCaracteresHistTmpPag2 + this.historiaClinicaTmp.antecedentesPersonalesPatologicos.length
  }
  if(this.historiaClinicaTmp.procedimientoActual){
    this.sumaCaracteresHistTmpPag2 = this.sumaCaracteresHistTmpPag2 + this.historiaClinicaTmp.procedimientoActual.length
  }
  if(this.historiaClinicaTmp.auxiliaresDiagnostico){
    this.sumaCaracteresHistTmpPag2 = this.sumaCaracteresHistTmpPag2 + this.historiaClinicaTmp.auxiliaresDiagnostico.length
  }
  if(this.historiaClinicaTmp.sistemaNeurologico){
    this.sumaCaracteresHistTmpPag3 = this.sumaCaracteresHistTmpPag3 + this.historiaClinicaTmp.sistemaNeurologico.length
  }
  if(this.historiaClinicaTmp.sistemaTegumentario){
    this.sumaCaracteresHistTmpPag3 = this.sumaCaracteresHistTmpPag3 + this.historiaClinicaTmp.sistemaTegumentario.length
  }
  if(this.historiaClinicaTmp.sistemaMusculoEsqueletico){
    this.sumaCaracteresHistTmpPag3 = this.sumaCaracteresHistTmpPag3 + this.historiaClinicaTmp.sistemaMusculoEsqueletico.length
  }
  if(this.historiaClinicaTmp.sistemaRespiratorio){
    this.sumaCaracteresHistTmpPag3 = this.sumaCaracteresHistTmpPag3 + this.historiaClinicaTmp.sistemaRespiratorio.length
  }
  if(this.historiaClinicaTmp.sistemaDigestivo){
    this.sumaCaracteresHistTmpPag4 = this.sumaCaracteresHistTmpPag4 + this.historiaClinicaTmp.sistemaDigestivo.length
  }
  if(this.historiaClinicaTmp.sistemaUrinario){
    this.sumaCaracteresHistTmpPag4 = this.sumaCaracteresHistTmpPag4 + this.historiaClinicaTmp.sistemaUrinario.length
  }
  if(this.historiaClinicaTmp.sistemaReproductor){
    this.sumaCaracteresHistTmpPag4 = this.sumaCaracteresHistTmpPag4 + this.historiaClinicaTmp.sistemaReproductor.length
  }
  if(this.historiaClinicaTmp.sistemasSentidos){
    this.sumaCaracteresHistTmpPag4 = this.sumaCaracteresHistTmpPag4 + this.historiaClinicaTmp.sistemasSentidos.length
  }
  console.log(this.sumaCaracteresHistTmpPag2)
  console.log(this.sumaCaracteresHistTmpPag3)
  console.log(this.sumaCaracteresHistTmpPag4)
    this.modalService.open(modal, {
      size: 'xl'
    });
  }

  downloadPerfilPDF(){
    this.descargarPDF = false;
    var doc = new jsPDF('p', 'pt', 'a4');
    var width = doc.internal.pageSize.width;    
    var height = doc.internal.pageSize.height;            
    var h1=10;
    var aspectwidth1= (height)*(9/16);
    console.log(screen.width)
    console.log(screen.height)   
    var element = document.getElementById('perfilClinico');
    html2canvas(element).then((canvas) =>{
    var imgData = canvas.toDataURL('image/png') 
    doc.addImage(imgData, 'JPEG', 50, h1, aspectwidth1, (600)); 
    doc.save("perfilClínico.pdf")
    setTimeout(() => { 
      this.descargarPDF = true;
    }, 5000);
    })
}

  consultarPacienteExterno(){ 
    this.spinner.show();
    this.paciente={}
    this.pacienteCargado = 0;
    this.dataApiService.consultarPacienteExterno(this.tablaPermisos[0].Paciente, this.tablaPermisos[0].id, this.tablaPermisos[0].token)
    .subscribe((
      data : TablaPermisosInterface) => { this.paciente = data; 
      this.mensajeExito();
      this.pacienteCargado = 1;
      console.log("Pacientes Cargadados")
      console.log(this.paciente);
      this.calcularEdadPaciente(this.paciente.fecha_nacimiento); 
      this.consultarNotasPacienteExterno()
    }, error => this.mensajeError(error)  
    ); 
    //calcula la edad del paciente y la guarda en la variable edad
  }

  // Si se ejecutan los detalles del medico calcula sus años de edad a partir de la fecha de nacimiento
  calcularEdadPaciente(fecha_nacimiento){
    this.edad = null;
    this.edadMeses = null;
    this.edad = moment().diff(fecha_nacimiento, 'years');
    this.edadMeses = moment().diff(fecha_nacimiento, 'months');
  }

  download() {
    let paciente
    paciente = "Nombre Paciente"
    const url = 'https://semindigital.com:8090' + this.resultado.file;    
    const name = this.resultado.tipoEstudio +" "+ this.resultado.creacion.split('T')[0] +" "+ paciente;
    FileSaver.saveAs(url, name);
  }

  downloadDicom() {
    let paciente
    paciente = "Nombre Paciente"
    const url = 'https://semindigital.com:8090' + this.resultado.fileDicom;    
    const name = this.resultado.tipoEstudio +" "+ this.resultado.creacion.split('T')[0] +" "+ paciente;
    FileSaver.saveAs(url, name);
  }


  downloadHistPDF(){
    this.descargarPDF = false;
    var doc = new jsPDF('p', 'pt', 'a4');
    var width = doc.internal.pageSize.width;    
    var height = doc.internal.pageSize.height;            
    var h1=10;
    var aspectwidth1= (height-h1)*(9/16);
    var largoPagina2;
    var largoPagina3;
    var largoPagina4;
    console.log(screen.width)
    console.log(screen.height)
    if(this.sumaCaracteresHistPag2 >= 2000){
      largoPagina2 = 810;
    }else if((this.sumaCaracteresHistPag2 >= 800) &&  (this.sumaCaracteresHistPag2 <= 2000) ){
      largoPagina2 = 600;
    }else if(this.sumaCaracteresHistPag2 <= 800){
      largoPagina2 = 400; 
    }
    if(this.sumaCaracteresHistPag3 >= 2000){
      largoPagina3 = 810;
    }else if((this.sumaCaracteresHistPag3 >= 800) &&  (this.sumaCaracteresHistPag3<= 2000) ){
      largoPagina3 = 600;
    }else if(this.sumaCaracteresHistPag3 <= 800){
      largoPagina3 = 400; 
    }
    if(this.sumaCaracteresHistPag4 >= 2000){
      largoPagina4 = 810;
    }else if((this.sumaCaracteresHistPag4 >= 800) &&  (this.sumaCaracteresHistPag4<= 2000) ){
      largoPagina4 = 600;
    }else if(this.sumaCaracteresHistPag4 <= 800){
      largoPagina4 = 400; 
    }
    var element = document.getElementById('historiaPrincipalPag1');
    html2canvas(element).then((canvas) =>{
    var imgData = canvas.toDataURL('image/png') 
    doc.addImage(imgData, 'JPEG', 50, h1, aspectwidth1, (810));
    if(this.sumaCaracteresHistPag2 > 0){
      doc.addPage();
    }  
    var element2 = document.getElementById('historiaPrincipalPag2');
    html2canvas(element2).then((canvas2) =>{
    var imgData2 = canvas2.toDataURL('image/png') 
    if(this.sumaCaracteresHistPag2 > 0){
      doc.addImage(imgData2, 'JPEG', 50, h1, aspectwidth1, (largoPagina2));
    } 
    if(this.sumaCaracteresHistPag3 > 0){
      doc.addPage();
    } 
    var element3 = document.getElementById('historiaPrincipalPag3');
    html2canvas(element3).then((canvas3) =>{
    var imgData3 = canvas3.toDataURL('image/png') 
    if(this.sumaCaracteresHistPag3 > 0){
      doc.addImage(imgData3, 'JPEG', 50, h1, aspectwidth1, (largoPagina3));
    } 
    if(this.sumaCaracteresHistPag4 > 0){
      doc.addPage();
    }
    var element4 = document.getElementById('historiaPrincipalPag4');
    html2canvas(element4).then((canvas4) =>{
    var imgData4 = canvas4.toDataURL('image/png') 
    if(this.sumaCaracteresHistPag4 > 0){
      doc.addImage(imgData4, 'JPEG', 50, h1, aspectwidth1, (largoPagina4));
    }
    doc.save("historiaClinica.pdf")
    setTimeout(() => { 
      this.descargarPDF = true;
    }, 5000);
    })
    })
    })
    })
}

downloadHistTmpPDF(){
  this.descargarPDF = false;
  var doc = new jsPDF('p', 'pt', 'a4');
  var width = doc.internal.pageSize.width;    
  var height = doc.internal.pageSize.height;            
  var h1=10;
  var aspectwidth1= (height-h1)*(9/16);
  var largoPagina2;
  var largoPagina3;
  var largoPagina4;
  console.log(screen.width)
  console.log(screen.height)
  if(this.sumaCaracteresHistTmpPag2 >= 2000){
    largoPagina2 = 810;
  }else if((this.sumaCaracteresHistTmpPag2 >= 800) &&  (this.sumaCaracteresHistTmpPag2 <= 2000) ){
    largoPagina2 = 600;
  }else if(this.sumaCaracteresHistTmpPag2 <= 800){
    largoPagina2 = 400; 
  }
  if(this.sumaCaracteresHistTmpPag3 >= 2000){
    largoPagina3 = 810;
  }else if((this.sumaCaracteresHistTmpPag3 >= 800) &&  (this.sumaCaracteresHistTmpPag3<= 2000) ){
    largoPagina3 = 600;
  }else if(this.sumaCaracteresHistTmpPag3 <= 800){
    largoPagina3 = 400; 
  }
  if(this.sumaCaracteresHistTmpPag4 >= 2000){
    largoPagina4 = 810;
  }else if((this.sumaCaracteresHistTmpPag4 >= 800) &&  (this.sumaCaracteresHistTmpPag4<= 2000) ){
    largoPagina4 = 600;
  }else if(this.sumaCaracteresHistTmpPag4 <= 800){
    largoPagina4 = 400; 
  }
  var element = document.getElementById('historiaTmpPag1');
  html2canvas(element).then((canvas) =>{
  var imgData = canvas.toDataURL('image/png') 
  doc.addImage(imgData, 'JPEG', 50, h1, aspectwidth1, (810));
  if(this.sumaCaracteresHistTmpPag2 > 0){
    doc.addPage();
  }
  var element2 = document.getElementById('historiaTmpPag2');
  html2canvas(element2).then((canvas2) =>{
  var imgData2 = canvas2.toDataURL('image/png')
  if(this.sumaCaracteresHistTmpPag2 > 0){
    doc.addImage(imgData2, 'JPEG', 50, h1, aspectwidth1, (largoPagina2));
  } 
  if(this.sumaCaracteresHistTmpPag3 > 0){
    doc.addPage();
  } 
  var element3 = document.getElementById('historiaTmpPag3');
  html2canvas(element3).then((canvas3) =>{
  var imgData3 = canvas3.toDataURL('image/png') 
  if(this.sumaCaracteresHistTmpPag3 > 0){
    doc.addImage(imgData3, 'JPEG', 50, h1, aspectwidth1, (largoPagina3));
  } 
  if(this.sumaCaracteresHistTmpPag4 > 0){
    doc.addPage();
  } 
  var element4 = document.getElementById('historiaTmpPag4');
  html2canvas(element4).then((canvas4) =>{
  var imgData4 = canvas4.toDataURL('image/png') 
  if(this.sumaCaracteresHistTmpPag4 > 0){
    doc.addImage(imgData4, 'JPEG', 50, h1, aspectwidth1, (largoPagina4));
  } 
  doc.save("historiaClinica.pdf")
  setTimeout(() => { 
    this.descargarPDF = true;
  }, 5000);
  })
  })
  })
  })
}

downloadConsPDF(){
  this.descargarPDF = false;
  var doc = new jsPDF('p', 'pt', 'a4');
  var width = doc.internal.pageSize.width;    
  var height = doc.internal.pageSize.height;            
  var h1=10;
  var aspectwidth1= (height-h1)*(9/16);
  var largoPagina2;
  var largoPagina3;
  var largoPagina4;
  console.log(screen.width)
  console.log(screen.height)
  if(this.sumaCaracteresConsPag2 >= 1000){
    largoPagina2 = 810;
  }else if((this.sumaCaracteresConsPag2 >= 800) &&  (this.sumaCaracteresConsPag2 <= 1000) ){
    largoPagina2 = 600;
  }else if(this.sumaCaracteresConsPag2 <= 800){
    largoPagina2 = 400; 
  }
  if(this.sumaCaracteresConsPag3 >= 1000){
    largoPagina3 = 810;
  }else if((this.sumaCaracteresConsPag3 >= 800) &&  (this.sumaCaracteresConsPag3<= 1000) ){
    largoPagina3 = 600;
  }else if(this.sumaCaracteresConsPag3 <= 800){
    largoPagina3 = 400; 
  }
  if(this.sumaCaracteresConsPag4 >= 1000){
    largoPagina4 = 810;
  }else if((this.sumaCaracteresConsPag4 >= 800) &&  (this.sumaCaracteresConsPag4<= 1000) ){
    largoPagina4 = 600;
  }else if((this.sumaCaracteresConsPag4 >= 200) &&  (this.sumaCaracteresConsPag4<= 800) ){
    largoPagina4 = 300;
  }else if(this.sumaCaracteresConsPag4 <= 200){
    largoPagina4 = 150; 
  }
  var element = document.getElementById('consultaTmpPag1');
  html2canvas(element).then((canvas) =>{
  var imgData = canvas.toDataURL('image/png') 
  doc.addImage(imgData, 'JPEG', 50, h1, aspectwidth1, (810));
  if(this.sumaCaracteresConsPag2 > 0){
    doc.addPage();
  }
  var element2 = document.getElementById('consultaTmpPag2');
  html2canvas(element2).then((canvas2) =>{
  var imgData2 = canvas2.toDataURL('image/png') 
  if(this.sumaCaracteresConsPag2 > 0){
   doc.addImage(imgData2, 'JPEG', 50, h1, aspectwidth1, (largoPagina2));
  }
  if(this.sumaCaracteresConsPag3 > 0){
    doc.addPage();
  }
  var element3 = document.getElementById('consultaTmpPag3');
  html2canvas(element3).then((canvas3) =>{
  var imgData3 = canvas3.toDataURL('image/png') 
  if(this.sumaCaracteresConsPag3 > 0){
    doc.addImage(imgData3, 'JPEG', 50, h1, aspectwidth1, (largoPagina3));
  }
  if(this.sumaCaracteresConsPag4 > 0){
   doc.addPage();
  }
  var element4 = document.getElementById('consultaTmpPag4');
  html2canvas(element4).then((canvas4) =>{
  var imgData4 = canvas4.toDataURL('image/png') 
  if(this.sumaCaracteresConsPag4 > 0){
    doc.addImage(imgData4, 'JPEG', 50, h1, aspectwidth1, (largoPagina4));
  }
  doc.save("consulta.pdf")
  setTimeout(() => { 
    this.descargarPDF = true;
  }, 5000);
  })
  })
  })
  })
}

  // funcion para listado de todos los pacientes
  consultarResultadosExterno(){
    this.resultados = {}
    this.spinner.show();
    console.log(this.paciente.id)
    //la tabla nececita reiniciarse al eliminar un item
    $("#listaEstudios").dataTable().fnDestroy();
    this.dataApiService.consultarResultadosExterno(this.paciente.id,this.tablaPermisos[0].id, this.tablaPermisos[0].token)
    //front
    .subscribe((
      data : ResultadoInterface) => { this.resultados = data; 
      this.listaEstudios();
      //la tabla nececita reiniciarse al eliminar un item
      $("#listaEstudios").dataTable().fnDestroy();
      console.log("Resultados Cargados")
      console.log(this.resultados)
      this.spinner.hide();
    }, error => this.mensajeError(error)  
    ); 
  }
 

  // funcion para listado de todas las historias clinicas
  consultarHistoriasClinicasExterno(){
    this.spinner.show();
    //la tabla nececita reiniciarse al eliminar un item
    $("#listaHist").dataTable().fnDestroy();    
    console.log("entra historia")
    this.historiaVacia = 0;
    this.historiaCaducidad = 0;
    this.historiasClinica = {};
    this.historiaClinica = {};
    this.dataApiService.consultarHistoriasClinicasExterno(this.paciente.id,this.tablaPermisos[0].id, this.tablaPermisos[0].token)
    .subscribe((
      data : ResultadoInterface) => { this.historiasClinica = data; 
      console.log("Historias Cargadas")
      console.log(this.historiasClinica) 
      this.spinner.hide();
      if(this.historiasClinica){
        // @ts-ignore
        this.historiaClinica = this.historiasClinica.results[0]
        console.log(this.historiaClinica)
        this.sumaCaracteresHistPag2 = 0
        this.sumaCaracteresHistPag3 = 0
        this.sumaCaracteresHistPag4 = 0
        if(this.historiaClinica){
          if(this.historiaClinica.antecedentesFamiliares){
            this.sumaCaracteresHistPag2 = this.sumaCaracteresHistPag2 + this.historiaClinica.antecedentesFamiliares.length
          }
          if(this.historiaClinica.antecedentesPersonalesNoPatologicos){
            this.sumaCaracteresHistPag2 = this.sumaCaracteresHistPag2 + this.historiaClinica.antecedentesPersonalesNoPatologicos.length
          }
          if(this.historiaClinica.antecedentesPersonalesPatologicos){
            this.sumaCaracteresHistPag2 = this.sumaCaracteresHistPag2 + this.historiaClinica.antecedentesPersonalesPatologicos.length
          }
          if(this.historiaClinica.procedimientoActual){
            this.sumaCaracteresHistPag2 = this.sumaCaracteresHistPag2 + this.historiaClinica.procedimientoActual.length
          }
          if(this.historiaClinica.auxiliaresDiagnostico){
            this.sumaCaracteresHistPag2 = this.sumaCaracteresHistPag2 + this.historiaClinica.auxiliaresDiagnostico.length
          }
          if(this.historiaClinica.sistemaNeurologico){
            this.sumaCaracteresHistPag3 = this.sumaCaracteresHistPag3 + this.historiaClinica.sistemaNeurologico.length
          }
          if(this.historiaClinica.sistemaTegumentario){
            this.sumaCaracteresHistPag3 = this.sumaCaracteresHistPag3 + this.historiaClinica.sistemaTegumentario.length
          }
          if(this.historiaClinica.sistemaMusculoEsqueletico){
            this.sumaCaracteresHistPag3 = this.sumaCaracteresHistPag3 + this.historiaClinica.sistemaMusculoEsqueletico.length
          }
          if(this.historiaClinica.sistemaRespiratorio){
            this.sumaCaracteresHistPag3 = this.sumaCaracteresHistPag3 + this.historiaClinica.sistemaRespiratorio.length
          }
          if(this.historiaClinica.sistemaDigestivo){
            this.sumaCaracteresHistPag4 = this.sumaCaracteresHistPag4 + this.historiaClinica.sistemaDigestivo.length
          }
          if(this.historiaClinica.sistemaUrinario){
            this.sumaCaracteresHistPag4 = this.sumaCaracteresHistPag4 + this.historiaClinica.sistemaUrinario.length
          }
          if(this.historiaClinica.sistemaReproductor){
            this.sumaCaracteresHistPag4 = this.sumaCaracteresHistPag4 + this.historiaClinica.sistemaReproductor.length
          }
          if(this.historiaClinica.sistemasSentidos){
            this.sumaCaracteresHistPag4 = this.sumaCaracteresHistPag4 + this.historiaClinica.sistemasSentidos.length
          }
        }
        console.log(this.sumaCaracteresHistPag2)
        console.log(this.sumaCaracteresHistPag3)
        console.log(this.sumaCaracteresHistPag4)
        this.historiaVacia = 0;
        // @ts-ignore
        if(this.historiasClinica.count == 0){
          this.historiaVacia = 1;
          console.log("Sin historias")
        }
      }  
    }, error => this.mensajeError(error)  
    ); 
  }

  reiniciarTablaHist(){
    this.listaHist();
  }


  // funcion para listado de todas las consultas de un paciente
  consultarNotasPacienteExterno(){
    this.consultarHistoriasClinicasExterno();
    this.spinner.show();
    //es llamado para confirmar que el usuario tiene una historia clinica valida
    //this.consultarHistoriasClinicasMedico();
    this.notas = {};
    //la tabla nececita reiniciarse al eliminar un item 
    $("#listaNotas").dataTable().fnDestroy();
    this.notaVacia = 0;
    this.ultimaConsulta = "";
    console.log(this.paciente.id)
    console.log(this.listasCategorias[this.categoriaSeleccionada]);
    console.log(this.listasFechas[this.fechaSeleccionada]);
    this.dataApiService.consultarNotasPacienteExterno(this.listasCategorias[this.categoriaSeleccionada],this.listasFechas[this.fechaSeleccionada],this.tablaPermisos[0].Paciente, this.tablaPermisos[0].id, this.tablaPermisos[0].token)
    .subscribe((
      data : NotaInterface) => { this.notas = data; 
      this.listaNotas();
      //la tabla nececita reiniciarse al eliminar un item 
      $("#listaNotas").dataTable().fnDestroy();
      console.log("Notas Cargados")
      console.log(this.notas)
      this.spinner.hide();
      if(this.notas){
        // @ts-ignore
        if(this.notas.count == 0){
          this.notaVacia = 1;
        }
        if(this.notas.count > 0){
          // @ts-ignore
          this.ultimaConsulta = this.notas.results[0].creacion
          console.log(this.ultimaConsulta)
        }
      }
    }, error => this.mensajeError(error)  
    ); 
  }

  //funcion que maneja la table en jquery de Notas
  listaNotas(){
    $(document).ready(function() {
      $('#listaNotas').DataTable( {
        "language": {
          "sProcessing":     "Procesando...",
          "sLengthMenu":     "Mostrar _MENU_ Consultas",
          "sZeroRecords":    "No se encontraron resultados",
          "sEmptyTable":     "Ningún dato disponible en esta tabla",
          "sInfo":           "Mostrando Consultas del _START_ al _END_ de un total de _TOTAL_ Consultas",
          "sInfoEmpty":      "Mostrando Consultas del 0 al 0 de un total de 0 registros",
          "sInfoFiltered":   "(filtrado de un total de _MAX_ Consultas)",
          "sInfoPostFix":    "",
          "sSearch":         "Buscar:",
          "sUrl":            "",
          "sInfoThousands":  ",",
          "sLoadingRecords": "Cargando...",
          "oPaginate": {
              "sFirst":    "Primero",
      
              "sLast":     "Último",
              "sNext":     "Siguiente",
              "sPrevious": "Anterior"
          },
          "oAria": {
            "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
        }
      },
        } );
    } );
  } 

  
  //funcion que maneja la table en jquery de Estudios
  listaEstudios(){
    $(document).ready(function() {
      $('#listaEstudios').DataTable( {
        "language": {
          "sProcessing":     "Procesando...",
          "sLengthMenu":     "Mostrar _MENU_ Estudios",
          "sZeroRecords":    "No se encontraron resultados",
          "sEmptyTable":     "Ningún dato disponible en esta tabla",
          "sInfo":           "Mostrando Estudios del _START_ al _END_ de un total de _TOTAL_ Estudios",
          "sInfoEmpty":      "Mostrando Estudios del 0 al 0 de un total de 0 registros",
          "sInfoFiltered":   "(filtrado de un total de _MAX_ Estudios)",
          "sInfoPostFix":    "",
          "sSearch":         "Buscar:",
          "sUrl":            "",
          "sInfoThousands":  ",",
          "sLoadingRecords": "Cargando...",
          "oPaginate": {
              "sFirst":    "Primero",
              "sLast":     "Último",
              "sNext":     "Siguiente",
              "sPrevious": "Anterior"
          },
          "oAria": {
            "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
        }
      },
        } );
    } );
  }

  //funcion que maneja la table en jquery de Estudios
  listaHist(){
    $(document).ready(function() {
      $('#listaHist').DataTable( {
        "language": {
          "sProcessing":     "Procesando...",
          "sLengthMenu":     "Mostrar _MENU_ Estudios",
          "sZeroRecords":    "No se encontraron resultados",
          "sEmptyTable":     "Ningún dato disponible en esta tabla",
          "sInfo":           "Mostrando Estudios del _START_ al _END_ de un total de _TOTAL_ Estudios",
          "sInfoEmpty":      "Mostrando Estudios del 0 al 0 de un total de 0 registros",
          "sInfoFiltered":   "(filtrado de un total de _MAX_ Estudios)",
          "sInfoPostFix":    "",
          "sSearch":         "Buscar:",
          "sUrl":            "",
          "sInfoThousands":  ",",
          "sLoadingRecords": "Cargando...",
          "oPaginate": {
              "sFirst":    "Primero",
              "sLast":     "Último",
              "sNext":     "Siguiente",
              "sPrevious": "Anterior"
          },
          "oAria": {
            "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
        }
      },
        } );
    } );
  }
}
