import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxNotificationService } from 'ngx-notification';
import { NgxSpinnerService } from "ngx-spinner";
import { CustomValidators } from 'ngx-custom-validators';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap'; 
import * as moment from 'moment';

import { DataApiService } from "../../services/data-api.service";
import { AuthService } from "../../services/auth.service";

import { PacienteInterface } from "../../models/paciente-interface"; 
import { CitaMedicoInterface } from "../../models/citaMedico-interface";
import { MedicoInterface } from "../../models/medico-interface";
import { UserInterface } from "../../models/user-interface";

declare var $: any;

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit {
  title = 'easyfullcalendar';

  citaCrearFormulario: FormGroup; 
  citaEditarForm: FormGroup; 

  constructor(
    private authService: AuthService,
    private ngxNotificationService: NgxNotificationService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private dataApiService: DataApiService,
    private formBuilder: FormBuilder
    ) {}

  tmpDate = new Date(Date.now());
  tmpDate2 = new Date(Date.now());
  // toma la fecha actual y suma 6 meses
  maxDate = this.tmpDate.setMonth(this.tmpDate.getMonth() + 6);
  // toma la fecha actual y resta 1 dia
  minDate = this.tmpDate2.setDate(this.tmpDate2.getDate() -1);
  newCalendar = 0;
  msgError = 'No es posible agendar la cita';
  calendarioCargado = 0;
  citaEstatus = 0;
  estatusSeleccionado = 0;
  idEst = 0;
  idCita = null;
  numCita = null;
  editable = false;
  edad = null;
  edadMeses = null;
  notasTmp = null;
  userAPI: UserInterface = {};
  citasMedico: CitaMedicoInterface ={};
  citaMedicoTmp: CitaMedicoInterface ={};
  medico : MedicoInterface ={};

    
  //Patrón para identificar un texto sin caracteres especialees
  textPattern: any=/^[^<>%$|&*;]*$/

  //Patrón para identificar un correo.
  emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  //Patrón para identificar un nombre
  firstNamePattern: any = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/

  //Patrón para identificar un apellido 
  lastNamePattern: any = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/

  // Aqui se definen las reglas que seguirá cada cita reagenda
  validarCitaCrearFormulario(){
    this.citaCrearFormulario = this.formBuilder.group({
      fecha_cita: ["", Validators.compose([Validators.required, CustomValidators.minDate(this.minDate),CustomValidators.maxDate(this.maxDate)])],
      hora_inicio: ["", Validators.compose([Validators.required])],
      hora_final: ["", Validators.compose([Validators.required])],
      titulo: ["", Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(500), Validators.pattern(this.textPattern)])],
      tipo: ["", Validators.compose([Validators.required])],
      costo: ["", Validators.compose([Validators.min(0), Validators.max(99999)])],
      telefono: ["", Validators.compose([Validators.min(1000000000), Validators.max(9999999999)])],
      unidadEnvio: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(200), Validators.pattern(this.textPattern)])],
      notas: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(500),Validators.pattern(this.textPattern)])],
    },{validator: this.dateLessThan('hora_inicio', 'hora_final')});
  }

  // Aqui se definen las reglas que seguirá cada edicion
  validarCitaEditarFormulario(){
    this.citaEditarForm = this.formBuilder.group({
      notas: ["", Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(500),Validators.pattern(this.textPattern)])],
    });
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
  
  
  // Actualizar cita de Paciente
  editarCita(){
    let operador
    console.log(this.citaMedicoTmp)
    operador = this.userAPI.first_name+" "+this.userAPI.last_name
    this.dataApiService.editarCitaMedico(this.citaMedicoTmp.id, this.notasTmp, operador)
    .subscribe(() => {  
      this.mensajeExito();
      this.citaMedicoTmp.notas = this.notasTmp;
      this.citaMedicoTmp.editor = this.userAPI.first_name+" "+this.userAPI.last_name;
    }, error => this.mensajeError(error)  
    ); 
  } 

  consultarCitasMedico(){ 
    this.tablaCitas()
    this.calendarioCargado = 0;
    this.newCalendar = 0
    this.dataApiService.consultarCitasMedico()
    .subscribe((
      data : CitaMedicoInterface) => { this.citasMedico = data; 
      this.mensajeExito();
      this.calendarioCargado = 1;
      console.log("Citas Medico Cargadas")
      console.log(this.citasMedico);
      this.actualizarCalendario();
    }, error => this.mensajeError(error)  
    ); 
  }

  consultarMedico(){ 
    //front
    this.dataApiService.consultarMedico(this.userAPI.id_sem)
    .subscribe((
      data : MedicoInterface) => { this.medico = data; 
      this.mensajeExito();
      console.log("Medico Cargado")
      //console.log(this.medico)
      console.log(this.medico)
      this.spinner.hide();
    }, error => this.mensajeError(error)  
    ); 
  }


  // guarga el numero de la cita seleccionada y su id
  cambioId(numCita, id){
    if(this.citasMedico.results[numCita].estatus =='ACTIVA'){
      this.editable = true;
      console.log("editable")
    }else{
      this.editable = false;
      console.log("no editable")
    }
    this.numCita = numCita;
    this.idCita = id;
    if(this.citasMedico.results[numCita].Paciente){
      this.edad = moment().diff(this.citasMedico.results[numCita].Paciente.fecha_nacimiento, 'years');
      this.edadMeses = moment().diff(this.citasMedico.results[numCita].Paciente.fecha_nacimiento, 'months');
    }
    this.citaMedicoTmp = this.citasMedico.results[numCita]
    console.log(this.citasMedico.results[numCita])
  }

  actualizarCalendario(){
    $('#calendar').fullCalendar( 'removeEvents');
    var newevent = [];
    var color;
    if(this.citasMedico.results){
      for (var i = 0; i < this.citasMedico.results.length; i++) {
        if(this.citasMedico.results[i].estatus == 'ACTIVA'){
          if(this.citasMedico.results[i].tipo == 'RESTRINGIDA'){
            color = '#70407b ';
          }else{
            color = '#9AB638';
          }
        }else if(this.citasMedico.results[i].estatus == 'CERRADA'){
          color = '#B2EBFE';
        }else if(this.citasMedico.results[i].estatus == 'CANCELADA'){
          color = '#FF0000';
        }
        newevent[i]={
          color  : color, 
          numCita: i,
          id: this.citasMedico.results[i].id,
          title: this.citasMedico.results[i].titulo,
          start: this.citasMedico.results[i].fecha_cita+'T'+this.citasMedico.results[i].hora_inicio,
          end: this.citasMedico.results[i].fecha_cita+'T'+this.citasMedico.results[i].hora_final,
          editable: false
        };
      }
    }
    $('#calendar').fullCalendar('renderEvent', newevent, true);
    $('#calendar').fullCalendar('addEventSource', newevent);
    $('#calendar').fullCalendar('refetchEvents');
  }

  purgarCita(){
    this.citaEstatus = 0;
    this.citaMedicoTmp={}
    console.log("cita purgada")
    console.log(this.citaMedicoTmp)
  }
  


  agendarCita(){
    this.citaEstatus = 1
    let horaInicio
    // @ts-ignore
    horaInicio = this.citaMedicoTmp.hora_inicio;
    console.log(horaInicio)
    horaInicio = horaInicio.substring(0,5);
    console.log(horaInicio)
    horaInicio = horaInicio + ':01';
    console.log(horaInicio)
    this.citaMedicoTmp.hora_inicio = horaInicio
    // @ts-ignore
    let operador = this.userAPI.first_name+" "+this.userAPI.last_name
    let id = this.userAPI.id_sem
    //console.log(this.citaMedicoTmp)
    this.citaMedicoTmp.estatus = "ACTIVA"
    this.citaMedicoTmp.creador = operador
    this.citaMedicoTmp.editor = operador
    this.citaMedicoTmp.Medico = id
    this.dataApiService.crearCitaMedico(this.citaMedicoTmp)
    .subscribe(() => {  
      console.log("Actualizando cita Medico"); 
      this.mensajeExito();
      this.consultarCitasMedico();
      this.citaEstatus = 2
    }, error => this.mensajeError(error)  
    ); 
    
  }

  // funcion para abrir modal de estudios
  verEstudios(modal){
    console.log("abriendo modal");
    this.modalService.open(modal, {
      size: 'xl'
    });
  }

  // funcion para abrir el modal de estudios 
  verEstudiosId(cita: CitaMedicoInterface, modal){
    this.numCita= cita.id
    this.citaMedicoTmp = cita;
    if(this.citaMedicoTmp.estatus =='ACTIVA'){
      this.editable = true;
      console.log("editable")
    }else{
      this.editable = false;
      console.log("no editable")
    }
    this.edad = null;
    this.edadMeses = null;
    if(this.citaMedicoTmp.Paciente){
      this.edad = moment().diff(this.citaMedicoTmp.Paciente.fecha_nacimiento, 'years');
      this.edadMeses = moment().diff(this.citaMedicoTmp.Paciente.fecha_nacimiento, 'months');
    }
    console.log(this.citaMedicoTmp.id);
    this.modalService.open(modal, {
      size: 'xl'
    });
  }

  //Guarda el id de la cita que se desea cambiar su estatus
  idEstatus(id){
    this.estatusSeleccionado = 0;
    this.idEst = id;
    console.log(id)
  }

  // Actualizar cita de un Medico
  actualizarCitaEstatus(){
    let operador = this.userAPI.first_name+" "+this.userAPI.last_name
    this.dataApiService.actualizarCitaMedico(this.idEst, this.estatusSeleccionado, operador)
    .subscribe(() => {  
      this.mensajeExito();
      if(this.estatusSeleccionado==1){
        this.citaMedicoTmp.estatus = "CERRADA"
        this.citaMedicoTmp.editor = this.userAPI.first_name+" "+this.userAPI.last_name;
        this.editable = false;
      }else if(this.estatusSeleccionado==2){
        this.citaMedicoTmp.estatus = "CANCELADA"
        this.editable = false;
        this.citaMedicoTmp.editor = this.userAPI.first_name+" "+this.userAPI.last_name;
      }
      this.consultarCitasMedico();
      //la tabla nececita reiniciarse al eliminar un item
      $("#listaCitas").dataTable().fnDestroy(); 
    }, error => this.mensajeError(error)  
    ); 
  }



  //aviso de exito en una operacion en el api
  mensajeExito(){
    this.ngxNotificationService.sendMessage('Búsqueda exitosa', 'success ', 'bottom-right');
  } 

  mensajeError(error){
    this.spinner.hide();
    this.citaEstatus = 3
    this.ngxNotificationService.sendMessage('Ha ocurrido un error ', 'danger ', 'bottom-right');
    console.log(error);
  }

  //funcion que maneja la table en jquery
  tablaCitas(){
    $(document).ready(function() {
      $('#listaCitas').DataTable( {
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

  ngOnInit(){
  this.spinner.show();    
  this.validarCitaEditarFormulario();
  this.validarCitaCrearFormulario();
  this.userAPI = this.authService.getCurrentUser();
  this.consultarMedico();
    $("html, body").animate({ scrollTop: 0 }, "slow");
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
    this.consultarCitasMedico();
  }
}
