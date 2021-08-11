import { Component, OnInit } from '@angular/core';
import { NgForm }   from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { NgxNotificationService } from 'ngx-notification';
import { NgxSpinnerService } from "ngx-spinner";
import { NgbModal} from '@ng-bootstrap/ng-bootstrap'; 

import { DataApiService } from "../../services/data-api.service";
import { AuthService } from "../../services/auth.service";

import { UserInterface } from "../../models/user-interface";
import { PacienteInterface } from "../../models/paciente-interface"; 
import { ResultadoInterface } from "../../models/resultado-interface"; 
import { ConsultaInterface } from "../../models/consulta-interface"; 
import { HistoriaClinicaInterface } from "../../models/historiaClinica-interface"; 
import { TablaPermisosInterface } from "../../models/tablaPermisos-interface"; 
import { MedicoInterface } from "../../models/medico-interface";
import { EmpleadoInterface } from "../../models/empleado-interface"; 

import * as moment from 'moment';
import * as JSZip from 'jszip';
declare var $: any;
declare var require: any
const FileSaver = require('file-saver');
let zipFile: JSZip = new JSZip();


@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent implements OnInit {

  estudioEditarForm: FormGroup; 
  pacienteForm: FormGroup;
  estudioSubirForm: FormGroup;
  emailForm: FormGroup;

  // valores temporal 
  tmpDate = new Date(Date.now());
  tmpDate2 = new Date(Date.now());
  // toma la fecha actual y suma 12 meses
  maxDateToken = this.tmpDate.setMonth(this.tmpDate.getMonth() + 12);
  // toma la fecha actual y resta 1 dia
  minDate = this.tmpDate2.setDate(this.tmpDate2.getDate());


  constructor(
    private modalService: NgbModal,
    private ngxNotificationService: NgxNotificationService,
    private spinner: NgxSpinnerService,
    private dataApiService: DataApiService,
    private authService: AuthService,
    private formBuilder: FormBuilder
    ) { }

  userAPI: UserInterface = {};
  pacientes: PacienteInterface={};
  paciente: PacienteInterface={};
  pacienteActualizar: PacienteInterface={};
  resultados: ResultadoInterface={};
  resultado: ResultadoInterface={};
  resultadoTmp: ResultadoInterface={};
  consultas: ConsultaInterface={};
  consulta: ConsultaInterface={};
  empleado: EmpleadoInterface={};
  tablaPermisos: TablaPermisosInterface = {};
  tablasPermisos: TablaPermisosInterface = {};
  historiasClinica: HistoriaClinicaInterface={};
  medico: MedicoInterface={};


  // valor para almacenar la edad del doctor o del asistente calculada a partir de la fecha_nacimiento
  edad;
  edadMeses;
  // Fecha minima de nacimiento (120 años)
  minFechaNacimiento = new Date("1900/01/01");
  // toma la fecha actual
  maxDate = new Date(Date.now());
  // toma la fecha actual
  flag_hora;
  msgError = 'No es posible agendar la cita';
  estudioEstatus = 0;
  historiaVacia = null;
  email = "" 
  medicoFlag = 0;
  medicoEnviarStatus = 0;
  flagInvitacion = 0;

  //Patrón para identificar un correo.
  emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //Patrón para identificar un nombre
  firstNamePattern: any = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/
  //Patrón para identificar un apellido 
  lastNamePattern: any = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/

  //Patrón para identificar un texto sin caracteres especiales
  textPattern: any=/^[^<>%$|&*;]*$/ 
  //Patrón para identificar un curp
  curpPattern: any= /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/
 
  estudioTmp;

  validarPacienteFormulario(){
    this.pacienteForm = this.formBuilder.group({
      numExpediente: ["", Validators.compose([Validators.min(1), Validators.max(999999)])],
      nombre: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(90), Validators.pattern(this.firstNamePattern)])],
      apellido_paterno: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(45), Validators.pattern(this.lastNamePattern)])],
      apellido_materno: ["", Validators.compose([Validators.minLength(3), Validators.maxLength(45), Validators.pattern(this.lastNamePattern)])],
      sexo: ["", Validators.compose([])],
      fecha_nacimiento: ["", Validators.compose([CustomValidators.minDate(this.minFechaNacimiento),CustomValidators.maxDate(this.maxDate)])],
      tipo_sangre: ["", Validators.compose([])], 
      curp: ["", Validators.compose([Validators.minLength(18),Validators.maxLength(18), Validators.pattern(this.curpPattern)])],
      entidad_nacimiento: ["", Validators.compose([Validators.minLength(2), Validators.maxLength(45), Validators.pattern(this.textPattern)])],
      entidad: ["", Validators.compose([Validators.minLength(2), Validators.maxLength(45), Validators.pattern(this.textPattern)])],
      nivel_socioeconomico: ["", Validators.compose([Validators.minLength(3), Validators.maxLength(90), Validators.pattern(this.textPattern)])],
      tipo_vivienda: ["", Validators.compose([Validators.minLength(3), Validators.maxLength(90), Validators.pattern(this.textPattern)])],
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


  validarCorreoFormulario(){ 
    this.emailForm = this.formBuilder.group({
      email: ["", Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(40), Validators.pattern(this.emailPattern)])],
    });
  }

  // Aqui se definen las reglas que seguirá cada cita reagenda
  validarEstudioEditarFormulario(){
    this.estudioEditarForm = this.formBuilder.group({
      tipoEstudio: ["", Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(90),Validators.pattern(this.textPattern)])],
      fecha_realizacion: ["", Validators.compose([Validators.required])],
      notasEstudio: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(500),Validators.pattern(this.textPattern)])]
    });
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

  ngOnInit() {
    this.userAPI = this.authService.getCurrentUser();
    this.validarPacienteFormulario();
    this.validarEstudioEditarFormulario();
    this.validarEstudioSubirFormulario();
    this.validarCorreoFormulario();
    this.consultarOperador();
    this.listaTablas();
    this.userAPI = this.authService.getCurrentUser();
    window.scroll(0,0);
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

  download() {
    const url = 'https://semindigital.com:8090' + this.resultado.file;    
    const name = this.resultado.tipoEstudio +" "+ this.resultado.creacion.split('T')[0] +" "+ this.paciente.nombre +" "+ this.paciente.apellido_paterno + " " + this.paciente.apellido_materno;
    FileSaver.saveAs(url, name);
  }

  downloadDicom() {
    const url = 'https://semindigital.com:8090' + this.resultado.fileDicom;    
    const name = this.resultado.tipoEstudio +" "+ this.resultado.creacion.split('T')[0] +" "+ this.paciente.nombre +" "+ this.paciente.apellido_paterno + " " + this.paciente.apellido_materno;
    FileSaver.saveAs(url, name);
  }

  // funcion para abrir modal se sub categorias
  verPaciente(id, modal){
    this.consultarPacienteOp(id);
    console.log("abriendo modal");
    this.modalService.open(modal, {
      size: 'xl'
    });
  }


    // funcion para abrir modal de estudios
    verModalMd(modal){
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


  // funcion para abrir modal se sub estudios
  verEstudio(resultado, modal){
    this.resultado = resultado
    console.log("abriendo modal");
    console.log(this.resultado)
    this.modalService.open(modal, {
      size: 'xl'
    });
  }

  purgarEstudio(){
    this.resultadoTmp.tipoEstudio = null;
    this.resultadoTmp.fecha_realizacion = null;
    this.resultadoTmp.notasEstudio = null;
    this.estudioEstatus = 0;
  }

  // funcion para abrir modal se sub categorias
  checarPaciente(modal){
    console.log("abriendo modal");
    this.modalService.open(modal, {
      size: 'xl'
    });
  }

  // Si se ejecutan los detalles del paciente calcula sus años de edad a partir de la fecha de nacimiento
  calcularEdadPaciente(fecha_nacimiento){
    this.edad = moment().diff(this.paciente.fecha_nacimiento, 'years');
    this.edadMeses = moment().diff(this.paciente.fecha_nacimiento, 'months');
  }

  //vacia formulario de acompañante
  vaciarPacienteCampos(){
    this.paciente ={};
  }

  // Rellena los datos de pago en caso de abrir #pagoActualizarModal
  rellenarPacienteCampos(){
    this.pacienteActualizar.id = this.paciente.id;
    this.pacienteActualizar.nombre = this.paciente.nombre;
    this.pacienteActualizar.apellido_paterno = this.paciente.apellido_paterno;
    this.pacienteActualizar.apellido_materno = this.paciente.apellido_materno;
    this.pacienteActualizar.sexo = this.paciente.sexo;
    this.pacienteActualizar.email = this.paciente.email;
    this.pacienteActualizar.fecha_nacimiento = this.paciente.fecha_nacimiento;
    this.pacienteActualizar.tipo_sangre = this.paciente.tipo_sangre;
    this.pacienteActualizar.curp = this.paciente.curp;
    this.pacienteActualizar.entidad_nacimiento = this.paciente.entidad_nacimiento;
    this.pacienteActualizar.entidad = this.paciente.entidad;
    this.pacienteActualizar.nivel_socioeconomico = this.paciente.nivel_socioeconomico;
    this.pacienteActualizar.tipo_vivienda = this.paciente.tipo_vivienda;
    this.pacienteActualizar.discapacidad = this.paciente.discapacidad;
    this.pacienteActualizar.grupoEtnico = this.paciente.grupoEtnico;
    this.pacienteActualizar.religion = this.paciente.religion;
    this.pacienteActualizar.ocupacion = this.paciente.ocupacion;
    this.pacienteActualizar.tipoDomicilio = this.paciente.tipoDomicilio;
    this.pacienteActualizar.calle = this.paciente.calle;
    this.pacienteActualizar.colonia = this.paciente.colonia;
    this.pacienteActualizar.num_interior = this.paciente.num_interior;
    this.pacienteActualizar.num_exterior = this.paciente.num_exterior;
    this.pacienteActualizar.cp = this.paciente.cp;
    this.pacienteActualizar.municipio = this.paciente.municipio;
    this.pacienteActualizar.localidad = this.paciente.localidad;
    this.pacienteActualizar.estado = this.paciente.estado;
    this.pacienteActualizar.telefonoCasa = this.paciente.telefonoCasa;
    this.pacienteActualizar.telefonoOficina = this.paciente.telefonoOficina;
    this.pacienteActualizar.telefonoCelular = this.paciente.telefonoCelular;
    this.pacienteActualizar.numExpediente = this.paciente.numExpediente;
  }

  //rellena los campos editables de cita
  rellenarCamposEditar(){
    this.resultadoTmp.id = this.resultado.id
    this.resultadoTmp.tipoEstudio = this.resultado.tipoEstudio 
    this.resultadoTmp.fecha_realizacion = this.resultado.fecha_realizacion
    this.resultadoTmp.notasEstudio = this.resultado.notasEstudio
  }

  //aviso de exito en una operacion en el api
  mensajeExito(){
    this.ngxNotificationService.sendMessage('Cambios realizados', 'success ', 'bottom-right');
  } 


  mensajeError(error){
    this.spinner.hide();
    this.estudioEstatus = 3
    this.ngxNotificationService.sendMessage('Ha ocurrido un error ', 'danger ', 'bottom-right');
    console.log(error);
    this.msgError = error.error.status
  }

  reiniciarFlagCompartir(){ 
    this.medicoFlag = 0;
    this.medicoEnviarStatus = 0;
  }

  enviarInvitacion(){
    this.tablaPermisos = {}
    this.tablaPermisos.caducidad=new Date(this.maxDateToken).getFullYear() + "-" + (new Date(this.maxDateToken).getMonth()+1) + "-" + new Date(this.maxDateToken).getDate();
    this.tablaPermisos.Paciente = this.paciente.id
    this.tablaPermisos.creador = this.userAPI.first_name+" "+this.userAPI.last_name
    this.tablaPermisos.editor = this.userAPI.first_name+" "+this.userAPI.last_name
    if(this.medicoFlag==1){
      this.tablaPermisos.tipo = "INTERNO"
      this.tablaPermisos.Medico = this.medico[0].id;
    }
    if(this.medicoFlag==2){
      this.tablaPermisos.tipo = "EXTERNO"
      this.tablaPermisos.token = Math.random().toString(36).substring(2,12)+Math.random().toString(36).substring(2,12)+Math.random().toString(36).substring(2,12)+Math.random().toString(36).substring(2,12)+Math.random().toString(36).substring(2,12)+Math.random().toString(36).substring(2,12);
      this.tablaPermisos.email = this.email;
    }
    this.medicoEnviarStatus = 1;
    this.flagInvitacion = 1;
    console.log(this.tablaPermisos)
    this.spinner.show();
    this.dataApiService.crearTablaPermisoOp(this.tablaPermisos)
          .subscribe(() => {  
          console.log("Crear Tabla"); 
          this.mensajeExito();
          this.consularTablaPermisos();
          this.spinner.hide();
          this.medicoEnviarStatus = 2
        }, error => this.crearTablaError(error)
        ); 
  }

  // funcion para busqueda de un medico mediante su email
  consultarMedico(){
    this.medicoFlag=0;
    this.spinner.show();
    console.log(this.emailForm.invalid)
    if(!this.emailForm.invalid){
      this.dataApiService.consultarEmailMedico(this.email)
      .subscribe((
        data : MedicoInterface) => { this.medico = data; 
        this.mensajeExito();
        this.spinner.hide();
        console.log("Medico Cargado")
        console.log(this.medico);
        if(this.medico){
          // @ts-ignore
          if(this.medico[0]){
            console.log("Existe")
            this.medicoFlag=1;
          }
          else{
            console.log("No Existe")
            this.medicoFlag=2;
          }
        }
      }, error => this.mensajeError(error)  
      ); 
    }
  }

  
  consultarOperador(){
    this.spinner.show();  
    this.dataApiService.consultarOperador(this.userAPI.id_sem) 
    .subscribe((
      data : EmpleadoInterface) => { this.empleado = data; 
      this.consultarPacientesOp(); 
    }, error => this.mensajeError(error) 
      ); 
  }

  consularTablaPermisos(){
    this.spinner.show();
    this.dataApiService.consultarTablaPermisoOp(this.paciente.id,"Paciente")
      .subscribe((
        data : TablaPermisosInterface) => { this.tablasPermisos = data; 
        this.mensajeExito();
        this.spinner.hide();
        console.log("tablasPermisos Cargado")
        console.log(this.tablasPermisos);
        this.reiniciarTablaPer();
        //la tabla nececita reiniciarse al eliminar un item
        $("#listaTablas").dataTable().fnDestroy();
        this.consultarHistoriasClinicasOp();
      }, error => this.mensajeError(error)  
      ); 
  }


  // funcion para listado de todas las historias clinicas
  consultarHistoriasClinicasOp(){
    this.spinner.show();
    console.log("entra historia")
    this.historiaVacia = 0;
    this.historiasClinica = {};
    this.dataApiService.consultarHistoriasClinicasOp(this.paciente.id)
    .subscribe((
      data : ResultadoInterface) => { this.historiasClinica = data; 
      console.log("Historias Cargadas")
      console.log(this.historiasClinica) 
      this.spinner.hide();
      if(this.historiasClinica){
        // @ts-ignore
        if(this.historiasClinica.count == 0){
          this.historiaVacia = 1;
          this.historiasClinica ={}
          console.log("Sin historias")
        }
      }  
    }, error => this.mensajeError(error)  
    ); 
  }

  // Actualizar Estatus de acceso a expediente
  editarEstatusTablaPermisos(results){
    this.spinner.show();
    let operador
    operador = this.userAPI.first_name+" "+this.userAPI.last_name
    this.dataApiService.editarTablaPermisoOp(results, operador)
      .subscribe(() => {  
        this.mensajeExito();
        this.spinner.hide();
        this.consularTablaPermisos()
      }, error => this.mensajeError(error)  
      ); 
  }

  reiniciarTablaPer(){
    this.listaTablas();
  }

  reiniciarCompartir(){ 
    this.email = "" 
    this.medicoFlag = 0;
    this.medicoEnviarStatus = 0;
  }

  // funcion para listado de todos los pacientes
  consultarPacientesOp(){
    this.spinner.show();
    this.dataApiService.consultarPacientesOp()
    .subscribe((
      data : PacienteInterface) => { this.pacientes = data; 
      this.lista();
      console.log("Pacientes Cargado");
      this.spinner.hide();
      console.log(this.pacientes)
    }, error => this.mensajeError(error)  
    ); 
  }

  // funcion para listado de todos los pacientes
  consultarPacienteOp(id){
    this.spinner.show();
    this.paciente = null;
    this.dataApiService.consultarPacienteOp(id)
    .subscribe((
      data : PacienteInterface) => { this.paciente = data; 
      console.log("Paciente Cargado " + this.paciente.id);
      this.spinner.hide();
      console.log(this.paciente);
      this.calcularEdadPaciente(this.paciente.fecha_nacimiento);
    }, error => this.mensajeError(error)  
    ); 
  }

  // Actualizar Paciente
  actualizarPacienteOp(){
    this.spinner.show();
    this.dataApiService.actualizarPacienteOp(this.pacienteActualizar)
    .subscribe(() => {  
      this.consultarPacientesOp();
      this.paciente = this.pacienteActualizar;
      console.log("Actualizando Paciente"+ this.paciente.id); 
      this.spinner.hide();
      this.mensajeExito();
      //la tabla nececita reiniciarse al eliminar un item
      $("#lista").dataTable().fnDestroy(); 
    }, error => this.mensajeError(error)  
    ); 
  }

  // funcion para listado de todos los pacientes
  consultarResultadosOp(){
    this.spinner.show();
    this.dataApiService.consultarResultadosOp(this.paciente.id)
    .subscribe((
      data : ResultadoInterface) => { this.resultados = data; 
      this.listaRes();
      console.log("Resultados Cargados");
      this.spinner.hide();
      console.log(this.resultados)
    }, error => this.mensajeError(error)  
    ); 
  }

  // Actualizar Resultado
  actualizarResultadoOp(){
    this.spinner.show();
    let operador
    operador = this.userAPI.first_name+" "+this.userAPI.last_name
    this.dataApiService.editarResultadoOp(this.resultadoTmp.id, this.resultadoTmp.tipoEstudio, this.resultadoTmp.fecha_realizacion, this.resultadoTmp.notasEstudio, operador)
    .subscribe(() => {  
      console.log("Actualizando Resultado"+ this.resultadoTmp.id); 
      this.mensajeExito();
      this.spinner.hide();
      this.resultado.tipoEstudio = this.resultadoTmp.tipoEstudio; 
      this.resultado.notasEstudio = this.resultadoTmp.notasEstudio; 
      //la tabla nececita reiniciarse al eliminar un item
      //$("#lista").dataTable().fnDestroy(); 
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
    this.dataApiService.crearResultadoOp(formData)
    .subscribe(() => {  
      console.log("Creando Resultado"); 
      this.mensajeExito();
      this.spinner.hide();
      this.estudioEstatus = 2;
      //la tabla nececita reiniciarse al eliminar un item
      //$("#lista").dataTable().fnDestroy();
    }, error => this.mensajeError(error)  
    ); 
    }

    
  crearTablaError(error){
    this.spinner.hide();
    this.msgError = error.error.status;
    this.ngxNotificationService.sendMessage('Ha ocurrido un error ', 'danger ', 'bottom-right');
    this.medicoEnviarStatus = 3;
  }

  //funcion que maneja la table en jquery de pacientes
  lista(){
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

  //funcion que maneja la table en jquery de Resultados
  listaRes(){
    $(document).ready(function() {
      $('#listaRes').DataTable( {
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

  //funcion que maneja la table en jquery de Notas
  listaTablas(){
    $(document).ready(function() {
      $('#listaTablas').DataTable( {
        "language": {
          "sProcessing":     "Procesando...",
          "sLengthMenu":     "Mostrar _MENU_ Accesos a Expediente",
          "sZeroRecords":    "No se encontraron resultados",
          "sEmptyTable":     "Ningún dato disponible en esta tabla",
          "sInfo":           "Mostrando Accesos a Expediente del _START_ al _END_ de un total de _TOTAL_ Accesos a Expediente",
          "sInfoEmpty":      "Mostrando Accesos a Expediente del 0 al 0 de un total de 0 registros",
          "sInfoFiltered":   "(filtrado de un total de _MAX_ Accesos a Expediente)",
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
