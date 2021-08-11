import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxNotificationService } from 'ngx-notification';
import { NgxSpinnerService } from "ngx-spinner";
import { CustomValidators } from 'ngx-custom-validators';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap'; 
import * as moment from 'moment'

import { DataApiService } from "../../services/data-api.service";
import { AuthService } from "../../services/auth.service";

import { DisponibilidadInterface } from "../../models/disponibilidad-interface";
import { PacienteInterface } from "../../models/paciente-interface"; 
import { CitaInterface } from "../../models/cita-interface";
import { UserInterface } from "../../models/user-interface";
import { EstudioInterface } from "../../models/estudio-interface";
import { TiempoInterface } from "../../models/tiempo-interface";
import { FacturacionInterface } from "../../models/facturacion-interface";
import { EmpleadoInterface } from "../../models/empleado-interface"; 
import { CallInterface } from "../../models/call-interface"; 
import { MedicoInterface } from "../../models/medico-interface";
import { ComentariosInterface } from "../../models/comentarios-interface";
import { EstudioEmpresaInterface } from "../../models/estudioEmpresa-interface";
import { EmpresaInterface } from "../../models/empresa-interface";
import { QuejasSugerenciasInterface } from "../../models/quejasSugerencias-interface";

declare var $: any;
declare var require: any
const FileSaver = require('file-saver');


@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css']
})
export class CitasComponent implements OnInit { 
  title = 'easyfullcalendar';

  citaReagendarForm: FormGroup; 
  citaEditarForm: FormGroup; 
  citaCrearFormulario: FormGroup; 
  queryForm: FormGroup;
  FacturacionCrearForm: FormGroup;
  LlamadaCrearForm: FormGroup;
  facturaEstatusForm: FormGroup;
  PacienteCrearForm: FormGroup;
  comentarioForm: FormGroup;
  quejasSugerenciasForm: FormGroup;
  editarQuejasSugerenciasForm: FormGroup;
  editarComentarioNotaForm: FormGroup;
  estudioEmpresaForm: FormGroup;
  pacienteBuscarForm: FormGroup;

  constructor(
    private authService: AuthService,
    private ngxNotificationService: NgxNotificationService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private dataApiService: DataApiService,
    private formBuilder: FormBuilder
    ) { }

  query; 
  // valores temporal 
  tmpDate = new Date(Date.now());
  tmpDate2 = new Date(Date.now());
  tmpDate3 = new Date(Date.now());
  tmpDate4 = new Date(Date.now());
  tmpDate5 = new Date(Date.now());
  // toma la fecha actual y suma 6 meses
  maxDate = this.tmpDate.setMonth(this.tmpDate.getMonth() + 6);
  // toma la fecha actual y resta 1 dia
  minDate = this.tmpDate2.setDate(this.tmpDate2.getDate() -1);
  minDateComent = this.tmpDate4.setDate(this.tmpDate2.getDate() -30);
  // Fecha minima de nacimiento (120 años)
  minFechaNacimiento = new Date("1900/01/01");
  sucursalSeleccionada = 0;
  sucursalSeleccionadaTemp = 0;
  estatusSeleccionado = 0;
  estatusRemSeleccionado = 0;
  estatusFacSeleccionado = 0;
  salaSeleccionada = 0;
  salaSeleccionadaTemp = 0;
  disponibilidad: DisponibilidadInterface ={};
  disponibilidadTemp: DisponibilidadInterface ={};
  citas: CitaInterface ={};
  empleado: EmpleadoInterface={};
  citasList: CitaInterface ={};
  citasExt: CitaInterface ={};
  citasAbi: CitaInterface ={};
  citasRem: CitaInterface ={};
  facturacion: FacturacionInterface ={};
  factura: FacturacionInterface ={};
  facturaTmp: FacturacionInterface ={};
  comentarios: ComentariosInterface ={};
  comentario: ComentariosInterface ={};
  comentarioTmp: ComentariosInterface ={};
  empresa: EmpresaInterface ={};
  empresas: EmpresaInterface ={};
  estudioEmpresa: EstudioEmpresaInterface ={};
  estudioEmpresas: EstudioEmpresaInterface ={};
  estudioEmpresaTmp: EstudioEmpresaInterface ={};
  quejaSugerencia: QuejasSugerenciasInterface ={};
  quejasSugerencias: QuejasSugerenciasInterface ={};
  quejasSugerenciasTmp: QuejasSugerenciasInterface ={};
  citaTmp: CitaInterface ={};
  userAPI: UserInterface = {};
  pacientes: PacienteInterface={};
  paciente: PacienteInterface={};
  PacienteCrearTmp: PacienteInterface={};
  pacientesSearch: PacienteInterface={};
  pacienteSearch: PacienteInterface={};
  estudio: EstudioInterface ={};
  estudios: EstudioInterface={};
  tiempo: TiempoInterface ={};
  tiempos: TiempoInterface ={};
  calls: CallInterface ={};
  call: CallInterface ={};
  callTmp: CallInterface ={};
  pacienteFlag = 0;
  medicoFlag = 0;
  userCrear: UserInterface = {};
  userCrearTemp: UserInterface = {};
  medicoSearch: MedicoInterface = {};
  pacienteSearchName: PacienteInterface ={};



  calidadFlag = 0;
  notasTmp = null;
  idCita = null;
  idEst = null;
  numCita = null;
  tipoCita = null;
  edad = null;
  edadMeses = null;
  editable = false;
  nombrePaciente = null; 
  IdPacienteEstudio = null; 
  IdEmpresa = null; 
  todosLista = true; 
  initialFlag =false;
  citaRestringida =false;
  newCalendar = 0;
  msgError = 'No es posible agendar la cita';
  hora_inicioTmp = null;
  citaEstatus = 0;
  facturaEstatus = 0;
  facturaFlag= true;
  estudioEstatus = 0
  pacienteBuscar = null;

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

  //Patrón para identificar un texto sin caracteres especialees
  textPattern: any=/^[^<>%$|&*;]*$/

  //Patrón para identificar un rfc
  rfcPattern: any=/^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/     

  //Patrón para identificar un correo.
  emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  //Patrón para identificar un nombre
  firstNamePattern: any = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/

  //Patrón para identificar un apellido 
  lastNamePattern: any = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/

  //Patrón para identificar un nombre
  firstNameUperPattern: any = /^[A-ZÀ-ÿ\u00f1\u00d1]+(\s*[A-ZÀ-ÿ\u00f1\u00d1]*)*[A-ZÀ-ÿ\u00f1\u00d1]+$/

  //Patrón para identificar un apellido 
  lastNameUperPattern: any = /^[A-ZÀ-ÿ\u00f1\u00d1]+(\s*[A-ZÀ-ÿ\u00f1\u00d1]*)*[A-ZÀ-ÿ\u00f1\u00d1]+$/

  listaSucursales = ["Null","Cholula","13 Sur","5 de Mayo","Xonaca","11 Sur","Chapultepec","Cruz del Sur","San Alejandro","La Margarita","24 Sur","16 de Septiembre","Clinica Integral","Amozoc"]


  //detecta el enter en la barra del buscador
  onKeydown(event) {
    if (event.key === "Enter") {
      console.log(event);
      this.consultarEstudio();
    }
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.estudioEmpresaForm.get('file').setValue(file);
    }
  }

    //Crear resultado
    //front
    subirEstudioEmpresaOp(){
      this.spinner.show();
      this.estudioEstatus = 1;
      let operador
      operador = this.userAPI.first_name+" "+this.userAPI.last_name
      const formData = new FormData();
      formData.append('file', this.estudioEmpresaForm.get('file').value);
      formData.append('usuario', this.estudioEmpresaForm.get('usuario').value);
      formData.append('password', this.estudioEmpresaForm.get('password').value);
      formData.append('solicitud', this.estudioEmpresaForm.get('solicitud').value);
      formData.append('categoria', this.estudioEmpresaForm.get('categoria').value);
      formData.append('nombreEstudio', this.estudioEmpresaForm.get('nombreEstudio').value);
      formData.append('Paciente', this.IdPacienteEstudio); 
      formData.append('creador', operador);
      formData.append('editor', operador);
      if(this.IdEmpresa){
        formData.append('Empresa', this.IdEmpresa);
      }
      if(this.estudioEmpresaForm.get('caducidad').value){
        formData.append('caducidad', this.estudioEmpresaForm.get('caducidad').value);
      }
      console.log("valores")
      console.log(this.IdPacienteEstudio)
      console.log(this.IdEmpresa)
      this.dataApiService.crearResultadoEmpresaOp(formData)
      .subscribe(() => {  
        console.log("Creando Resultado"); 
        this.mensajeExito();
        this.spinner.hide();
        this.estudioEstatus = 2;
        //la tabla nececita reiniciarse al eliminar un item
        $("#listaEmp").dataTable().fnDestroy();
      }, error => this.mensajeError(error)  
      ); 
    }
  
  // Aqui se definen las reglas que seguirá cada cita reagenda
  validarCitaCrearFormulario(){
    this.citaCrearFormulario = this.formBuilder.group({
      fecha_cita: ["", Validators.compose([Validators.required, CustomValidators.minDate(this.minDate),CustomValidators.maxDate(this.maxDate)])],
      hora_inicio: ["", Validators.compose([Validators.required])],
      hora_final: ["", Validators.compose([Validators.required])],
      prueba: ["", Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(500), Validators.pattern(this.textPattern)])],
      categoria: ["", Validators.compose([Validators.required])],
      precioVenta: ["", Validators.compose([Validators.required, Validators.min(0), Validators.max(99999)])],
      paciente: ["", ],
      citaRestringida: ["", ],
      notas: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(500),Validators.pattern(this.textPattern)])],
    },{validator: this.dateLessThan('hora_inicio', 'hora_final')});
  }

  // Aqui se definen las reglas que seguirá cada cita creada
  ValidarcitaReagendarForm(){
    this.citaReagendarForm = this.formBuilder.group({
      fecha_cita: ["", Validators.compose([Validators.required, CustomValidators.minDate(this.minDate),CustomValidators.maxDate(this.maxDate)])],
      hora_inicio: ["", Validators.compose([Validators.required])],
      hora_final: ["", Validators.compose([Validators.required])],
      notas: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(500),Validators.pattern(this.textPattern)])],
    },{validator: this.dateLessThan('hora_inicio', 'hora_final')});
  }

  copyText(val: string){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  copyName(){
    let nombre
    if(this.factura.apellido_materno){
      nombre = this.factura.nombre + " " + this.factura.apellido_paterno + " " + this.factura.apellido_materno
    }else{
      nombre = this.factura.nombre + " " + this.factura.apellido_paterno
    }
    this.copyText(nombre);
  }
  
  // Aqui se definen las reglas que seguirá cada cita creada
  ValidarFacturacionCrearForm(){
    this.FacturacionCrearForm = this.formBuilder.group({
      empresa: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(90), Validators.pattern(this.textPattern)])],
      sucursal: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(90), Validators.pattern(this.textPattern)])],
      factura_estatus: ["", Validators.compose([])],
      nombre: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(90), Validators.pattern(this.textPattern)])],
      apellido_paterno: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(45), Validators.pattern(this.textPattern)])],
      apellido_materno: ["", Validators.compose([Validators.minLength(3), Validators.maxLength(45), Validators.pattern(this.textPattern)])],
      rfc: ["", Validators.compose([Validators.required,Validators.minLength(12),Validators.maxLength(13), Validators.pattern(this.textPattern)])],
      cantidad_pagada: ["", Validators.compose([Validators.required, Validators.min(0.09), Validators.max(999999999)])],
      telefono: ["", Validators.compose([Validators.required,Validators.min(1000000000), Validators.max(9999999999)])],
      email: ["", Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(40), Validators.pattern(this.textPattern)])],
      cfdi_uso: ["", Validators.compose([Validators.required])], 
      forma_pago: ["", Validators.compose([Validators.required])], 
      metodo_pago: ["", Validators.compose([Validators.required])], 
      descripcion: ["", Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(1000), Validators.pattern(this.textPattern)])],
      nombre_paciente: ["", Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(150), Validators.pattern(this.textPattern)])],
      num_expediente: ["", Validators.compose([Validators.required, Validators.min(0), Validators.max(999999)])],
      num_folio: ["", Validators.compose([Validators.required, Validators.min(0), Validators.max(99999)])],
      estudios_realizados: ["", Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(1000), Validators.pattern(this.textPattern)])],
      observaciones: ["", Validators.compose([Validators.maxLength(1000), Validators.pattern(this.textPattern)])] 
    });
  }

  
  ValidarLlamadaCrearForm(){
    this.LlamadaCrearForm = this.formBuilder.group({
      tipo: ["", Validators.compose([Validators.required])],
      telefono: ["", Validators.compose([Validators.required,Validators.min(1000000000), Validators.max(9999999999)])],
      interes: ["", Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(500), Validators.pattern(this.textPattern)])],
      nombre: ["", Validators.compose([Validators.minLength(3), Validators.maxLength(90), Validators.pattern(this.textPattern)])],
      apellido_paterno: ["", Validators.compose([Validators.minLength(3), Validators.maxLength(45), Validators.pattern(this.textPattern)])],
      apellido_materno: ["", Validators.compose([Validators.minLength(3), Validators.maxLength(45), Validators.pattern(this.textPattern)])],
      email: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(40), Validators.pattern(this.emailPattern)])], 
      fecha_nacimiento: ["", Validators.compose([CustomValidators.minDate(this.minFechaNacimiento),CustomValidators.maxDate(this.tmpDate3)])],
      experiencia: ["", Validators.compose([Validators.minLength(3), Validators.maxLength(2000), Validators.pattern(this.textPattern)])],
    });
  }


  

  
  ValidarComentarioForm(){
    this.comentarioForm = this.formBuilder.group({
      sucursal: ["", Validators.compose([Validators.minLength(3), Validators.maxLength(40), Validators.pattern(this.textPattern)])],
      fecha: ["", Validators.compose([Validators.required, CustomValidators.minDate(this.minDateComent),CustomValidators.maxDate(this.tmpDate3)])],
      hora: ["", Validators.compose([Validators.required])],
      num_recibo: ["", Validators.compose([Validators.min(1), Validators.max(999999)])],
      nombre_paciente: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(this.textPattern)])],
      telefono: ["", Validators.compose([Validators.min(1000000000), Validators.max(9999999999)])],
      email: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(40), Validators.pattern(this.emailPattern)])],
      estudios_solicitados: ["", Validators.compose([Validators.minLength(3), Validators.maxLength(300), Validators.pattern(this.textPattern)])],
      como_entero: ["", Validators.compose([Validators.minLength(3), Validators.maxLength(20), Validators.pattern(this.textPattern)])],
      tipo_opinion: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(this.textPattern)])],
      nombre_personal: ["", Validators.compose([Validators.minLength(3), Validators.maxLength(100), Validators.pattern(this.textPattern)])],
      comentarios: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(300), Validators.pattern(this.textPattern)])],
      notas: ["", Validators.compose([Validators.minLength(3), Validators.maxLength(500), Validators.pattern(this.textPattern)])],
    });
  }

  ValidarEstudioEmpresaForm(){
    this.estudioEmpresaForm = this.formBuilder.group({
      usuario: ["", Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(14), Validators.pattern(this.textPattern)])],
      password: ["", Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(14), Validators.pattern(this.textPattern)])],
      solicitud: ["", Validators.compose([Validators.required, Validators.min(1), Validators.max(999)])],
      categoria: ["", Validators.compose([Validators.required, Validators.minLength(12), Validators.maxLength(45), Validators.pattern(this.textPattern)])],
      nombreEstudio: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(1000), Validators.pattern(this.textPattern)])],
      caducidad: ["", Validators.compose([CustomValidators.minDate(this.tmpDate5)])],
      Paciente: ["", Validators.compose([Validators.required])],
      Empresa: ["", Validators.compose([])],
      file: ["", Validators.compose([Validators.required])],
    });
  }

  ValidarPacienteBuscarForm(){
    this.pacienteBuscarForm = this.formBuilder.group({
      nombre: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern(this.firstNamePattern)])],
    });
  }

  ValidarQuejasSugerenciasForm(){
    this.quejasSugerenciasForm = this.formBuilder.group({
      folio: ["", Validators.compose([Validators.min(1), Validators.max(999999)])],
      tipo: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(this.textPattern)])],
      fecha_evento: ["", Validators.compose([Validators.required, CustomValidators.minDate(this.minDateComent),CustomValidators.maxDate(this.tmpDate3)])],
      fecha_recibo: ["", Validators.compose([Validators.required, CustomValidators.minDate(this.minDateComent),CustomValidators.maxDate(this.tmpDate3)])],
      hora_evento: ["", Validators.compose([Validators.required])],
      sucursal: ["", Validators.compose([Validators.minLength(3), Validators.maxLength(40), Validators.pattern(this.textPattern)])],
      tipo_recibo: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern(this.textPattern)])],
      nombre_presentante: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(this.textPattern)])],
      telefono: ["", Validators.compose([Validators.min(1000000000), Validators.max(9999999999)])],
      email: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(40), Validators.pattern(this.emailPattern)])],
      descripcion: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(300), Validators.pattern(this.textPattern)])],
      nombre_personal: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(this.textPattern)])],
      puesto_personal: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40), Validators.pattern(this.textPattern)])],
      notas: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(500), Validators.pattern(this.textPattern)])],
    });
  }

 
  ValidarQuejasSugerenciasSupervisorForm(){
    this.editarQuejasSugerenciasForm = this.formBuilder.group({
      nombre_encargado: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(this.textPattern)])],
      puesto_encargado: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40), Validators.pattern(this.textPattern)])],
      fecha_encargado: ["", Validators.compose([Validators.required])],
      recurrente: ["", Validators.compose([Validators.required])],
      procede: ["", Validators.compose([Validators.required])],
      notas: ["", Validators.compose([Validators.minLength(3), Validators.maxLength(500), Validators.pattern(this.textPattern)])]
    });
  }

  ValidarComentarioNotaForm(){
    this.editarComentarioNotaForm = this.formBuilder.group({
      notas: ["", Validators.compose([Validators.minLength(3), Validators.maxLength(500), Validators.pattern(this.textPattern)])]
    });
  }


  // Aqui se definen las reglas que seguirá cada edicion
  validarFacturaEstatuFormulario(){
    this.facturaEstatusForm = this.formBuilder.group({
      observaciones: ["", Validators.compose([Validators.minLength(0), Validators.maxLength(1000), Validators.pattern(this.textPattern)])],
    });
  }
    
  // Aqui se definen las reglas que seguirá cada edicion
  validarPacienteCrearFormulario(){
    this.PacienteCrearForm = this.formBuilder.group({
      password: ["", Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(30), Validators.pattern(this.textPattern)])],
    });
  }

  // Aqui se definen las reglas que seguirá cada edicion
  validarCitaEditarFormulario(){
    this.citaEditarForm = this.formBuilder.group({
      notas: ["", Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(500),Validators.pattern(this.textPattern)])],
    });
  }


  validarQueryFormulario(){
    this.queryForm = this.formBuilder.group({
      query: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(90), Validators.pattern(this.textPattern)])], });
  }


  //funcion que compara la hora_inicio y hora_final 
  dateLessThan(from: string, to: string) {
    return (group: FormGroup): { [key: string]: any } => {
      const inputFrom = group.controls[from];
      const inputTo = group.controls[to];
      const bothFilled = inputFrom.value && inputTo.value;
      if (bothFilled && inputFrom.value >= inputTo.value) {
        return {
          dates: ""
        };
      }
      return {};
    }
  }


  // funcion para listado de todas las empresas
  consultarEmpresasOp(){
    this.IdEmpresa = null;
    this.empresas = {}
    this.empresa = null;
    this.spinner.show();  
    this.dataApiService.consultarEmpresasOp()
    .subscribe((
      data : EmpresaInterface) => { this.empresas = data; 
      this.mensajeExito();
      console.log("Empresas Cargadas")
      console.log(this.empresas);
      this.tablaEmpresa();
      //la tabla nececita reiniciarse al eliminar un item
      $("#listaEmpresas").dataTable().fnDestroy(); 
    }, error => this.mensajeError(error)  
    ); 
  }


  // funcion para listado de todos los estudios
  consultarDisponibilidadId(){
    this.salaSeleccionada = 0
    if(this.sucursalSeleccionada > 0){
      this.spinner.show();  
      this.dataApiService.consultarDisponibilidadId(this.sucursalSeleccionada)
      .subscribe((
        data : DisponibilidadInterface) => { this.disponibilidad = data; 
        this.mensajeExito();
        console.log("Disponibilidad Cargada")
        console.log(this.disponibilidad);
      }, error => this.mensajeError(error)  
      ); 
    }
  }

  // funcion para listado de todos los estudios
  consultarDisponibilidadIdTemp(){
    this.salaSeleccionadaTemp = 0
    if(this.sucursalSeleccionadaTemp > 0){
      this.spinner.show();  
      this.dataApiService.consultarDisponibilidadId(this.sucursalSeleccionadaTemp)
      .subscribe((
        data : DisponibilidadInterface) => { this.disponibilidadTemp = data; 
        this.mensajeExito();
        console.log("Disponibilidad Cargada")
        console.log(this.disponibilidadTemp);
      }, error => this.mensajeError(error)  
      ); 
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
    }, error => this.mensajeError(error)  
    ); 
  }

    // funcion para listado de todos los estudios
    consultarEstudioEmpresas(){
      this.estudioEmpresas = {};
      this.spinner.show();  
      this.dataApiService.consultarEstudioEmpresas()
      .subscribe((
        data : EstudioInterface) => { this.estudioEmpresas = data; 
        this.mensajeExito();
        console.log("Estudio Cargado")
        console.log(this.estudioEmpresas);
        this.tablaEmp();
        //la tabla nececita reiniciarse al eliminar un item
        $("#listaEmp").dataTable().fnDestroy(); 
      }, error => this.mensajeError(error)  
      ); 
    }


    //asigna sucursal seleccionada disponibilidad y sala
  asignarValoresCita(){
    this.sucursalSeleccionadaTemp = this.sucursalSeleccionada;
    this.salaSeleccionadaTemp = this.salaSeleccionada;
    this.disponibilidadTemp = this.disponibilidad;
    this.citaEstatus = 0;
  }

  purgarFactura(){
    this.facturaEstatus = 0;
    this.facturaTmp = {}
  }

  purgarLlamada(){
    this.calidadFlag = 0;
    this.callTmp = {}
  }
  
  consultarOperador(){
    this.spinner.show();  
    this.dataApiService.consultarOperador(this.userAPI.id_sem)
    .subscribe((
      data : EmpleadoInterface) => { this.empleado = data; 
      this.spinner.hide();  
    }, error => this.mensajeError(error) 
      ); 
  }

  print(){
      console.log(this.estudioEmpresaForm)
  }

  //reagenda una cita
  reagendarCita(){
    let horaInicio
    if(this.tipoCita != "ABIERTA"){
      this.citaEstatus = 1
      this.citaTmp.estatus = "CERRADA"
      // @ts-ignore
      horaInicio = this.citaTmp.hora_inicio;
      console.log(horaInicio)
      horaInicio = horaInicio.substring(0,5);
      console.log(horaInicio)
      horaInicio = horaInicio + ':01';
      console.log(horaInicio)
      this.citaTmp.hora_inicio = horaInicio
      // @ts-ignore
      this.citaTmp.id_sala = this.salaSeleccionada;
      this.citaTmp.Sucursal = this.sucursalSeleccionada;
      let operador = this.userAPI.first_name+" "+this.userAPI.last_name
      this.citaTmp.editor = operador;
      console.log(this.citaTmp)
      this.spinner.show();  
      this.dataApiService.reagendarCitaOp(this.citaTmp)
      .subscribe(() => {  
        this.mensajeExito();
        this.citaTmp.estatus = "ACTIVA"
        this.spinner.show();  
        this.dataApiService.crearCitaOp(this.citaTmp)
          .subscribe(() => {  
          console.log("Reagendando cita"); 
          this.mensajeExito();
          this.citaTmp.estatus = "CERRADA"
          this.consultarCitasBuscarOp(); 
          this.consultarCitasOp();
          //la tabla nececita reiniciarse al eliminar un item
          $("#listaFac").dataTable().fnDestroy(); 
          this.citaEstatus = 2
        }, error => this.reagendarCitaError()
        ); 
        console.log("cerrada")
        this.citaEstatus = 2;
      }, error => this.mensajeError(error)  
      ); 
    }else{
      this.citaEstatus = 1
      this.citaTmp.estatus = "CERRADA"
      this.citaTmp.tipo_cita = "AGENDADA"
      // @ts-ignore
      this.citaTmp.id_sala = this.salaSeleccionadaTemp;
      this.citaTmp.Sucursal = this.sucursalSeleccionadaTemp;
      console.log("here")
      console.log(this.citaTmp.id_sala)
      console.log(this.citaTmp.Sucursal)
      let operador = this.userAPI.first_name+" "+this.userAPI.last_name
      this.citaTmp.editor = operador;
      console.log(this.citaTmp)
      this.spinner.show();  
      this.dataApiService.reagendarCitaOp(this.citaTmp)
      .subscribe(() => {  
        this.mensajeExito();
        this.citaTmp.estatus = "ACTIVA"
        this.spinner.show();  
        this.dataApiService.crearCitaOp(this.citaTmp)
          .subscribe(() => {  
          console.log("Reagendando cita"); 
          this.mensajeExito();
          this.citaTmp.estatus = "CERRADA"
          this.consultarCitasBuscarOp(); 
          this.consultarCitasOp();
          //la tabla nececita reiniciarse al eliminar un item
          $("#lista").dataTable().fnDestroy(); 
          this.citaEstatus = 2
        }, error => this.reagendarCitaAbiertaError()
        ); 
        console.log("cerrada")
        this.citaEstatus = 2;
      }, error => this.mensajeError(error)  
      ); 
    }
  }
  
  reagendarCitaError(){
    console.log("reagendando por error")
    this.citaEstatus = 3;
    this.citaTmp.estatus = "ACTIVA"
    this.spinner.show();  
    this.dataApiService.reagendarCitaOp(this.citaTmp)
    .subscribe(() => {  
      this.mensajeExito();
      this.consultarCitasBuscarOp();
      this.consultarCitasOp();
      //la tabla nececita reiniciarse al eliminar un item
      $("#lista").dataTable().fnDestroy(); 
    }, error => this.mensajeError(error)   
    ); 
  }

  reagendarCitaAbiertaError(){
    console.log("reagendando por error")
    this.citaEstatus = 3;
    this.citaTmp.estatus = "ACTIVA"
    this.citaTmp.tipo_cita = "ABIERTA"
    this.spinner.show();  
    this.dataApiService.reagendarCitaOp(this.citaTmp)
    .subscribe(() => {  
      this.mensajeExito();
      this.consultarCitasBuscarOp();
      this.consultarCitasOp();
      //la tabla nececita reiniciarse al eliminar un item
      $("#lista").dataTable().fnDestroy(); 
    }, error => this.mensajeError(error)  
    ); 
  }

  recargarFactura(){  
    this.facturaFlag=false;
    setTimeout(() => {
      console.log("recargando...")
      this.facturaFlag=true;
    }, 3000);
  } 


  consultarFacturacion(){  
    console.log("rembolsos")
    this.spinner.show();  
    this.dataApiService.consultarCitasFacturacionOp()
    .subscribe((
      data : FacturacionInterface) => { this.facturacion = data; 
      this.mensajeExito();
      console.log("Citas Facturacion Cargadas")
      console.log(this.facturacion);
      this.tablaFac();
    }, error => this.mensajeError(error)  
    ); 
  }


  consultarComentarios(){  
    console.log("Comentarios")
    this.spinner.show();   
    this.dataApiService.consultarComentariosOp()
    .subscribe((
      data : ComentariosInterface) => { this.comentarios = data; 
      this.mensajeExito(); 
      console.log("Comentarios Cargadas")
      console.log(this.comentarios);
      this.tablaCom(); 
    }, error => this.mensajeError(error)  
    ); 
  }

  consultarComentario(){  
    console.log("Comentario")
    this.spinner.show();   
    this.dataApiService.consultarComentarioOp(this.comentario.id)
    .subscribe((
      data : ComentariosInterface) => { this.comentario = data; 
      this.mensajeExito(); 
      console.log("Comentario Cargada")
      console.log(this.comentario);
    }, error => this.mensajeError(error)  
    ); 
  }

  consultarQuejasSugerenciasOp(){  
    console.log("Quejas & sugerencias")
    this.spinner.show();   
    this.dataApiService.consultarQuejasSugerenciasOp()
    .subscribe((
      data : QuejasSugerenciasInterface) => { this.quejasSugerencias = data; 
      this.mensajeExito(); 
      console.log("Quejas & sugerencias Cargadas")
      console.log(this.quejasSugerencias);
      this.TablaQuej(); 
    }, error => this.mensajeError(error)  
    ); 
  }


  consultarQuejasSugerenciaOp(){  
    console.log("Quejas & sugerencias")
    this.spinner.show();   
    this.dataApiService.consultarQuejasSugerenciaOp(this.quejaSugerencia.id)
    .subscribe((
      data : QuejasSugerenciasInterface) => { this.quejaSugerencia = data; 
      this.mensajeExito(); 
      console.log("Quejas & sugerencias Cargadas")
      console.log(this.quejaSugerencia);
    }, error => this.mensajeError(error)  
    ); 
  }

  tipoLlamada(){
    if(this.callTmp.tipo == "CALIDAD"){
      console.log("calidad")
      this.callTmp.experiencia =""
      this.calidadFlag=1
    }
    if(this.callTmp.tipo == "RECIBIDA"){
      console.log("recibida")
      this.callTmp.experiencia ="No aplica"
      this.calidadFlag=2
    }
  }

  consultarCall(){  
    console.log("Call Center")
    this.spinner.show();  
    this.dataApiService.consultarCallOp()
    .subscribe((
      data : CallInterface) => { this.calls = data; 
      this.mensajeExito();
      console.log("Llamadas Cargadas")
      console.log(this.calls);
      this.tablaCall();
      //la tabla nececita reiniciarse al eliminar un item
      $("#listaCall").dataTable().fnDestroy(); 
    }, error => this.mensajeError(error)  
    ); 
  }

  crearLlamada(){
    let operador = this.userAPI.first_name+" "+this.userAPI.last_name 
    this.callTmp.creador = operador
    this.callTmp.editor = operador
    console.log(this.callTmp)
    this.spinner.show();  
    this.dataApiService.crearCallOp(this.callTmp)
    .subscribe(() => {  
      console.log("Creando Llamada"); 
      this.mensajeExito();
      this.consultarCall();
      //la tabla nececita reiniciarse al eliminar un item
      $("#listaCall").dataTable().fnDestroy(); 
    }, error => this.mensajeError(error)  
    ); 
  }

  crearComentarioOp(){
  let operador = this.userAPI.first_name+" "+this.userAPI.last_name 
  this.comentarioTmp.creador = operador
  this.comentarioTmp.editor = operador
  console.log(this.comentarioTmp)
  this.spinner.show();  
  this.dataApiService.crearComentarioOp(this.comentarioTmp)
  .subscribe(() => {  
    console.log("Creando Comentario"); 
    this.mensajeExito();
    this.consultarComentarios();
    //la tabla nececita reiniciarse al eliminar un item
    $("#listaCom").dataTable().fnDestroy(); 
  }, error => this.mensajeError(error)  
  ); 
}
 

crearQuejasSugerenciasOp(){
  let operador = this.userAPI.first_name+" "+this.userAPI.last_name 
  this.quejasSugerenciasTmp.creador = operador
  this.quejasSugerenciasTmp.editor = operador
  console.log(this.quejasSugerenciasTmp)
  this.spinner.show();  
  this.dataApiService.crearQuejasSugerenciasOp(this.quejasSugerenciasTmp)
  .subscribe(() => {  
    console.log("Creando Queja"); 
    this.mensajeExito();
    this.consultarQuejasSugerenciasOp();
    //la tabla nececita reiniciarse al eliminar un item
    $("#listaQuej").dataTable().fnDestroy(); 
  }, error => this.mensajeError(error)  
  ); 
}



// Actualizar queja
editarQuejasSugerenciasOp(){
  let operador = this.userAPI.first_name+" "+this.userAPI.last_name
  this.spinner.show();  
  this.dataApiService.editarQuejasSugerenciasOp(this.quejasSugerenciasTmp)
  .subscribe(() => {  
    this.mensajeExito();
    this.consultarQuejasSugerenciasOp();
    //la tabla nececita reiniciarse al eliminar un item
    $("#listaQuej").dataTable().fnDestroy(); 
  }, error => this.mensajeError(error)  
  ); 
}


editarComentariosOp(){
  let operador = this.userAPI.first_name+" "+this.userAPI.last_name
  this.spinner.show();  
  this.dataApiService.editarComentariosOp(this.comentarioTmp)
  .subscribe(() => {  
    this.mensajeExito();
    this.consultarComentarios();
    //la tabla nececita reiniciarse al eliminar un item
    $("#listaCom").dataTable().fnDestroy(); 
  }, error => this.mensajeError(error)  
  ); 
}

purgarQueja(){
  console.log("purgando")
  this.quejasSugerenciasTmp= this.quejaSugerencia;
  this.ValidarQuejasSugerenciasSupervisorForm();
}


purgarComentario(){
  console.log("purgando..")
  console.log(this.comentario)
  this.comentarioTmp= this.comentario;
  console.log(this.comentarioTmp)
  this.ValidarComentarioNotaForm();
}

purgarEstudioEmpresa(){
  console.log("purgando..")
  this.estudioEstatus = 0
  console.log(this.estudioEmpresa)
  this.estudioEmpresaTmp = {};
  this.pacienteSearchName = null;
  this.ValidarEstudioEmpresaForm();
}

  consultarDisponibilidadEmail(){
    this.buscarMedico();
    this.buscarPaciente();
  }

  // funcion para busqueda de un medico mediante su email
  buscarMedico(){    
    this.medicoFlag = 0
    this.dataApiService.consultarEmailMedico(this.callTmp.email)
    .subscribe((
      data : MedicoInterface) => { this.medicoSearch = data; 
      console.log("Medico Cargado")
      console.log(this.medicoSearch);
      if(this.medicoSearch){
        // @ts-ignore
        if(this.medicoSearch[0]){
          console.log("Existe Medico")
          this.medicoFlag=1;
          this.medicoSearch = {}
        }
        else{
          console.log("No Existe Medico")
          this.medicoFlag=2;
          this.medicoSearch = {}
        }
      }
    }, error => this.mensajeError(error)  
    ); 
  }

    // funcion para busqueda de un paciente mediante su email
    buscarPaciente(){    
      this.pacienteFlag = 0
      this.dataApiService.consultarEmailPaciente(this.callTmp.email)
      .subscribe((
        data : PacienteInterface) => { this.pacienteSearch = data; 
        console.log("Paciente Cargado")
        console.log(this.pacienteSearch);
        if(this.pacienteSearch){
          // @ts-ignore
          if(this.pacienteSearch[0]){
            console.log("Existe Paciente")
            this.pacienteFlag=1;
            this.pacienteSearch = {}
          }
          else{
            console.log("No Existe Paciente")
            this.pacienteSearch = {}
            this.pacienteFlag=2;
          }
        }
      }, error => this.mensajeError(error)  
      ); 
    }

    crearPaciente(){
      console.log("crear paciente")
    }

  consultarCitasOp(){ 
    this.newCalendar = 0
    this.spinner.show();  
    this.dataApiService.consultarCitasOp(this.salaSeleccionada,this.listaSucursales[this.sucursalSeleccionada])
    .subscribe((
      data : CitaInterface) => { this.citas = data; 
      this.mensajeExito();
      console.log("Citas Cargadas")
      console.log(this.citas);
      this.actualizarCalendario();
    }, error => this.mensajeError(error)  
    ); 
  }

   
  consultarCitasBuscarOp(){ 
    this.tipoCita = "BUSCAR"
    console.log(this.tipoCita) 
    this.spinner.show();  
    this.dataApiService.consultarCitasBuscadorOp(this.salaSeleccionada,this.listaSucursales[this.sucursalSeleccionada])
    .subscribe((
      data : CitaInterface) => { this.citasList = data; 
      this.mensajeExito();
      console.log("Citas Cargadas")
      console.log(this.citasList);
      this.tablaHist();
      this.actualizarCalendario();
    }, error => this.mensajeError(error)  
    ); 
  }

  consultarCitasExternasOp(){ 
    this.tipoCita = "CERRADA"
    console.log(this.tipoCita)
    this.spinner.show();  
    this.dataApiService.consultarCitasExternasOp()
    .subscribe((
      data : CitaInterface) => { this.citasExt = data; 
      this.mensajeExito();
      console.log("Citas Externas Cargadas")
      console.log(this.citasExt);
      this.tablaExt();
    }, error => this.mensajeError(error)  
    ); 
  }

  consultarCitasRembolsos(){
    console.log("rembolsos")
    this.spinner.show();  
    this.dataApiService.consultarCitasRembolsoOp()
    .subscribe((
      data : CitaInterface) => { this.citasRem = data; 
      this.mensajeExito();
      console.log("Citas Rembolso Cargadas")
      console.log(this.citasRem);
      this.tablaRem();
    }, error => this.mensajeError(error)  
    ); 
  }

  consultarCitasAbiertasOp(){ 
    this.tipoCita = "ABIERTA"
    console.log(this.tipoCita)
    this.spinner.show();  
    this.dataApiService.consultarCitasAbiertasOp()
    .subscribe((
      data : CitaInterface) => { this.citasAbi = data; 
      this.mensajeExito();
      console.log("Citas Abiertas Cargadas")
      console.log(this.citasAbi);
      this.tablaAbi();
    }, error => this.mensajeError(error)  
    ); 
  }

  // Actualizar cita de un Paciente
  actualizarCitaEstatus(){
    let operador = this.userAPI.first_name+" "+this.userAPI.last_name
    this.spinner.show();  
    this.dataApiService.actualizarCitaOp(this.idEst, this.estatusSeleccionado, operador)
    .subscribe(() => {  
      this.mensajeExito();
      if(this.estatusSeleccionado ==1){
        //monedero
        console.log("monedero")
        //this.sumarMonedero();
      }
      if(this.estatusSeleccionado==1){
        this.citaTmp.estatus = "CERRADA"
        this.citaTmp.editor = this.userAPI.first_name+" "+this.userAPI.last_name;
        this.editable = false;
      }else if(this.estatusSeleccionado==2){
        this.citaTmp.estatus = "CANCELADA"
        this.editable = false;
        this.citaTmp.editor = this.userAPI.first_name+" "+this.userAPI.last_name;
      }
      if(this.tipoCita == "BUSCAR"){
        console.log("entrando buscar");
        this.consultarCitasBuscarOp();
      }else if(this.tipoCita == "CERRADA"){
        console.log("entrando cerrada");
        this.consultarCitasExternasOp();
      }else if(this.tipoCita == "ABIERTA"){
        console.log("entrando abierta");
        this.consultarCitasAbiertasOp();
      }
      this.consultarCitasOp();
      //la tabla nececita reiniciarse al eliminar un item
      $("#lista").dataTable().fnDestroy(); 
    }, error => this.mensajeError(error)  
    ); 
  }

  sumarMonedero(){
    console.log("procediendo a extra...")
    let editor
    editor = this.userAPI.first_name+" "+this.userAPI.last_name
    if(this.citaTmp.Paciente){
      if(this.citaTmp.precioVenta){
        if(this.citaTmp.precioVenta > 1){
          var monto = this.citaTmp.precioVenta
          monto = (monto / 100)
          monto = Math.trunc(monto);
          console.log(monto)
          this.citaTmp.Paciente.monedero = this.citaTmp.Paciente.monedero + monto
          console.log(this.citaTmp.Paciente.monedero) 
          this.spinner.show();
          this.dataApiService.actualizarPacienteMonederoOp(this.citaTmp.Paciente.id,this.citaTmp.Paciente.monedero,editor)
          .subscribe(() => {  
            console.log("Actualizando Monedero"); 
            this.spinner.hide();
            this.mensajeExito();
          }, error => this.mensajeError(error)  
          ); 
        }
      }
    }
  }

  rellenarCamposEditar(){
    this.notasTmp = this.citaTmp.notas
  }

  rellenarCamposEditarRem(){
    this.notasTmp = this.citaTmp.notas
  }

  purgarHorario(){
    this.citaTmp = {};
  }

  // Actualizar cita de Paciente
  editarCita(){
    let operador
    console.log(this.citaTmp)
    operador = this.userAPI.first_name+" "+this.userAPI.last_name
    if(this.estatusRemSeleccionado==0){{
      this.spinner.show();  
      this.dataApiService.editarCitaOp(this.citaTmp.id, this.notasTmp, operador)
      .subscribe(() => {  
        this.mensajeExito();
        this.citaTmp.notas = this.notasTmp;
        this.citaTmp.editor = this.userAPI.first_name+" "+this.userAPI.last_name;
      }, error => this.mensajeError(error)  
      ); 
      }
    }
    else{
      if(this.estatusRemSeleccionado==1){ 
        this.citaTmp.estatus_rembolso = "APROBADO"
        this.citaTmp.estatus = "CANCELADA"
      }
      if(this.estatusRemSeleccionado==2){
        this.citaTmp.estatus_rembolso = "RECHAZADO" 
        this.citaTmp.estatus = "CANCELADA"
      }
      if(this.estatusRemSeleccionado==3){
        this.citaTmp.estatus_rembolso = null 
        this.citaTmp.estatus = "ACTIVA"
        this.citaTmp.razon_rembolso = null
      }
      this.spinner.show();  
      this.dataApiService.editarCitaRemOp(this.citaTmp.id, this.notasTmp, this.citaTmp.estatus, this.citaTmp.estatus_rembolso,this.citaTmp.razon_rembolso, operador)
      .subscribe(() => {  
        this.mensajeExito();
        this.citaTmp.notas = this.notasTmp;
        this.citaTmp.editor = this.userAPI.first_name+" "+this.userAPI.last_name;
      }, error => this.mensajeError(error)  
      ); 
      this.consultarCitasRembolsos(); 
      //la tabla nececita reiniciarse al eliminar un item
      $("#lista").dataTable().fnDestroy(); 
    }
  }

  // Actualizar cita de Paciente
  editarEstatusFactura(){
    let operador
    operador = this.userAPI.first_name+" "+this.userAPI.last_name
    if(this.estatusFacSeleccionado==1){ 
      this.facturaTmp.factura_estatus = "APROBADO"
      this.facturaTmp.editor = operador
    }
    if(this.estatusFacSeleccionado==2){
      this.facturaTmp.factura_estatus = "RECHAZADO"  
      this.facturaTmp.editor = operador
    }
    console.log(this.facturaTmp)
    this.spinner.show();  
    this.dataApiService.editarFacturaOp(this.facturaTmp)
      .subscribe(() => {  
        this.mensajeExito();
        this.consultarFacturacion();
        //la tabla nececita reiniciarse al eliminar un item
        $("#listaFac").dataTable().fnDestroy(); 
      }, error => this.mensajeError(error)  
      ); 
  }

  asignarValoresFactura(){
    this.facturaTmp= this.factura
  }
  
  crearFactura(){
    this.recargarFactura();
    this.facturaEstatus=1;
    let operador = this.userAPI.first_name+" "+this.userAPI.last_name
    this.facturaTmp.creador = operador
    this.facturaTmp.editor = operador
    this.facturaTmp.factura_estatus = "SOLICITADO"
    console.log(this.facturaTmp)
    this.spinner.show();  
    this.dataApiService.crearFacturaOp(this.facturaTmp)
    .subscribe(() => {  
      console.log("Creando Factura"); 
      this.mensajeExito();
      this.facturaEstatus=2
      this.consultarFacturacion();
      //la tabla nececita reiniciarse al eliminar un item
      $("#listaFac").dataTable().fnDestroy(); 
    }, error => this.mensajeError(error)  
    ); 
  }

  //Guarda el id de la cita que se desea cambiar su estatus
  idEstatus(id){
    this.estatusSeleccionado = 0;
    this.idEst = id;
    console.log(id)
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


  actualizarCalendario(){
    $('#calendar').fullCalendar( 'removeEvents');
    var newevent = [];
    var color;
    if(this.citas.results){
      for (var i = 0; i < this.citas.results.length; i++) {
        if(this.citas.results[i].estatus == 'ACTIVA'){
          if(this.citas.results[i].tipo_cita == 'RESTRINGIDA'){
            color = '#B4AFA9 ';
          }else{
            color = '#53D92D';
          }
        }else if(this.citas.results[i].estatus == 'CERRADA'){
          color = '#B2EBFE';
        }else if(this.citas.results[i].estatus == 'CARRITO'){
          color = '#E5BE01';
        }else if(this.citas.results[i].estatus == 'CANCELADA'){
          color = '#FF0000';
        }
        newevent[i]={
          color  : color, 
          numCita: i,
          id: this.citas.results[i].id,
          title: this.citas.results[i].prueba,
          start: this.citas.results[i].fecha_cita+'T'+this.citas.results[i].hora_inicio,
          end: this.citas.results[i].fecha_cita+'T'+this.citas.results[i].hora_final,
          editable: false
        };
      }
    }
    $('#calendar').fullCalendar('renderEvent', newevent, true);
    $('#calendar').fullCalendar('addEventSource', newevent);
    $('#calendar').fullCalendar('refetchEvents');
  }

  //aviso de exito en una operacion en el api
  mensajeExito(){
    this.spinner.hide();  
    this.ngxNotificationService.sendMessage('Búsqueda exitosa', 'success ', 'bottom-right');
  } 

  mensajeError(error){
    this.spinner.hide();  
    this.citaEstatus = 3
    this.facturaEstatus=3
    this.ngxNotificationService.sendMessage('Ha ocurrido un error ', 'danger ', 'bottom-right');
    console.log(error);
    this.msgError = error.error.status
    this.citaTmp.hora_inicio = this.hora_inicioTmp
  }

  buscarPacienteName(){ 
    this.spinner.show();
    this.pacientesSearch = {};
    this.pacienteSearchName = null;
    console.log("Buscando..")
    console.log(this.pacienteBuscar)  
    this.dataApiService.consultarPacienteSearchOp(this.pacienteBuscar)
    .subscribe((
      data : PacienteInterface) => { this.pacientesSearch = data; 
      this.mensajeExito();
      console.log("Pacientes Cargados")
      console.log(this.pacientesSearch);
      this.tablaPacientesSearch();
      //la tabla nececita reiniciarse al eliminar un item
      $("#listaPacientesSearch").dataTable().fnDestroy(); 
    }, error => this.mensajeError(error)  
    ); 
  }




  purgarBuscarPaciente(){
    console.log("Purgando..")
      this.pacienteBuscar = null;
      this.IdPacienteEstudio = null;
      this.estudioEmpresaTmp = {};
  }

  // funcion para abrir modal de estudios
  verEstudios(modal){
    console.log("abriendo modal");
    this.estatusFacSeleccionado=0
    this.modalService.open(modal, {
      size: 'xl'
    });
  }

  // funcion para abrir modal de estudios
  verEstudiosEditar(modal){
    console.log("abriendo modal");
    console.log(this.citaTmp);
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

    // funcion para abrir modal 
    verNuevoComentario(modal){
      this.ValidarComentarioForm();
      this.comentarioTmp = {}; 
      this.pacienteFlag = 0
      this.medicoFlag = 0
      console.log("abriendo modal");
      this.modalService.open(modal, {
        size: 'xl'
      });
    }


        // funcion para abrir modal 
        verNuevoEstudioEmpresaModal(modal){
          //this.ValidarComentarioForm();
          //this.comentarioTmp = {}; 
          //this.pacienteFlag = 0
          //this.medicoFlag = 0
          console.log("abriendo modal");
          this.modalService.open(modal, {
            size: 'xl'
          });
        }

    // funcion para abrir modal 
    verNuevoQuejaSujerencia(modal){
      this.ValidarQuejasSugerenciasForm();
      this.quejasSugerenciasTmp = {}
      this.pacienteFlag = 0
      this.medicoFlag = 0
      console.log("abriendo modal");
      this.modalService.open(modal, {
        size: 'xl'
      }); 
    }

  //una vez seleccionado el paciente a ingresar en la nueva cita se asignan sus datos a las variables correspondientes
  seleccionarIdPaciente(){
    this.nombrePaciente = this.paciente.nombre + " " +this.paciente.apellido_paterno + " " + this.paciente.apellido_materno;
    this.citaTmp.Paciente = this.paciente
    console.log(this.citaTmp)
  }
 
  // purga citaTmp
  purgarCitaTmp(){
    this.validarCitaCrearFormulario()
    this.citaTmp ={};
    this.nombrePaciente = null;
    this.tiempo ={};
    this.citaRestringida = false;
    this.citaEstatus = 0;
  }

  asignarTiempo(){
    var apuntadorInicio = new Date(this.citaTmp.fecha_cita+"T"+this.citaTmp.hora_inicio)
    var apuntadorFinal = new Date(this.citaTmp.fecha_cita+"T"+this.citaTmp.hora_inicio)
    // @ts-ignore
    apuntadorFinal.setMinutes(apuntadorFinal.getMinutes() + this.tiempo);
    console.log(apuntadorInicio)
    console.log(apuntadorFinal)
    var hora = (apuntadorFinal.getHours() < 10 ? '0' : '') + apuntadorFinal.getHours()+":"+(apuntadorFinal.getMinutes() < 10 ? '0' : '') + apuntadorFinal.getMinutes()  
    console.log(hora)
    this.citaTmp.hora_final = hora
  }

  //Actualizar cita restingida
  agendarCitaRestringida(){
    console.log("cita restingida")
    this.citaEstatus = 1
    this.citaTmp.tipo_cita = "RESTRINGIDA"
    this.citaTmp.estatus = "ACTIVA"
    // @ts-ignore
    this.citaTmp.id_sala = this.salaSeleccionada;
    this.citaTmp.Sucursal = this.sucursalSeleccionada;
    this.hora_inicioTmp = this.citaTmp.hora_inicio;
    this.citaTmp.hora_inicio = this.citaTmp.hora_inicio + ":01";
    this.citaTmp.creador = this.userAPI.first_name+" "+this.userAPI.last_name;
    this.citaTmp.editor = this.userAPI.first_name+" "+this.userAPI.last_name;
    this.spinner.show();  
    this.dataApiService.crearCitaOp(this.citaTmp)
    .subscribe(() => {  
      console.log("Actualizando cita Externa"); 
      this.mensajeExito();
      this.citaTmp.hora_inicio = this.hora_inicioTmp;
      this.consultarCitasOp();
      this.citaEstatus = 2
    }, error => this.mensajeError(error)  
    ); 
  }


  agendarCita(){
    console.log("cita")
    this.citaEstatus = 1
    this.citaTmp.tipo_cita = "AGENDADA"
    this.citaTmp.estatus = "ACTIVA"
    // @ts-ignore
    this.citaTmp.id_sala = this.salaSeleccionada;
    this.citaTmp.Sucursal = this.sucursalSeleccionada;
    this.hora_inicioTmp = this.citaTmp.hora_inicio;
    this.citaTmp.hora_inicio = this.citaTmp.hora_inicio + ":01";
    this.citaTmp.creador = this.userAPI.first_name+" "+this.userAPI.last_name;
    this.citaTmp.editor = this.userAPI.first_name+" "+this.userAPI.last_name;
    this.spinner.show();  
    this.dataApiService.crearCitaOp(this.citaTmp)
    .subscribe(() => {  
      console.log("Actualizando"); 
      this.mensajeExito();
      this.citaTmp.hora_inicio = this.hora_inicioTmp;
      this.consultarCitasOp();
      this.citaEstatus = 2
    }, error => this.mensajeError(error)  
    ); 
  }
  
  purgarTiempo(){
    this.tiempo ={};
  }

  // funcion para listado de todos los pacientes
  consultarPacientesOp(){
    this.paciente = null;
    this.spinner.show();  
    this.dataApiService.consultarPacientesOp()
    .subscribe((
      data : PacienteInterface) => { this.pacientes = data; 
      this.tablaPaciente();
      this.spinner.hide();  
      console.log("Pacientes Cargado")
      console.log(this.pacientes)
    }, error => this.mensajeError(error)  
    ); 
  }

  // funcion para abrir el modal de estudios
  verEstudiosBuscar(cita: CitaInterface, modal){
    this.citaTmp = cita;
    this.edad = null;
    this.edadMeses = null;
    if(this.citaTmp.Paciente){
      this.edad = moment().diff(this.citaTmp.Paciente.fecha_nacimiento, 'years');
      this.edadMeses = moment().diff(this.citaTmp.Paciente.fecha_nacimiento, 'months');
    }
    console.log(this.citaTmp.id);
    this.modalService.open(modal, {
      size: 'xl'
    });
  }

  // funcion para abrir el modal de estudios
  verEstudiosAbiertos(cita: CitaInterface, modal){
    this.citaTmp = cita;
    this.edad = null;
    this.edadMeses = null;
    if(this.citaTmp.Paciente){
      this.edad = moment().diff(this.citaTmp.Paciente.fecha_nacimiento, 'years');
      this.edadMeses = moment().diff(this.citaTmp.Paciente.fecha_nacimiento, 'months');
    }
    console.log(this.citaTmp.id);
    this.modalService.open(modal, {
      size: 'xl'
    });
  }

  // funcion para abrir el modal de estudios
  verEstudiosRembolso(cita: CitaInterface, modal){
    this.citaTmp = cita;
    this.edad = null;
    this.edadMeses = null;
    if(this.citaTmp.Paciente){
      this.edad = moment().diff(this.citaTmp.Paciente.fecha_nacimiento, 'years');
      this.edadMeses = moment().diff(this.citaTmp.Paciente.fecha_nacimiento, 'months');
    }
    console.log(this.citaTmp.id);
    this.modalService.open(modal, {
      size: 'xl'
    });
  }

  // funcion para abrir el modal de estudios
  verFactura(factura: FacturacionInterface, modal){
    this.factura = factura;
    console.log(this.factura);
    this.modalService.open(modal, {
      size: 'xl'
    });
  }


  // funcion para abrir el modal de estudios
  verComentario(comentario: ComentariosInterface, modal){
    this.comentario = comentario;
    console.log(this.comentario);
    this.consultarComentario();
    this.modalService.open(modal, {
      size: 'xl'
    });
  }

  // funcion para abrir el modal de estudios
  verEstudioEmpresa(estudioEmpresa: EstudioEmpresaInterface, modal){
    this.estudioEmpresa = estudioEmpresa;
    console.log(this.estudioEmpresa);
    this.consultarEstudioEmpresa();
    this.modalService.open(modal, {     
      size: 'xl'
    });
  }

 
  // funcion para listado de todos los estudios
  consultarEstudioEmpresa(){
    this.spinner.show();  
    this.dataApiService.consultarEstudioEmpresa(this.estudioEmpresa.id)
    .subscribe((
      data : EstudioEmpresaInterface) => { this.estudioEmpresa = data; 
      this.mensajeExito();
      console.log("Estudio Cargado")
      console.log(this.estudioEmpresa);
      this.tablaEmp();
      //la tabla nececita reiniciarse al eliminar un item
      $("#listaEmp").dataTable().fnDestroy(); 
    }, error => this.mensajeError(error)  
    ); 
  }

  seleccionarEmpresa(empresa){ 
    this.empresa = empresa;
    console.log(empresa);
  }

  seleccionarPacienteSearch(paciente){
    this.pacienteSearchName = paciente;
    console.log(this.pacienteSearchName);
  }
 
  seleccionarSearchPaciente(){
      console.log("paciente seleccionado")
      const nombre = this.pacienteSearchName.nombre +' '+ this.pacienteSearchName.apellido_paterno +' '+ this.pacienteSearchName.apellido_materno
      this.estudioEmpresaTmp.Paciente = nombre;
      this.IdPacienteEstudio = this.pacienteSearchName.id;
  }

  asignarEmpresa(){
      console.log("asignando valores")
      this.estudioEmpresaTmp.Empresa = this.empresa.nombreEmpresa;
      this.IdEmpresa = this.empresa.id;
  }

  // funcion para abrir el modal de estudios
  verQuejaSugerencia(quejaSugerencia: QuejasSugerenciasInterface, modal){
    this.quejaSugerencia = quejaSugerencia;
    console.log(this.factura);
    this.consultarQuejasSugerenciaOp();
    this.modalService.open(modal, {
      size: 'xl'
    });
  }
  
  // funcion para abrir el modal de estudios
  verLlamada(call: CallInterface, modal){
    this.call = call;
    console.log(this.call);
    this.modalService.open(modal, {
      // @ts-ignore
      size: 'md'
    });
  }

  // funcion para abrir el modal de estudios
  verEstudiosExternos(cita: CitaInterface, modal){
    this.citaTmp = cita;
    this.edad = null;
    this.edadMeses = null;
    if(this.citaTmp.Paciente){
      this.edad = moment().diff(this.citaTmp.Paciente.fecha_nacimiento, 'years');
      this.edadMeses = moment().diff(this.citaTmp.Paciente.fecha_nacimiento, 'months');
    }
    console.log(this.citaTmp.id);
    this.modalService.open(modal, {
      size: 'xl'
    });
  }

  // guarga el numero de la cita seleccionada y su id
  cambioId(numCita, id){
    if(this.citas.results[numCita].estatus =='ACTIVA' || this.citas.results[numCita].estatus =='CARRITO'){
      this.editable = true;
    }else{
      this.editable = false;
    }
    this.numCita = numCita;
    this.idCita = id;
    if(this.citas.results[numCita].Paciente){
      this.edad = moment().diff(this.citas.results[numCita].Paciente.fecha_nacimiento, 'years');
      this.edadMeses = moment().diff(this.citas.results[numCita].Paciente.fecha_nacimiento, 'months');
    }
    this.citaTmp = this.citas.results[numCita]
    console.log(this.citas.results[numCita])
  }

  seleccionarCita(results){
    console.log(results)
    this.citaTmp.prueba = results.prueba;
    this.citaTmp.categoria = results.categoria;
    this.citaTmp.precioVenta = results.precioNormal;
  }

  // funcion para listado de todos los estudios
  consultarTiempo(){
    this.spinner.show();  
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
    let value = this.citaTmp.categoria;
    let categoria = this.citaTmp.categoria;
    let nombre = null;
    console.log(value);
    for(let i in this.list){
      if(this.list[i].name == value){
        console.log("hallado")
        nombre = this.list[i].value;
        console.log(nombre)
      }
    }
    for(let i in this.tiempos.results[0]){
      if(i.includes(nombre)){
        console.log("hallado")
        console.log(this.tiempos.results[0][i])
        this.tiempo = this.tiempos.results[0][i]
        if(this.tiempo == 0){
          console.log("tiempo 0")
        }
        break
      }
    }
    console.log(this.tiempo)
  }


  //funcion que maneja la table en jquery
  tablaPaciente(){
    $(document).ready(function() {
      $('#lista').DataTable( {
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

  //funcion que maneja la table en jquery
  tablaHist(){
    $(document).ready(function() {
      $('#lista').DataTable( {
        "language": {
          "sProcessing":     "Procesando...",
          "sLengthMenu":     "Mostrar _MENU_ citas",
          "sZeroRecords":    "No se encontraron resultados",
          "sEmptyTable":     "Ningún dato disponible en esta tabla",
          "sInfo":           "Mostrando citas del _START_ al _END_ de un total de _TOTAL_ citas",
          "sInfoEmpty":      "Mostrando citas del 0 al 0 de un total de 0 registros",
          "sInfoFiltered":   "(filtrado de un total de _MAX_ citas)",
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

  //funcion que maneja la table en jquery
  tablaAbi(){
    $(document).ready(function() {
      $('#lista').DataTable( {
        "language": {
          "sProcessing":     "Procesando...",
          "sLengthMenu":     "Mostrar _MENU_ citas",
          "sZeroRecords":    "No se encontraron resultados",
          "sEmptyTable":     "Ningún dato disponible en esta tabla",
          "sInfo":           "Mostrando citas del _START_ al _END_ de un total de _TOTAL_ citas",
          "sInfoEmpty":      "Mostrando citas del 0 al 0 de un total de 0 registros",
          "sInfoFiltered":   "(filtrado de un total de _MAX_ citas)",
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

  //funcion que maneja la table en jquery
  tablaFac(){
    $(document).ready(function() {
      $('#listaFac').DataTable( {
        "language": {
          "sProcessing":     "Procesando...",
          "sLengthMenu":     "Mostrar _MENU_ citas",
          "sZeroRecords":    "No se encontraron resultados",
          "sEmptyTable":     "Ningún dato disponible en esta tabla",
          "sInfo":           "Mostrando citas del _START_ al _END_ de un total de _TOTAL_ citas",
          "sInfoEmpty":      "Mostrando citas del 0 al 0 de un total de 0 registros",
          "sInfoFiltered":   "(filtrado de un total de _MAX_ citas)",
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


  //funcion que maneja la table en jquery
  tablaCom(){
    $(document).ready(function() {
      $('#listaCom').DataTable( {
        "language": {
          "sProcessing":     "Procesando...",
          "sLengthMenu":     "Mostrar _MENU_ comentarios",
          "sZeroRecords":    "No se encontraron resultados",
          "sEmptyTable":     "Ningún dato disponible en esta tabla",
          "sInfo":           "Mostrando comentarios del _START_ al _END_ de un total de _TOTAL_ comentarios",
          "sInfoEmpty":      "Mostrando comentarios del 0 al 0 de un total de 0 registros",
          "sInfoFiltered":   "(filtrado de un total de _MAX_ comentarios)",
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

  //funcion que maneja la table en jquery
  TablaQuej(){
    $(document).ready(function() {
      $('#listaQuej').DataTable( {
        "language": {
          "sProcessing":     "Procesando...",
          "sLengthMenu":     "Mostrar _MENU_ quejas & sugerencias",
          "sZeroRecords":    "No se encontraron resultados",
          "sEmptyTable":     "Ningún dato disponible en esta tabla",
          "sInfo":           "Mostrando quejas & sugerencias del _START_ al _END_ de un total de _TOTAL_ quejas & sugerencias",
          "sInfoEmpty":      "Mostrando quejas & sugerencias del 0 al 0 de un total de 0 registros",
          "sInfoFiltered":   "(filtrado de un total de _MAX_ quejas & sugerencias)",
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

  //funcion que maneja la table en jquery
  tablaCall(){
    $(document).ready(function() {
      $('#listaCall').DataTable( {
        "language": {
          "sProcessing":     "Procesando...",
          "sLengthMenu":     "Mostrar _MENU_ llamadas",
          "sZeroRecords":    "No se encontraron resultados",
          "sEmptyTable":     "Ningún dato disponible en esta tabla",
          "sInfo":           "Mostrando llamadas del _START_ al _END_ de un total de _TOTAL_ llamadas",
          "sInfoEmpty":      "Mostrando llamadas del 0 al 0 de un total de 0 registros",
          "sInfoFiltered":   "(filtrado de un total de _MAX_ llamadas)",
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

  //funcion que maneja la table en jquery
  tablaRem(){
    $(document).ready(function() {
      $('#lista').DataTable( {
        "language": {
          "sProcessing":     "Procesando...",
          "sLengthMenu":     "Mostrar _MENU_ citas",
          "sZeroRecords":    "No se encontraron resultados",
          "sEmptyTable":     "Ningún dato disponible en esta tabla",
          "sInfo":           "Mostrando citas del _START_ al _END_ de un total de _TOTAL_ citas",
          "sInfoEmpty":      "Mostrando citas del 0 al 0 de un total de 0 registros",
          "sInfoFiltered":   "(filtrado de un total de _MAX_ citas)",
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

  //funcion que maneja la table en jquery
  tablaExt(){
    $(document).ready(function() {
      $('#lista').DataTable( {
        "language": {
          "sProcessing":     "Procesando...",
          "sLengthMenu":     "Mostrar _MENU_ citas",
          "sZeroRecords":    "No se encontraron resultados",
          "sEmptyTable":     "Ningún dato disponible en esta tabla",
          "sInfo":           "Mostrando citas del _START_ al _END_ de un total de _TOTAL_ citas",
          "sInfoEmpty":      "Mostrando citas del 0 al 0 de un total de 0 registros",
          "sInfoFiltered":   "(filtrado de un total de _MAX_ citas)",
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

  //funcion que maneja la table en jquery
  tablaEmp(){
    $(document).ready(function() {
      $('#listaEmp').DataTable( {
        "language": {
          "sProcessing":     "Procesando...",
          "sLengthMenu":     "Mostrar _MENU_ estudios",
          "sZeroRecords":    "No se encontraron resultados",
          "sEmptyTable":     "Ningún dato disponible en esta tabla",
          "sInfo":           "Mostrando estudios del _START_ al _END_ de un total de _TOTAL_ estudios",
          "sInfoEmpty":      "Mostrando estudios del 0 al 0 de un total de 0 registros",
          "sInfoFiltered":   "(filtrado de un total de _MAX_ estudios)",
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

  //funcion que maneja la table en jquery
  tablaEmpresa(){
    $(document).ready(function() {
      $('#listaEmpresas').DataTable( {
        "language": {
          "sProcessing":     "Procesando...",
          "sLengthMenu":     "Mostrar _MENU_ empresas",
          "sZeroRecords":    "No se encontraron empresas",
          "sEmptyTable":     "Ningún dato disponible en esta tabla",
          "sInfo":           "Mostrando empresas del _START_ al _END_ de un total de _TOTAL_ empresas",
          "sInfoEmpty":      "Mostrando empresas del 0 al 0 de un total de 0 registros",
          "sInfoFiltered":   "(filtrado de un total de _MAX_ empresas)",
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

    //funcion que maneja la table en jquery
    tablaPacientesSearch(){
        $(document).ready(function() {
          $('#listaPacientesSearch').DataTable( {
            "language": {
              "sProcessing":     "Procesando...",
              "sLengthMenu":     "Mostrar _MENU_ pacientes",
              "sZeroRecords":    "No se encontraron pacientes",
              "sEmptyTable":     "Ningún dato disponible en esta tabla",
              "sInfo":           "Mostrando pacientes del _START_ al _END_ de un total de _TOTAL_ pacientes",
              "sInfoEmpty":      "Mostrando pacientes del 0 al 0 de un total de 0 registros",
              "sInfoFiltered":   "(filtrado de un total de _MAX_ pacientes)",
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

  ngOnInit(){
    $("html, body").animate({ scrollTop: 0 }, "slow");
    this.spinner.hide();  
    this.validarCitaEditarFormulario()
    this.validarCitaCrearFormulario()
    this.ValidarcitaReagendarForm();
    this.validarQueryFormulario();
    this.ValidarFacturacionCrearForm();
    this.ValidarLlamadaCrearForm();
    this.validarFacturaEstatuFormulario();
    this.validarPacienteCrearFormulario();
    this.ValidarQuejasSugerenciasForm();
    this.ValidarQuejasSugerenciasSupervisorForm();
    this.ValidarComentarioForm();
    this.ValidarComentarioNotaForm();
    this.ValidarEstudioEmpresaForm();
    this.ValidarPacienteBuscarForm();
    this.userAPI = this.authService.getCurrentUser();
    this.consultarOperador();
    var self = this;
    setTimeout(() => {
     $("#calendar").fullCalendar({        
      firstDay: 1,
      buttonText:{
      today:    'Hoy',
      month:    'Mes',
      week:     'Semana',
      day:      'Día',
      list:     'list'
      },
      minTime: '06:30:00',
      maxTime: '20:00:00',
      slotDuration: '00:10:00',
      slotLabelInterval: 10,
      slotLabelFormat: 'h(:mm)',
      monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
      monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
      dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
      dayNamesShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
        header: {
            left   : 'prev,next today',
            center : 'title',
            right  : 'month,agendaWeek,agendaDay'
        },
        navLinks   : true,
        editable   : true,
        eventLimit : true,
        views: {
          timeGrid: {
            eventLimit: 10 // adjust to 6 only for timeGridWeek/timeGridDay
          }
        },
        events: [
        ],  
        eventClick: function(event) {
          $("#successModal").modal("show");
          self.newCalendar= 1
          self.cambioId(event.numCita , event.id);
        }
      });
    });
  }
 
}
