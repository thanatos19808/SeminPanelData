import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxNotificationService } from 'ngx-notification';
import { NgxSpinnerService } from "ngx-spinner";
import { CustomValidators } from 'ngx-custom-validators';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap'; 
import { Router } from "@angular/router";
import * as moment from 'moment'

import { DataApiService } from "../../services/data-api.service";
import { AuthService } from "../../services/auth.service";

import { UserInterface } from "../../models/user-interface";
import { PacienteInterface } from "../../models/paciente-interface"; 
import { TablaPermisosInterface } from "../../models/tablaPermisos-interface"; 
import { ResultadoInterface } from "../../models/resultado-interface"; 
import { ConsultaInterface } from "../../models/consulta-interface"; 
import { HistoriaClinicaInterface } from "../../models/historiaClinica-interface"; 
import { MedicoInterface } from "../../models/medico-interface"; 
import { NotaInterface } from "../../models/nota-interface"; 
import { EstudioInterface } from "../../models/estudio-interface";
import { DisponibilidadInterface } from "../../models/disponibilidad-interface";
import { TiempoInterface } from "../../models/tiempo-interface";
import { CitaInterface } from "../../models/cita-interface";

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as JSZip from 'jszip';
declare var $: any;
declare var require: any
const FileSaver = require('file-saver');
let zipFile: JSZip = new JSZip();


@Component({
  selector: 'app-medico-paciente',
  templateUrl: './medico-paciente.component.html',
  styleUrls: ['./medico-paciente.component.css']
})
export class MedicoPacienteComponent implements OnInit {

  pacienteForm: FormGroup;
  historiaCrearForm: FormGroup;
  consultaCrearForm: FormGroup;
  estudioSubirForm: FormGroup;
  usuarioForm: FormGroup;
  queryForm: FormGroup;
  citaFechaForm: FormGroup;

  // valores temporal 
  tmpDate = new Date(Date.now());
  tmpDate2 = new Date(Date.now());
  tmpDate3 = new Date(Date.now());
  tmpDate4 = new Date(Date.now());
  // toma la fecha actual y suma 12 meses
  maxDateToken = this.tmpDate.setMonth(this.tmpDate.getMonth() + 12);
  // toma la fecha actual y resta 1 dia
  minDate = this.tmpDate2.setDate(this.tmpDate2.getDate());
  // valor para almacenar la edad del doctor o del asistente calculada a partir de la fecha_nacimiento
  minDate2 = this.tmpDate3.setDate(this.tmpDate3.getDate() - 1);
  edad;
  edadMeses;
  // Fecha minima de nacimiento (120 años)
  minFechaNacimiento = new Date("1900/01/01");
  
  // toma la fecha actual
  maxDate = new Date(Date.now());
  maxDateCita = this.tmpDate4.setMonth(this.tmpDate4.getMonth() + 12);
  msgError = 'No es posible agendar la cita';
  estudioEstatus = 0;
  pacienteCargado = 0;
  id=0;
  historiaVacia = 0;
  notaVacia = 0;
  historiaCaducidad = 0;
  categoriaSeleccionada = 0;
  categoriaMedicoSeleccionada = 0;
  categoriaNuevaSeleccionada = 0;
  fechaSeleccionada = 0;
  consultaSeleccionada = 0;
  flagCarga = 0;
  flagPrevias = 0; 
  pacienteFlag = 0;
  ultimaConsulta = "";
  interrogatorioFlag = false;
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
/////////////////////
  flag= false;
  err= false; 
  exito= false; 
  procesando = false;
  medicoExisteFlag = 0;
  pacienteExisteFlag = 0;
  token = "";
  imcMenor =  0;
  ///////////////////////////////
  query;
  todosLista = true; 
  initialFlag =false;
  clinicaFlag =false;
  flagAgenda = true;
  flagCita = true;
  sucursalSelecionada = null;
  sucursalSelecionadaTmp = null;
  salaSelecionada = null;
  sala = null;
  fechaSelecionada = null;
  hora_inicio = null;
  hora_final = null;
  horaFlag =false;
  listaHoras = [];
  isToday;
  apuntadorInicio;
  apuntadorFinal;
  tmpApuntador; 
  flagFinal;
  choque;
  list = [    
    {flag : true, name : "Analisis Sanguineos", value: "Sang"},
    {flag : true, name : "Analisis Clinicos", value: "Esp"},
    {flag : true, name : "Ultrasonografia", value: "US"},
    {flag : true, name : "Ultrasonografia Doppler", value: "USD"},
    {flag : true, name : "Rayos X", value: "RXS"},
    {flag : true, name : "Rayos X Contrastados", value: "RXC"},
    {flag : true, name : "Mastografia", value: "Masto"},
    {flag : true, name : "Papanicolau", value: "Papa"},
    {flag : true, name : "Cardiologia", value: "Card"},
    {flag : true, name : "Tomografia", value: "TACS"},
    {flag : true, name : "Tomografia Contrastada", value: "TACC"},
    {flag : true, name : "Resonancia Magnetica", value: "RMS"},
    {flag : true, name : "Resonancia Magnetica Contrastada", value: "RMC"},
    {flag : true, name : "Colposcopia", value: "Colpo"},
    {flag : true, name : "Densitometria", value: "Densi"},
    {flag : true, name : "Audiologia", value: "Audio"},
    {flag : true, name : "Espirometria", value: "Espiro"},
    {flag : true, name : "Patologia", value: "Pato"},
    {flag : true, name : "Rehabilitacion", value: "RehaEle"},
  ];

  ultimaConsultaPrev ="";
  listasCategorias = ["Null","Medicina General","Medicina Interna","Cirugia","Endocrinologia","Ginecologia","Nefrologia","Neurocirugia","Neurologia","Pediatria","Traumatologia y Ortopedia","Urologia"]
  listasFechas = ["Null","Year","Month"]
  
  //Patrón para identificar un nombre
  firstNamePattern: any = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/
  //Patrón para identificar un apellido 
  lastNamePattern: any = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/
  //Patrón para identificar un texto sin caracteres especiales
  textPattern: any=/^[^<>%$|&*;]*$/ 
  //Patrón para identificar un curp
  curpPattern: any= /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/
  //Patrón para identificar un correo.
  emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  constructor(
    private authService: AuthService,
    private ngxNotificationService: NgxNotificationService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private router: Router, 
    private dataApiService: DataApiService,
    private formBuilder: FormBuilder
    ) { }

  userAPI: UserInterface = {};
  tablaPermisos: TablaPermisosInterface = {};
  tablaPermisosCrear: TablaPermisosInterface = {};
  pacientes: PacienteInterface={};
  paciente: PacienteInterface={};
  pacienteActualizar: PacienteInterface={};
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
  medico: MedicoInterface ={};
  userCrear: UserInterface = {};
  userCrearTemp: UserInterface = {};
  pacienteCrear: PacienteInterface = {};
  medicoSearch: MedicoInterface = {};
  pacienteSearch: PacienteInterface ={};
  estudio: EstudioInterface ={};
  estudios: EstudioInterface={};
  disponibilidad: DisponibilidadInterface ={};
  tiempo: TiempoInterface ={};
  tiempos: TiempoInterface ={};
  cita: CitaInterface ={};
  citas: CitaInterface ={};


  

  //detecta el enter en la barra del buscador
  onKeydown(event) {
    if (event.key === "Enter") {
      console.log(event);
      this.consultarEstudio();
    }
  }


  // funcion para listado de todos los estudios
  consultarEstudio(){
    this.spinner.show();  
    this.dataApiService.consultarEstudio(this.query,this.list)
    .subscribe((
      data : EstudioInterface) => { this.estudios = data; 
      this.mensajeExito();
      console.log("Estudio Cargado")
      console.log(this.estudios);
      this.initialFlag= true;
      this.spinner.hide();  
    }, error => this.mensajeError(error)  
    ); 
  }

  //aviso de exito en una operacion en el api
  mensajeExito(){
    this.ngxNotificationService.sendMessage('Búsqueda exitosa', 'success ', 'bottom-right');
  } 

  mensajeError(error){
    this.spinner.hide();
    this.ngxNotificationService.sendMessage('Ha ocurrido un error ', 'danger ', 'bottom-right');
    console.log(error);
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
  verHorarioLista(modal){
    console.log("abriendo modal");
    this.modalService.open(modal, {
      size: 'lg'
    });
  }

  // funcion para abrir modal de estudios
  verModalBuscador(modal){
    console.log("abriendo modal");
    this.modalService.open(modal, {
      size: 'xl'
    });
  }

  // funcion para abrir modal de estudios
  verModalEstudios(modal){
    console.log("abriendo modal");
    this.modalService.open(modal, {
      size: 'xl'
    });
  }

    // funcion para abrir modal de estudios
    verModalEstudiosOtro(modal){
      console.log("abriendo modal");
      this.modalService.open(modal, {
        size: 'xl'
      });
    }

  // funcion para abrir modal de estudios
  verEstudiosId(estudio,modal){
    this.estudio = estudio;
    console.log(this.estudio);
    console.log("abriendo modal");
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
  verModalPaciente(tabla, modal){
    console.log("abriendo modal "+tabla.Paciente.id);
    this.paciente ={}
    // @ts-ignore
    this.paciente = tabla.Paciente;
    this.edad = null;
    this.edadMeses = null;
    this.edad = moment().diff(this.paciente.fecha_nacimiento, 'years');
    this.edadMeses = moment().diff(this.paciente.fecha_nacimiento, 'months');
    console.log("Meses");
    console.log(this.edadMeses);
    console.log("Años"); 
    console.log(this.edad);
    this.consultarNotasMedico();
    this.modalService.open(modal, {
      size: 'xl'
    });
  }

    // funcion para abrir modal de estudios
    verModalPacienteSemin(paciente, modal){
      console.log("abriendo modal "+paciente.id);
      this.paciente ={}
      // @ts-ignore
      this.paciente = paciente;
      this.edad = null;
      this.edadMeses = null;
      this.edad = moment().diff(this.paciente.fecha_nacimiento, 'years');
      this.edadMeses = moment().diff(this.paciente.fecha_nacimiento, 'months');
      this.consultarNotasMedico();
      this.modalService.open(modal, {
        size: 'xl'
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

  // funcion para listado de todos los estudios
  consultarDisponibilidad(){
    this.initialFlag =false;
    this.clinicaFlag =false;
    this.todosLista = true;
    this.flagAgenda = true;
    this.flagCita = true;
    this.sucursalSelecionada = null;
    this.sucursalSelecionadaTmp = null;
    this.salaSelecionada = null;
    this.sala = null;
    this.dataApiService.consultarDisponibilidad(this.estudio)
    .subscribe((
      data : DisponibilidadInterface) => { this.disponibilidad = data; 
      this.mensajeExito();
      console.log("Disponibilidad Cargada")
      console.log(this.disponibilidad);
      this.consultarTiempo();
    }, error => this.mensajeError(error)  
    ); 
  }

  // funcion para listado de todos los estudios
  consultarTiempo(){
    this.dataApiService.consultarTiempo()
    .subscribe((
      data : TiempoInterface) => { this.tiempos = data; 
      this.mensajeExito();
      console.log("Tiempo Cargado")
      console.log(this.tiempos);
      this.tiempoRequerido();
    }, error => this.mensajeError(error)  
    ); 
  }

  //toma la lista de tiempos y guarda en tiempo el que coincide con el estudio
  tiempoRequerido(){
    console.log("tiempo requerido");
    let value = this.estudio.categoria;
    let categoria = this.estudio.categoria;
    let nombre = null;
    console.log(value);
    for(let i in this.list){
      if(this.list[i].name == value){
        console.log("hallado")
        nombre = this.list[i].value;
        console.log(nombre)
      }
    } 
    console.log(nombre)
    for(let i in this.tiempos.results[0]){
      if(i.includes(nombre)){
        console.log("tiempo hallado")
        console.log(this.tiempos.results[0][i])
        this.tiempo = this.tiempos.results[0][i]
        if(this.tiempo == 0){
          console.log("tiempo 0")
          this.flagAgenda = false;
        }
      break
      }
    }
  }

    //la funcion detecta a patir del estudio la sala en la sucursal correspondiente
    seleccionarSala(){
      console.log("seleccionar sala");
      if(!this.clinicaFlag){
        this.sala=null;
        this.clinicaFlag=true;
        this.sucursalSelecionadaTmp = this.sucursalSelecionada;
        console.log(this.sucursalSelecionada)
        for(let i in this.sucursalSelecionada){
          if(JSON.stringify(i)==JSON.stringify(this.estudio.sala)){
            console.log("hallado")    
            this.sala = this.sucursalSelecionada[i]
            console.log(this.sala)
          }
          //break
        }
      }
      if(!(this.sucursalSelecionada.id == this.sucursalSelecionadaTmp.id )) 
      {
        this.sala=null;
        this.sucursalSelecionadaTmp = this.sucursalSelecionada;
        for(let i in this.sucursalSelecionada){
          if(JSON.stringify(i)==JSON.stringify(this.estudio.sala)){
            console.log("hallado")    
            this.sala = this.sucursalSelecionada[i]
            console.log(this.sala)
          }
        }
      }
      if((this.sucursalSelecionada.id == this.sucursalSelecionadaTmp.id )) 
      {
        this.sucursalSelecionadaTmp = this.sucursalSelecionada;
      }
    }

  //funcion que detecta si se ha alterado la fecha y hora
  seleccionarHoraFecha(){
    this.horaFlag = false;
  }
  
  seleccionarHora(inicio, final){
    this.hora_inicio = inicio;
    this. hora_final = final;
    this.horaFlag = true;
  }

  carrito(){
    this.asignarDatosCita() 
    this.cita.estatus= "CARRITO"
    this.crearCitaSucursalMedico()
  }

  compra(){
    this.asignarDatosCita()
    this.cita.estatus= "ACTIVA"
    this.crearCitaSucursalMedico()
    
  }

  //crear cita
  crearCitaSucursalMedico(){
    this.dataApiService.crearCitaSucursalMedico(this.cita)
    .subscribe((
      data : CitaInterface) => { this.cita = data; 
      this.mensajeExito();
      console.log("Cita Creada!!!");
    }, error => this.mensajeError(error)
      );
  }

  
  asignarDatosCita(){
    this.cita={}
    var precio;
    if(this.flagAgenda && this.flagCita){ 
      console.log("AGENDADA")
      this.cita.fecha_cita= this.fechaSelecionada;
      this.cita.hora_inicio= this.hora_inicio+":01";
      this.cita.hora_final= this.hora_final;
      this.cita.tipo_cita= "AGENDADA";
      this.cita.id_sala= this.sala;
      if(this.cita.id_sala == "0"){
        this.cita.id_sala = "2";
        if((this.cita.Sucursal == "2") || (this.cita.Sucursal == "3")){
          this.cita.id_sala = "3";
        }
      }      
      this.cita.prueba= this.estudio.prueba;
      this.cita.categoria= this.estudio.categoria;
      precio = this.estudio.precioVenta;
      precio = precio.toFixed(2)
      this.cita.precioVenta= precio;
      precio = this.estudio.precioApoyo;
      precio = precio.toFixed(2)
      this.cita.costoSucursal= precio;
      this.cita.Sucursal = this.sucursalSelecionada.Sucursal.id;
      this.cita.Paciente = this.paciente.id;  
      this.cita.creador =   "Dr. "+this.userAPI.first_name+" "+this.userAPI.last_name;
      this.cita.editor =   "Dr. "+this.userAPI.first_name+" "+this.userAPI.last_name;
      console.log(this.cita)
    }else if(!this.flagAgenda){
      console.log("EXTERNA")
      this.cita.tipo_cita= "EXTERNA";
      this.cita.prueba= this.estudio.prueba;
      this.cita.categoria= this.estudio.categoria;
      precio = this.estudio.precioVenta;
      precio = precio.toFixed(2)
      this.cita.precioVenta= precio;
      precio = this.estudio.precioApoyo;
      precio = precio.toFixed(2)
      this.cita.costoSucursal= precio;
      this.cita.Sucursal = "2";
      this.cita.Paciente = this.paciente.id;  
      this.cita.creador =   "Dr. "+this.userAPI.first_name+" "+this.userAPI.last_name;
      this.cita.editor =   "Dr. "+this.userAPI.first_name+" "+this.userAPI.last_name;
      console.log(this.cita)
    }else if(!this.flagCita){
      console.log("ABIERA")
      this.cita.tipo_cita= "ABIERTA";
      this.cita.prueba= this.estudio.prueba;
      this.cita.categoria= this.estudio.categoria;
      precio = this.estudio.precioVenta;
      precio = precio.toFixed(2)
      this.cita.precioVenta= precio;
      precio = this.estudio.precioApoyo;
      precio = precio.toFixed(2)
      this.cita.costoSucursal= precio;
      this.cita.Sucursal = "2";
      this.cita.Paciente = this.paciente.id;  
      this.cita.creador =   "Dr. "+this.userAPI.first_name+" "+this.userAPI.last_name;
      this.cita.editor =   "Dr. "+this.userAPI.first_name+" "+this.userAPI.last_name;
      console.log(this.cita)
    }
  }

  rellenarConsulta(){
    this.notaTmp.peso = this.historiaClinica.peso;
    this.notaTmp.sexo = this.historiaClinica.sexo;
    this.notaTmp.talla = this.historiaClinica.talla;
  }

  
  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.estudioSubirForm.get('file').setValue(file);
    }
  }

  onFileSelectDicom(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.estudioSubirForm.get('fileDicom').setValue(file);
    }
  }

  consultarPacientesMedico(){  
    this.pacienteFlag=0;
    this.spinner.show();
    this.pacienteCargado = 0;
    this.dataApiService.consultarTablaPermisosMedico()
    .subscribe((
      data : TablaPermisosInterface) => { this.tablaPermisos = data; 
      this.mensajeExito();
      this.spinner.hide(); 
      this.pacienteCargado = 1;
      this.listaPacientes();
      this.spinner.hide();
      //la tabla nececita reiniciarse al eliminar un item
      $("#listaPacientes").dataTable().fnDestroy();
      console.log("Pacientes Cargadados")
      console.log(this.tablaPermisos);
      if(this.tablaPermisos){
        // @ts-ignore
        if(this.tablaPermisos.count > 0){
          console.log("Existe Paciente")
          this.pacienteFlag=0;
        }
        else{
          console.log("No Existe Paciente")
          this.pacienteFlag=1;
        }
      }   
    }, error => this.mensajeError(error)  
    ); 
  }

  consultarPacientesMedicoSemin(){ 
    this.spinner.show();
    this.pacienteFlag=0;
    this.pacienteCargado = 0;
    this.dataApiService.consultarPacientesMedico()
    .subscribe((
      data : PacienteInterface) => { this.pacientes = data; 
      this.mensajeExito();
      this.spinner.hide();
      this.pacienteCargado = 1;
      this.listaPacientesSemin();
      this.spinner.hide();
      //la tabla nececita reiniciarse al eliminar un item
      $("#listaPacientesSemin").dataTable().fnDestroy();
      console.log("Pacientes Cargadados")
      console.log(this.pacientes);
    }, error => this.mensajeError(error)  
    ); 
  }

  consultarExpedientes(){
    if(this.medico.medicoSemin){
      this.consultarPacientesMedicoSemin();
    }else{
      this.consultarPacientesMedico();
    }
  }
  
  consultarMedico(){ 
    this.pacienteCargado = 0;
    this.dataApiService.consultarMedico(this.userAPI.id_sem)
    .subscribe((
      data : MedicoInterface) => { this.medico = data; 
      this.mensajeExito();
      console.log("Medico Cargadados")
      console.log(this.medico.medicoSemin)
      if(this.medico.medicoSemin){
        this.consultarPacientesMedicoSemin();
      }else{
        this.consultarPacientesMedico();
      }
      
    }, error => this.mensajeError(error)  
    ); 
  }


  //Crear resultado
  crearResultadoOp(){
    this.spinner.show();
    this.estudioEstatus = 1;
    let operador
    operador = this.userAPI.first_name+" "+this.userAPI.last_name
    const formData = new FormData();
    formData.append('file', this.estudioSubirForm.get('file').value);
    formData.append('fileDicom', this.estudioSubirForm.get('fileDicom').value);
    formData.append('tipoEstudio', this.estudioSubirForm.get('tipoEstudio').value);
    formData.append('fecha_realizacion', this.estudioSubirForm.get('fecha_realizacion').value);
    formData.append('Paciente', this.paciente.id);
    formData.append('creador', operador);
    formData.append('editor', operador);
    if(this.estudioSubirForm.get('notasEstudio').value){
      formData.append('notasEstudio', this.estudioSubirForm.get('notasEstudio').value);
    }
    this.dataApiService.crearResultadoMed(formData)
    .subscribe(() => {  
      console.log("Creando Resultado"); 
      this.mensajeExito();
      this.spinner.hide();
      this.estudioEstatus = 2;
      this.consultarResultados();
      //la tabla nececita reiniciarse al eliminar un item
      //$("#lista").dataTable().fnDestroy();
    }, error => this.mensajeError(error)  
    ); 
    }

    // Aqui se definen las reglas que seguirá estudio subido
  validarEstudioSubirFormulario(){
    this.estudioSubirForm = this.formBuilder.group({
      tipoEstudio: ["", Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(90),Validators.pattern(this.textPattern)])],
      fecha_realizacion: ["", Validators.compose([Validators.required])],
      notasEstudio: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(500),Validators.pattern(this.textPattern)])],
      file: ["", Validators.compose([Validators.required])],
      fileDicom: ["", Validators.compose([])],
    });
  }

  validarPacienteFormulario(){ 
    this.pacienteForm = this.formBuilder.group({
      sexo: ["", Validators.compose([])],
      fecha_nacimiento: ["", Validators.compose([CustomValidators.minDate(this.minFechaNacimiento),CustomValidators.maxDate(this.maxDate)])],
      tipo_sangre: ["", Validators.compose([])], 
      curp: ["", Validators.compose([Validators.minLength(18),Validators.maxLength(18), Validators.pattern(this.curpPattern)])],
      entidad_nacimiento: ["", Validators.compose([Validators.minLength(2), Validators.maxLength(45), Validators.pattern(this.textPattern)])],
      entidad: ["", Validators.compose([Validators.minLength(2), Validators.maxLength(45), Validators.pattern(this.textPattern)])],
      nivel_socioeconomico: ["", Validators.compose([Validators.minLength(3), Validators.maxLength(90), Validators.pattern(this.textPattern)])],
      tipo_vivienda: ["", Validators.compose([Validators.minLength(3), Validators.maxLength(200), Validators.pattern(this.textPattern)])],
      discapacidad: ["", Validators.compose([Validators.minLength(3), Validators.maxLength(90), Validators.pattern(this.textPattern)])],
      grupoEtnico: ["", Validators.compose([Validators.minLength(3), Validators.maxLength(90), Validators.pattern(this.textPattern)])],
      religion: ["", Validators.compose([Validators.minLength(3), Validators.maxLength(45), Validators.pattern(this.textPattern)])],
      ocupacion: ["", Validators.compose([Validators.minLength(3), Validators.maxLength(90), Validators.pattern(this.textPattern)])],
      tipoDomicilio: ["", Validators.compose([Validators.minLength(3), Validators.maxLength(90), Validators.pattern(this.textPattern)])],
      calle: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(90), Validators.pattern(this.textPattern)])],
      colonia: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(45), Validators.pattern(this.textPattern)])],
      num_interior: ["", Validators.compose([Validators.maxLength(10), Validators.pattern(this.textPattern)])],
      num_exterior: ["", Validators.compose([Validators.maxLength(10), Validators.pattern(this.textPattern)])],
      cp: ["", Validators.compose([Validators.min(10000), Validators.max(99999)])],
      municipio: ["", Validators.compose([Validators.minLength(2), Validators.maxLength(45), Validators.pattern(this.textPattern)])], 
      localidad: ["", Validators.compose([Validators.minLength(2), Validators.maxLength(200), Validators.pattern(this.textPattern)])],
      estado: ["", Validators.compose([Validators.minLength(2), Validators.maxLength(45), Validators.pattern(this.textPattern)])],
      telefonoCasa: ["", Validators.compose([Validators.min(1000000000), Validators.max(9999999999)])],
      telefonoOficina: ["", Validators.compose([Validators.min(1000000000), Validators.max(9999999999)])],
      telefonoCelular: ["", Validators.compose([Validators.required, Validators.min(1000000000), Validators.max(9999999999)])], });
  }

  validarHistoriaCrearFormulario(){ 
    this.historiaCrearForm = this.formBuilder.group({
      tipoInterrogatorio: ["", Validators.compose([Validators.required])],
      sexo: ["", Validators.compose([Validators.required])],
      informador: ["", Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(200), Validators.pattern(this.textPattern)])],
      estadoSalud: ["", Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(200), Validators.pattern(this.textPattern)])],
      entidad_nacimiento: ["", Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(45), Validators.pattern(this.textPattern)])],
      calle: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(90), Validators.pattern(this.textPattern)])],
      colonia: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(45), Validators.pattern(this.textPattern)])],
      num_interior: ["", Validators.compose([Validators.maxLength(10), Validators.pattern(this.textPattern)])],
      num_exterior: ["", Validators.compose([Validators.maxLength(10), Validators.pattern(this.textPattern)])],
      cp: ["", Validators.compose([Validators.min(10000), Validators.max(99999)])],
      municipio: ["", Validators.compose([Validators.minLength(2), Validators.maxLength(45), Validators.pattern(this.textPattern)])], 
      localidad: ["", Validators.compose([Validators.minLength(2), Validators.maxLength(200), Validators.pattern(this.textPattern)])],
      estado: ["", Validators.compose([Validators.minLength(2), Validators.maxLength(45), Validators.pattern(this.textPattern)])],
      telefonoCasa: ["", Validators.compose([Validators.required, Validators.min(1000000000), Validators.max(9999999999)])],
      telefonoOficina: ["", Validators.compose([Validators.min(1000000000), Validators.max(9999999999)])],
      telefonoCelular: ["", Validators.compose([Validators.min(1000000000), Validators.max(9999999999)])],
      peso: ["", Validators.compose([Validators.required, Validators.min(1.499), Validators.max(300)])],
      talla: ["", Validators.compose([Validators.required, Validators.min(25), Validators.max(280)])],
      indiceMasaCorporal: ["", Validators.compose([Validators.min(15), Validators.max(100)])],
      frecuenciaCardiaca: ["", Validators.compose([Validators.required, Validators.min(40), Validators.max(200)])],
      frecuenciaRespiratoria: ["", Validators.compose([Validators.required, Validators.min(10), Validators.max(100)])],
      tensionArterialSistole: ["", Validators.compose([Validators.required, Validators.min(40), Validators.max(200)])],
      tensionArterialDiastole: ["", Validators.compose([Validators.required, Validators.min(20), Validators.max(160)])],
      temperatura: ["", Validators.compose([Validators.required, Validators.min(36), Validators.max(42)])],
      sistemaDigestivo: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(2000), Validators.pattern(this.textPattern)])],
      estadoCivil: ["", Validators.compose([Validators.minLength(1), Validators.maxLength(12), Validators.pattern(this.textPattern)])],
      numHijos: ["", Validators.compose([Validators.min(0), Validators.max(10)])],
      maxGradoEstudios: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(50), Validators.pattern(this.textPattern)])],
      ocupacion: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(90), Validators.pattern(this.textPattern)])],
      religion: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(50), Validators.pattern(this.textPattern)])],
      sistemaMusculoEsqueletico: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(2000), Validators.pattern(this.textPattern)])],
      sistemaNeurologico: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(2000), Validators.pattern(this.textPattern)])],
      sistemaReproductor: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(2000), Validators.pattern(this.textPattern)])],
      sistemaRespiratorio: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(2000), Validators.pattern(this.textPattern)])],
      sistemasSentidos: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(2000), Validators.pattern(this.textPattern)])],
      sistemaTegumentario: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(2000), Validators.pattern(this.textPattern)])],
      sistemaUrinario: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(2000), Validators.pattern(this.textPattern)])],
      antecedentesFamiliares: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(2000), Validators.pattern(this.textPattern)])],
      antecedentesPersonalesNoPatologicos: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(2000), Validators.pattern(this.textPattern)])],
      antecedentesPersonalesPatologicos: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(2000), Validators.pattern(this.textPattern)])],
      procedimientoActual: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(2000), Validators.pattern(this.textPattern)])],
      auxiliaresDiagnostico: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(2000), Validators.pattern(this.textPattern)])],
     });
  }

  validarConsultaCrearFormulario(){ 
    this.consultaCrearForm = this.formBuilder.group({
      notaEvolucion: ["", Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(2000), Validators.pattern(this.textPattern)])],
      especialidad: ["", Validators.compose([,Validators.minLength(5), Validators.maxLength(30), Validators.pattern(this.textPattern)])],
      peso: ["", Validators.compose([Validators.required, Validators.min(1.499), Validators.max(300)])],
      talla: ["", Validators.compose([Validators.required, Validators.min(25), Validators.max(280)])],
      indiceMasaCorporal: ["", Validators.compose([Validators.required, Validators.min(15), Validators.max(100)])],
      frecuenciaCardiaca: ["", Validators.compose([Validators.required, Validators.min(40), Validators.max(200)])],
      frecuenciaRespiratoria: ["", Validators.compose([Validators.required, Validators.min(10), Validators.max(100)])],
      tensionArterialSistole: ["", Validators.compose([Validators.required, Validators.min(40), Validators.max(200)])],
      tensionArterialDiastole: ["", Validators.compose([Validators.required, Validators.min(20), Validators.max(160)])],
      temperatura: ["", Validators.compose([Validators.required, Validators.min(36), Validators.max(42)])],
      sexo: ["", Validators.compose([Validators.required])],
      subjetivo: ["", Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(4000), Validators.pattern(this.textPattern)])],
      objetivo: ["", Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(4000), Validators.pattern(this.textPattern)])],
      analisis: ["", Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(4000), Validators.pattern(this.textPattern)])],
      plan: ["", Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(4000), Validators.pattern(this.textPattern)])],
      clinicos: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(4000), Validators.pattern(this.textPattern)])],
      impresionDiagnostica: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(4000), Validators.pattern(this.textPattern)])],
      manejoRecomendaciones: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(4000), Validators.pattern(this.textPattern)])],
      tituloUno: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(200), Validators.pattern(this.textPattern)])],
      tituloDos: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(200), Validators.pattern(this.textPattern)])],
      tituloTres: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(200), Validators.pattern(this.textPattern)])],
      tituloCuatro: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(200), Validators.pattern(this.textPattern)])],
      notaUno: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(4000), Validators.pattern(this.textPattern)])],
      notaDos: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(4000), Validators.pattern(this.textPattern)])],
      notaTres: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(4000), Validators.pattern(this.textPattern)])],
      notaCuatro: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(4000), Validators.pattern(this.textPattern)])],
     });
  }

  validarUsuarioFormulario(){
    this.usuarioForm = this.formBuilder.group({
      nombre: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(90), Validators.pattern(this.firstNamePattern)])],
      primer_apellido: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(45), Validators.pattern(this.lastNamePattern)])],
      segundo_apellido: ["", Validators.compose([Validators.minLength(3), Validators.maxLength(45), Validators.pattern(this.lastNamePattern)])],
      telefono: ["", Validators.compose([Validators.required, Validators.min(1000000000), Validators.max(9999999999)])],
      sexo: ["", Validators.compose([Validators.required])],
      fecha_nacimiento: ["", Validators.compose([Validators.required,CustomValidators.minDate(this.minFechaNacimiento),CustomValidators.maxDate(this.maxDate)])],
      email: ["", Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(90), Validators.pattern(this.emailPattern)])],
      password: ["", Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(30), Validators.pattern(this.textPattern)])],
      password2: ["", Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(30), Validators.pattern(this.textPattern)])], });
  }


  validarQueryFormulario(){
    this.queryForm = this.formBuilder.group({
      query: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(90), Validators.pattern(this.textPattern)])], });
  }

  validarCitaFechaForm(){
    this.citaFechaForm = this.formBuilder.group({
      fecha_cita: ["", Validators.compose([Validators.required, CustomValidators.minDate(this.minDate2),CustomValidators.maxDate(this.maxDateCita)])], 
  },{validator: this.isSunday('fecha_cita')});
  }

  //funcion que detecta si la fecha es domingo
  isSunday(date: string) {
    console.log("entra validador -------------------------")
    return (group: FormGroup): { [key: string]: any } => {
      const inputFrom = group.controls[date];
      var newDate = new Date(inputFrom.value);
      if(newDate.getDay() == 6){
        if(!((this.sucursalSelecionada.Sucursal.nombreSucursal=="Clinica Integral")&&(this.estudio.domingos))){
          return { 
            inputFrom: ""
          }
        }
      }
      return {};
    }
  }

  purgarHorario(){
    this.listaHoras = [];
    this.hora_inicio = null;
    this. hora_final = null; 
    this.fechaSelecionada = null;
    this.horaFlag = false;
  }

  //selecciona todos los items de la lista de categorias
  selecionarTodos(){
    if(this.todosLista){
      var i, n = this.list.length;
      for (i = 0; i < n; ++i) {
        this.list[i].flag = false;
      }
    }
    else{
      var i, n = this.list.length;
      for (i = 0; i < n; ++i) {
        this.list[i].flag = true;
      }
    }
  }

  consultarCitas(){ 
    console.log("xxxxxxxxxxxxxxxxxxxx Consultar citas");
    console.log(this.fechaSelecionada);
    console.log(this.estudio.sala);
    console.log(this.sucursalSelecionada.Sucursal.nombreSucursal);
    console.log("xxxxxxxxxxxxxxxxxxxx")
    console.log(this.sala)
    console.log("xxxxxxxxxxxxxxxxxx Consultar citas");
    this.dataApiService.consultarCitas(this.fechaSelecionada,this.sala,this.sucursalSelecionada.Sucursal.nombreSucursal)
    .subscribe((
      data : CitaInterface) => { this.citas = data; 
      this.mensajeExito();
      console.log("Citas Cargadas")
      console.log(this.citas);
      this.horasDisponibles();
    }, error => this.mensajeError(error)  
    ); 
  }

  horasDisponibles(){
    console.log("horas Disponibles")
    var final;
    var inicio;
    var newDate = new Date(this.fechaSelecionada);
    var flag;
    var diaCita = new Date();
    this.isToday = false; 
    if((diaCita.getFullYear()==newDate.getFullYear())&&(diaCita.getMonth()==newDate.getMonth())&&(diaCita.getDate()==newDate.getDate()+1)){
      this.isToday =true;
    }
    console.log(newDate.getDay())
    if(newDate.getDay() == 5){
      console.log("sabado")
      this.apuntadorInicio = new Date(this.fechaSelecionada+"T"+this.sucursalSelecionada.Sucursal.hora_apertura_sab)
      console.log(this.apuntadorInicio)
      this.tmpApuntador = new Date(this.fechaSelecionada+"T"+this.sucursalSelecionada.Sucursal.hora_apertura_sab)
      this.apuntadorFinal = new Date(this.fechaSelecionada+"T"+this.sucursalSelecionada.Sucursal.hora_apertura)
      final = new Date(this.fechaSelecionada+"T"+this.sucursalSelecionada.Sucursal.hora_cierre_sab)
      inicio = new Date(this.fechaSelecionada+"T"+this.sucursalSelecionada.Sucursal.hora_apertura_sab)
    }else if(newDate.getDay() == 6){
      console.log("domingo")
      this.apuntadorInicio = new Date(this.fechaSelecionada+"T"+this.sucursalSelecionada.Sucursal.hora_apertura_dom)
      console.log(this.apuntadorInicio)
      this.tmpApuntador = new Date(this.fechaSelecionada+"T"+this.sucursalSelecionada.Sucursal.hora_apertura_dom)
      this.apuntadorFinal = new Date(this.fechaSelecionada+"T"+this.sucursalSelecionada.Sucursal.hora_apertura)
      final = new Date(this.fechaSelecionada+"T"+this.sucursalSelecionada.Sucursal.hora_cierre_dom)
      inicio = new Date(this.fechaSelecionada+"T"+this.sucursalSelecionada.Sucursal.hora_apertura_dom)
    }else{
      console.log("lun -vie")
      this.apuntadorInicio = new Date(this.fechaSelecionada+"T"+this.sucursalSelecionada.Sucursal.hora_apertura)
      console.log(this.apuntadorInicio)
      this.tmpApuntador = new Date(this.fechaSelecionada+"T"+this.sucursalSelecionada.Sucursal.hora_apertura)
      this.apuntadorFinal = new Date(this.fechaSelecionada+"T"+this.sucursalSelecionada.Sucursal.hora_apertura)
      final = new Date(this.fechaSelecionada+"T"+this.sucursalSelecionada.Sucursal.hora_cierre)
      inicio = new Date(this.fechaSelecionada+"T"+this.sucursalSelecionada.Sucursal.hora_apertura)
    }
    this.apuntadorInicio.setSeconds(this.apuntadorInicio.getSeconds() + 1 );
    console.log(this.apuntadorInicio)
    this.apuntadorFinal.setMinutes(this.apuntadorFinal.getMinutes() + this.tiempo );
    var i =0;
    this.listaHoras = [];
    diaCita.setHours(diaCita.getHours() + 1 );
    if(this.isToday&&(diaCita < final)||(diaCita > inicio)){
      console.log("ajuste de apuntador --------------------")
      this.apuntadorInicio  = new Date();
      this.apuntadorFinal  = new Date();
      this.apuntadorInicio.setHours(this.apuntadorInicio.getHours() + 1 );
      this.apuntadorFinal.setHours(this.apuntadorFinal.getHours() + 1 );
      this.apuntadorFinal.setMinutes(this.apuntadorFinal.getMinutes() + this.tiempo );
    }
    console.log("xxxxxxxxxxxxx")
    console.log(this.apuntadorInicio)
    console.log(this.apuntadorFinal)
    console.log(final)
    console.log("tiempo" +this.tiempo)
    console.log("xxxxxxxxxxxxx")
    while((this.apuntadorInicio < final) && (i<5000)){
      this.choque = false;
      this.checarColisiones();
      if(this.choque){
        this.apuntadorInicio = new Date(this.tmpApuntador);
        this.apuntadorFinal = new Date(this.tmpApuntador);
        //console.log("-------------- Prev")
        //console.log(this.tmpApuntador);
        //console.log(this.apuntadorInicio);
        //console.log(this.apuntadorFinal);
        //console.log("--------------")
        this.apuntadorInicio.setSeconds(this.apuntadorInicio.getSeconds() + 1 );
        this.apuntadorFinal.setMinutes(this.apuntadorFinal.getMinutes() + this.tiempo );
        //console.log("-------------- Post")
        //console.log(this.tmpApuntador); 
        //console.log(this.apuntadorInicio);
        //console.log(this.apuntadorFinal);
        //console.log("--------------")
        //this.apuntadorInicio.setMinutes(this.apuntadorInicio.getMinutes() + 30 );
        //this.apuntadorFinal.setMinutes(this.apuntadorFinal.getMinutes() + 30 );
      }else{
        //console.log("----------- no Colision");
        //console.log(this.apuntadorInicio);
        //console.log(this.apuntadorFinal);
        //console.log("-----------");
        //console.log("diaCita: " + diaCita)
        //console.log("inicio: " + this.apuntadorInicio)
        if(this.isToday){
          console.log("Hoy")
          if(diaCita < this.apuntadorInicio){
            if(this.apuntadorFinal < final){
              //console.log("-------------------")
              //console.log(this.apuntadorInicio)
              //console.log(this.apuntadorFinal)
              //console.log("---------------------------")
              this.listaHoras.push({"hora_inicio": this.apuntadorInicio.getHours()+":"+(this.apuntadorInicio.getMinutes() < 10 ? '0' : '') + this.apuntadorInicio.getMinutes() , "hora_final": this.apuntadorFinal.getHours()+":"+(this.apuntadorFinal.getMinutes() < 10 ? '0' : '') + this.apuntadorFinal.getMinutes()});
            }
          }
        }else{
          this.listaHoras.push({"hora_inicio": this.apuntadorInicio.getHours()+":"+(this.apuntadorInicio.getMinutes() < 10 ? '0' : '') + this.apuntadorInicio.getMinutes()  , "hora_final": this.apuntadorFinal.getHours()+":"+(this.apuntadorFinal.getMinutes() < 10 ? '0' : '') + this.apuntadorFinal.getMinutes()});
        }
        this.apuntadorInicio.setMinutes(this.apuntadorInicio.getMinutes() + this.tiempo );
        this.apuntadorFinal.setMinutes(this.apuntadorFinal.getMinutes() + this.tiempo );
      }
    i++;
    }
    console.log(this.listaHoras)
  }


  checarColisiones(){
    var citaInicio;
    var citaFinal;
    var flag;
    if(this.citas.count==0){
      this.choque = false;
    }else{
      flag = false;
      for(let results of this.citas.results){
        citaInicio = new Date(this.fechaSelecionada+"T"+results.hora_inicio)
        citaFinal = new Date(this.fechaSelecionada+"T"+results.hora_final)
        if(((citaInicio <= this.apuntadorInicio)&&(citaFinal <= this.apuntadorInicio)&&(citaInicio <= this.apuntadorFinal)&&(citaFinal <= this.apuntadorFinal))||((!(citaInicio <= this.apuntadorInicio))&&(!(citaFinal <= this.apuntadorInicio))&&(!(citaInicio <= this.apuntadorFinal))&&(!(citaFinal <= this.apuntadorFinal)))){
          //console.log()
        }else{
          flag= true;
          this.tmpApuntador = citaFinal;
        }
      }
      if(flag){
        this.choque = true;
      }else{
        this.choque = false;
      }
    }
  }

  asignarMooleanNumHijos(){
    if(this.historiaClinicaTmp.numHijos){
      if(this.historiaClinicaTmp.numHijos== '0'){
        this.historiaClinicaTmp.hijos = false;
      }else{
        this.historiaClinicaTmp.hijos = true;
      }
    }
  }

  // Rellena los datos de paciente
  rellenarPacienteCampos(){
    this.pacienteActualizar = this.paciente;
  }

  purgarEstudio(){
    this.resultadoTmp.tipoEstudio = null;
    this.resultadoTmp.fecha_realizacion = null;
    this.resultadoTmp.notasEstudio = null;
    this.estudioEstatus = 0;
  } 

  calcularIMC(){
    console.log("calculando IMC")
      if(this.historiaClinicaTmp.peso > 0 && this.historiaClinicaTmp.talla >0 ){
        this.historiaClinicaTmp.indiceMasaCorporal = this.historiaClinicaTmp.peso/((this.historiaClinicaTmp.talla /100)*(this.historiaClinicaTmp.talla /100));
        this.historiaClinicaTmp.indiceMasaCorporal = this.historiaClinicaTmp.indiceMasaCorporal.toFixed(2)
    }
  }

  calcularNotaIMC(){
    console.log("calculando IMC")
      if(this.notaTmp.peso > 0 && this.notaTmp.talla >0 ){
        this.notaTmp.indiceMasaCorporal = this.notaTmp.peso/((this.notaTmp.talla /100)*(this.notaTmp.talla /100));
        this.notaTmp.indiceMasaCorporal = this.notaTmp.indiceMasaCorporal.toFixed(2)
    }
  }

  
  // Rellena los datos de paciente 
  rellenarHistoriaCampos(){ 
    // @ts-ignore
    this.historiaClinicaTmp = this.historiaClinica;
    //rellena campos de paciente si no existen en la historia clinica
    if(this.paciente.entidad_nacimiento && !this.historiaClinica.entidad_nacimiento)
    {
      this.historiaClinica.entidad_nacimiento = this.paciente.entidad_nacimiento
    }
    if(this.paciente.estado && !this.historiaClinica.estado)
    {
      this.historiaClinica.estado = this.paciente.estado
    }
    if(this.paciente.localidad && !this.historiaClinica.localidad)
    {
      this.historiaClinica.localidad = this.paciente.localidad
    }
    if(this.paciente.ocupacion && !this.historiaClinica.ocupacion)
    {
      this.historiaClinica.ocupacion = this.paciente.ocupacion
    }
    if(this.paciente.religion && !this.historiaClinica.religion)
    {
      this.historiaClinica.religion = this.paciente.religion
    }
    if(this.paciente.sexo && !this.historiaClinica.sexo)
    {
      this.historiaClinica.sexo = this.paciente.sexo
    }
    if(this.paciente.telefonoCasa && !this.historiaClinica.telefonoCasa)
    {
      this.historiaClinica.telefonoCasa = this.paciente.telefonoCasa
    }
    if(this.paciente.telefonoCelular && !this.historiaClinica.telefonoCelular)
    {
      this.historiaClinica.telefonoCelular = this.paciente.telefonoCelular
    }
    if(this.paciente.telefonoOficina && !this.historiaClinica.telefonoOficina)
    {
      this.historiaClinica.telefonoOficina = this.paciente.telefonoOficina
    }   
    console.log("rellenando")
    //this.calcularIMC(); 
  }

  // Rellena los datos de paciente 
  rellenarHistoriaCamposNueva(){ 
    //rellena campos de paciente si no existen en la historia clinica
    // @ts-ignore
    this.historiaClinicaTmp = this.paciente
    console.log(this.paciente)
    console.log(this.historiaClinicaTmp) 
  }

  // Actualizar Paciente
  actualizarPaciente(){
    this.spinner.show();
    this.dataApiService.actualizarPacienteMedico(this.pacienteActualizar)
    .subscribe(() => {  
      this.consultarExpedientes();
      console.log("Actualizando Paciente"+ this.paciente.id); 
      this.mensajeExito();
      this.spinner.hide();
      this.paciente = this.pacienteActualizar
    }, error => this.mensajeError(error)  
    ); 
  }

  validarTipoInterrogatorio(){
    if(this.historiaClinicaTmp.tipoInterrogatorio == 'DIRECTO'){
        this.historiaClinicaTmp.informador = "No aplica";
        this.interrogatorioFlag = true;
        console.log("validacion true")
    }else{
      this.interrogatorioFlag = false;
      this.historiaClinicaTmp.informador = "";
      console.log("validacion false")
    }
    
  }


  ngOnInit() {
    this.userAPI = this.authService.getCurrentUser();
    window.scroll(0,0);
    this.spinner.show();
    this.validarQueryFormulario();
    this.validarPacienteFormulario();
    this.validarHistoriaCrearFormulario();
    this.validarConsultaCrearFormulario();
    this.validarEstudioSubirFormulario();
    this.validarUsuarioFormulario();
    this.validarCitaFechaForm();
    this.listaPacientes();
    this.listaPacientesSemin();
    this.listaEstudios();
    this.listaHistorias();
    this.listaNotas();
    this.consultarMedico();
  }

  download() {
    let paciente
    paciente = this.userAPI.first_name+" "+this.userAPI.last_name
    const url = 'https://semindigital.com:8090' + this.resultado.file;    
    const name = this.resultado.tipoEstudio +" "+ this.resultado.creacion.split('T')[0] +" "+ paciente;
    FileSaver.saveAs(url, name);
  }

  downloadDicom() {
    let paciente
    paciente = this.userAPI.first_name+" "+this.userAPI.last_name
    const url = 'https://semindigital.com:8090' + this.resultado.fileDicom;    
    const name = this.resultado.tipoEstudio +" "+ this.resultado.creacion.split('T')[0] +" "+ paciente;
    FileSaver.saveAs(url, name);
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
  consultarResultados(){
    this.resultados ={};
    this.spinner.show();
    console.log(this.paciente.id)
    //la tabla nececita reiniciarse al eliminar un item
    $("#listaEstudios").dataTable().fnDestroy();
    this.dataApiService.consultarResultadosMedico(this.paciente.id)
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
 
  purgarNuevaNota(){
    this.categoriaNuevaSeleccionada = 0;
    this.categoriaMedicoSeleccionada = 0;
    this.flagPrevias=0;
  }

  consultarPreviasNotasMedico(){
    this.spinner.show(); 
    this.flagPrevias = 0;
    this.ultimaConsultaPrev = "";
    this.notaTmp = {}
    console.log(this.paciente.id)
    this.dataApiService.consultarNotasMedico(this.paciente.id, this.listasCategorias[this.categoriaMedicoSeleccionada],null,2)
    .subscribe((
      data : NotaInterface) => { this.notasPrev = data; 
      console.log("Notas Previas Cargados")
      console.log(this.notasPrev)
      this.spinner.hide();
      if(this.notasPrev){
        // @ts-ignore
        if(this.notasPrev.count == 0){
          this.flagPrevias=1; 
          this.notaTmp.notaEvolucion = "No aplica"
        }
        if(this.notasPrev.count > 0){
          this.flagPrevias=2;
          // @ts-ignore
          this.ultimaConsultaPrev = this.notasPrev.results[0].creacion;
          this.notaTmp = this.notasPrev.results[0]
          this.notaTmp.notaEvolucion = ""
          //this.notaTmp.especialidad = this.listasCategorias[this.categoriaMedicoSeleccionada];
          console.log(this.ultimaConsultaPrev)
          console.log(this.notaTmp)
        }
      }
    }, error => this.mensajeError(error)  
    ); 
  }


  // funcion para listado de todas las historias clinicas
  consultarHistoriasClinicasMedico(){
    this.spinner.show();
    console.log("entra historia")
    this.historiaVacia = 0;
    this.historiaCaducidad = 0;
    this.historiasClinica = {};
    this.historiaClinica = {};
    //la tabla nececita reiniciarse al eliminar un item
    $("#listaHistorias").dataTable().fnDestroy();
    this.dataApiService.consultarHistoriasClinicasMedico(this.paciente.id)
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
        // @ts-ignore
        if(this.historiasClinica.count == 0){
          this.historiaVacia = 1;
        }
      }
      // @ts-ignore
      if(this.historiasClinica.count > 0){
        //Suma un año a la fecha de la ultima historia y la compara con la fecha actual para identificar caducidad
        const tmpDate = new Date(Date.now());
        const fechaActual = new Date( tmpDate).getTime() / 1000
        const tmpDate2 = new Date(this.historiaClinica.creacion.split('T')[0]);
        const tmpDate3 = tmpDate2.setMonth(tmpDate2.getMonth() + 12);
        const fechaHistoria = new Date(tmpDate3).getTime() / 1000
        console.log(fechaActual)
        console.log(fechaHistoria)
        if(fechaHistoria > fechaActual){
          console.log("aun no caduca")
        }else{
          console.log("Caduca")
          this.historiaCaducidad=1
        }
      }
      //la tabla nececita reiniciarse al eliminar un item
      $("#listaHistorias").dataTable().fnDestroy();
    }, error => this.mensajeError(error)  
    ); 
  }


  // funcion para listado de todas las consultas de un paciente
  consultarNotasMedico(){
    this.spinner.show();
    //es llamado para confirmar que el usuario tiene una historia clinica valida
    this.consultarHistoriasClinicasMedico();
    this.notaVacia = 0;
    this.ultimaConsulta = "";
    console.log(this.paciente.id)
    //la tabla nececita reiniciarse al eliminar un item
    $("#listaEstudios").dataTable().fnDestroy();
    console.log(this.listasCategorias[this.categoriaSeleccionada]);
    console.log(this.listasFechas[this.fechaSeleccionada]);
    this.dataApiService.consultarNotasMedico(this.paciente.id, this.listasCategorias[this.categoriaSeleccionada],this.listasFechas[this.fechaSeleccionada],this.consultaSeleccionada)
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


  reiniciarListaHistoria(){
    this.listaHistorias();
  }

  crearHistoria(){
    console.log(this.historiaClinicaTmp)
    let operador = this.userAPI.first_name+" "+this.userAPI.last_name
    this.historiaClinicaTmp.creador = operador
    this.historiaClinicaTmp.editor = operador
    this.historiaClinicaTmp.Paciente = this.paciente.id
    this.spinner.show();  
    this.dataApiService.crearHistoriaMed(this.historiaClinicaTmp)
    .subscribe(() => {  
      console.log("Creando Historia"); 
      this.mensajeExito();
      this.consultarHistoriasClinicasMedico();
    }, error => this.mensajeError(error)  
    ); 
  }

  //crear Nota medico
  crearNota(){
    console.log(this.notaTmp)
    let operador = this.userAPI.first_name+" "+this.userAPI.last_name
    this.notaTmp.creador = operador
    this.notaTmp.editor = operador
    this.notaTmp.Paciente = this.paciente.id
    this.notaTmp.especialidad = this.listasCategorias[this.categoriaMedicoSeleccionada]
    this.notaTmp.Medico = this.userAPI.id_sem
    this.spinner.show();  
    this.dataApiService.crearNotaMed(this.notaTmp)
    .subscribe(() => {  
      console.log("Creando Nota"); 
      this.mensajeExito();
      this.consultarNotasMedico();
    }, error => this.mensajeError(error)  
    ); 
  }

  consultarDisponibilidadEmail(){
    this.consultarMedicoExistentes();
    this.consultarPacienteExistentes();
  }

  purgarRegistro(){ 
    console.log("purgando")
    this.medicoExisteFlag = 0;
    this.pacienteExisteFlag = 0;
    this.userCrear ={};
    this.pacienteCrear ={}
    this.flag = false;
    this.exito = false;
    this.err =false;
    this.validarUsuarioFormulario();
  }
 
  // funcion para busqueda de un medico mediante su email
  consultarMedicoExistentes(){    
    this.medicoExisteFlag = 0
    this.dataApiService.consultarEmailMedico(this.userCrear.email)
    .subscribe((
      data : MedicoInterface) => { this.medicoSearch = data; 
      console.log("Medico Cargado")
      console.log(this.medicoSearch);
      if(this.medicoSearch){
        // @ts-ignore
        if(this.medicoSearch[0]){
          console.log("Existe Medico")
          this.medicoExisteFlag=1;
          this.medicoSearch = {}
        }
        else{
          console.log("No Existe Medico")
          this.medicoSearch = {}
        }
      }
    }, error => this.mensajeError(error)  
    ); 
  }


  // funcion para busqueda de un medico mediante su email
  consultarPacienteExistentes(){    
    this.pacienteExisteFlag = 0
    this.dataApiService.consultarEmailPaciente(this.userCrear.email)
    .subscribe((
      data : PacienteInterface) => { this.pacienteSearch = data; 
      console.log("Paciente Cargado")
      console.log(this.pacienteSearch);
      if(this.pacienteSearch){
        // @ts-ignore
        if(this.pacienteSearch[0]){
          console.log("Existe Paciente")
          this.pacienteExisteFlag=1;
          this.pacienteSearch = {}
        }
        else{
          console.log("No Existe Paciente")
          this.pacienteSearch = {}
        }
      }
    }, error => this.mensajeError(error)  
    ); 
  }

    // Actualizar facturacion de Paciente 
  registerUser(){
    this.token = this.authService.getToken();
    this.spinner.show();
    this.procesando = true;
    this.flag = true;
    this.authService.registerUser(this.userCrear.password, this.userCrear.password2, this.userCrear.email)
    .subscribe((
      data : UserInterface) => { this.userCrearTemp = data;
      console.log(this.userCrear)
      console.log("Registro")
      this.flag = true;
      this.pacienteLogin();
    }, error => this.mensajeErrorCrearPaciente(error)
      ); 
  }

  //función para login al sistema
  pacienteLogin(){
    this.spinner.show();
    this.procesando=true
    console.log(this.userCrear)
      return this.authService.loginuser(this.userCrear.email, this.userCrear.password)
      .subscribe(
        data =>{
          this.authService.setToken(data.key);
          console.log("login exitoso")
          this.crearPaciente()
      }, error => this.mensajeErrorCrearPaciente(error)
      );
  }

  // Crear Paciente
  crearPaciente(){
    this.spinner.show();
    this.dataApiService.crearPaciente(this.userCrear.first_name,this.userCrear.first_last_name, this.userCrear.second_last_name, this.userCrear.fecha_nacimiento, this.userCrear.sexo, this.userCrear.email, this.userCrear.telefono)
    .subscribe((
      data : PacienteInterface) => { this.pacienteCrear = data;
      console.log("Paciente creado");
      this.permisoPaciente();
    }, error => this.mensajeErrorCrearPaciente(error)
      );
  }

  // funcion para otrorgar permisos de edicion a un paciente
  permisoPaciente(){
    this.spinner.show();
    console.log("permisos paciente");
    this.dataApiService.permisoPaciente(this.pacienteCrear.id)
    .subscribe(() => { 
      this.actualizarPerfilPaciente();
      console.log("Actualizar permisos de Paciente"+ this.pacienteCrear.id); 
      this.mensajeExito();
    }, error => this.mensajeErrorCrearPaciente(error)
    ); 
  }

  
  actualizarPerfilPaciente(){
    this.spinner.show();
    console.log("actualizar perfil")
    this.dataApiService.actualizarPerfilPaciente(this.pacienteCrear.id)
    .subscribe(() => { 
      console.log("Actualizar perfil de Paciente"+ this.pacienteCrear.id); 
      this.enviarInvitacion();
    }, error => this.mensajeErrorCrearPaciente(error)
    ); 
  }

  
  enviarInvitacion(){
    this.tablaPermisosCrear = {}
    this.tablaPermisosCrear.caducidad=new Date(this.maxDateToken).getFullYear() + "-" + (new Date(this.maxDateToken).getMonth()+1) + "-" + new Date(this.maxDateToken).getDate();
    this.tablaPermisosCrear.Paciente = this.pacienteCrear.id
    this.tablaPermisosCrear.creador = this.userAPI.first_name+" "+this.userAPI.last_name
    this.tablaPermisosCrear.editor = this.userAPI.first_name+" "+this.userAPI.last_name
    this.tablaPermisosCrear.tipo = "INTERNO"
    this.tablaPermisosCrear.Medico = this.userAPI.id_sem
    console.log(this.tablaPermisosCrear)
    this.spinner.show();
    this.dataApiService.crearTablaPermisoPac(this.tablaPermisosCrear)
          .subscribe(() => {  
          console.log("Crear Tabla"); 
          this.mensajeExito();
          this.flag = true;
          this.exito = true;
          this.authService.setToken(this.token);
          this.spinner.hide();
        }, error => this.mensajeErrorCrearPaciente(error)
        ); 
  }


  mensajeErrorCrearPaciente(error){
    this.authService.setToken(this.token);
    this.err =true;
    this.spinner.hide();
    this.ngxNotificationService.sendMessage('Ha ocurrido un error ', 'danger ', 'bottom-right');
    this.msgError = error.error.message
    console.log(error);
    if(error.error.message){
      this.msgError = error.error.message;
    }
    if(error.error.email){
      this.msgError =  error.error.email;
    }
    if(error.error.non_field_errors){
      this.msgError =  error.error.non_field_errors;
    }
    if(error.error.password1){
      this.msgError =  error.error.password1;
    }
    console.log(this.msgError);
    this.err = true;
  }

  //funcion que maneja la table en jquery de Historias
  listaHistorias(){
    $(document).ready(function() {
      $('#listaHistorias').DataTable( {
        "language": {
          "sProcessing":     "Procesando...",
          "sLengthMenu":     "Mostrar _MENU_ Historias",
          "sZeroRecords":    "No se encontraron resultados",
          "sEmptyTable":     "Ningún dato disponible en esta tabla",
          "sInfo":           "Mostrando Historias del _START_ al _END_ de un total de _TOTAL_ Historias",
          "sInfoEmpty":      "Mostrando Historias del 0 al 0 de un total de 0 registros",
          "sInfoFiltered":   "(filtrado de un total de _MAX_ Historias)",
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



  //funcion que maneja la table en jquery de pacientes
  listaPacientes(){
    $(document).ready(function() {
      $('#listaPacientes').DataTable( {
        "language": {
          "sProcessing":     "Procesando...",
          "sLengthMenu":     "Mostrar _MENU_ Pacientes",
          "sZeroRecords":    "No se encontraron resultados",
          "sEmptyTable":     "Ningún dato disponible en esta tabla",
          "sInfo":           "Mostrando Pacientes del _START_ al _END_ de un total de _TOTAL_ Pacientes",
          "sInfoEmpty":      "Mostrando Pacientes del 0 al 0 de un total de 0 registros",
          "sInfoFiltered":   "(filtrado de un total de _MAX_ Pacientes)",
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


  //funcion que maneja la table en jquery de pacientes
  listaPacientesSemin(){
    $(document).ready(function() {
      $('#listaPacientesSemin').DataTable( {
        "language": {
          "sProcessing":     "Procesando...",
          "sLengthMenu":     "Mostrar _MENU_ Pacientes",
          "sZeroRecords":    "No se encontraron resultados",
          "sEmptyTable":     "Ningún dato disponible en esta tabla",
          "sInfo":           "Mostrando Pacientes del _START_ al _END_ de un total de _TOTAL_ Pacientes",
          "sInfoEmpty":      "Mostrando Pacientes del 0 al 0 de un total de 0 registros",
          "sInfoFiltered":   "(filtrado de un total de _MAX_ Pacientes)",
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

}
