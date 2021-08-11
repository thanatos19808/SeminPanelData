import { Component, OnInit } from '@angular/core';
import { NgForm }   from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { NgxNotificationService } from 'ngx-notification';
import { NgxSpinnerService } from "ngx-spinner";
import { NgbModal} from '@ng-bootstrap/ng-bootstrap'; 
import { Router } from "@angular/router";

import { DataApiService } from "../../services/data-api.service";

import { PromocionInterface } from "../../models/promocion-interface";
import { EstudioInterface } from "../../models/estudio-interface";
import { DisponibilidadInterface } from "../../models/disponibilidad-interface";
import { TiempoInterface } from "../../models/tiempo-interface";
import { CitaInterface } from "../../models/cita-interface";

import * as $ from 'jquery';

@Component({
  selector: 'app-menu-promociones',
  templateUrl: './menu-promociones.component.html',
  styleUrls: ['./menu-promociones.component.css']
})
export class MenuPromocionesComponent implements OnInit {

   promocion: PromocionInterface ={};
   promociones: PromocionInterface ={};
   estudio: EstudioInterface ={};
   estudios: EstudioInterface={};
   disponibilidad: DisponibilidadInterface ={};
  tiempo: TiempoInterface ={};
  tiempos: TiempoInterface ={};
  citas: CitaInterface ={};
  cita: CitaInterface ={};

  citaFechaForm: FormGroup;
  otroPacienteForm: FormGroup;
  // valores temporal 
  tmpDate = new Date(Date.now());
  tmpDate2 = new Date(Date.now());
  // toma la fecha actual y suma 1 año
  maxDate = this.tmpDate.setMonth(this.tmpDate.getMonth() + 12);
  // toma la fecha actual y resta 1 dia
  minDate = this.tmpDate2.setDate(this.tmpDate2.getDate() - 1);
  // fecha de nacimiento minima
  minFechaNacimiento  = this.tmpDate2.setMonth(this.tmpDate2.getMonth() - 1440);
  // fecha de nacimiento maxima
  maxFechaNacimiento = new Date(Date.now());
  query; 
  apuntadorInicio;
  apuntadorFinal;
  tmpApuntador;
  fechaSeleccionada;
  initialFlag =false;
  clinicaFlag =false;
  flagAgenda = true;
  flagCita = true;
  flagFinal = false;
  todosLista = true;
  colisionId;
  colisionFlag = false;
  choque;
  sucursalSelecionada = null;
  fechaSelecionada = null;
  sucursalSelecionadaTmp = null;
  salaSelecionada = null;
  tiempoEstudio = null;
  sala = null;
  listaHoras = [];
  hora_inicio;
  hora_final;
  horaFlag =false;
  isToday;
  otro_parentesco_paciente = null;
  otro_nombre_paciente = null;
  otro_fecha_nacimento = null;
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
  ];

  
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private ngxNotificationService: NgxNotificationService,
    private spinner: NgxSpinnerService,
    private dataApiService: DataApiService,
    private formBuilder: FormBuilder
    ) { }


  //Patrón para identificar un texto sin caracteres especiales
  textPattern: any=/^[^<>%$|&*;]*$/ 

  ngOnInit() {
    this.spinner.show();
    window.scroll(0,0);
    this.consultarPromociones();
    this.validarOtroPacienteForm();
    this.validarCitaFechaForm();
  }

  consultarPromociones(){ 
    this.dataApiService.consultarPromociones()
    .subscribe((
      data : PromocionInterface) => { this.promociones = data; 
      this.mensajeExito();
      console.log("Promociones Cargadas")
      console.log(this.promociones);
      this.spinner.hide();
    }, error => this.mensajeError(error)  
    ); 
  }

  
  // funcion para abrir modal 
  verEstudiosId(promocion,modal){
    this.promocion=promocion;
    console.log(this.promocion);
    console.log("abriendo modal");
    this.modalService.open(modal, {
      size: 'lg'
    });
  }

  consultarCatalogoId(){ 
    this.dataApiService.consultarCatalogoId(this.promocion.estudioInicial)
    .subscribe((
      data : PromocionInterface) => { this.estudio = data; 
      this.mensajeExito();
      console.log("Promociones Cargadas")
      console.log(this.estudio);
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

  validarCitaFechaForm(){
    this.citaFechaForm = this.formBuilder.group({
      fecha_cita: ["", Validators.compose([Validators.required, CustomValidators.minDate(this.minDate),CustomValidators.maxDate(this.maxDate)])], 
    },{validator: this.isSunday('fecha_cita')});
  }

  validarOtroPacienteForm(){
    this.otroPacienteForm = this.formBuilder.group({
      otro_nombre_paciente: ["", Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100), Validators.pattern(this.textPattern)])], 
      otro_parentesco_paciente: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40), Validators.pattern(this.textPattern)])], 
      otro_fecha_nacimento: ["", Validators.compose([Validators.required, CustomValidators.minDate(this.minFechaNacimiento),CustomValidators.maxDate(this.maxFechaNacimiento)])],  });
  }

  //funcion que detecta si la fecha es domingo
  isSunday(date: string) {
    console.log("entra validador")
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

  compra(){
    this.asignarDatosCita()
    this.crearCitaList()
    setTimeout(() => {
      this.router.navigate(['/inicio/carrito']);
    }, 500);
  }

  
  carrito(){
    this.asignarDatosCita() 
    this.crearCitaList()
  }

  
  // Crear Cita
  crearCitaList(){
    this.dataApiService.crearCitaList(this.cita, this.promocion)
    .subscribe((
      data : CitaInterface) => { this.cita = data; 
      this.mensajeExito();
      console.log("Cita Creada!!!");
    }, error => this.mensajeError(error)
      );
  }


  //Dependiendo del tipo de cita asigna a la variable cita los datos correspondientes.
  asignarDatosCita(){
    this.cita={}
    if(this.flagAgenda && this.flagCita){
      console.log("AGENDADA")
      this.cita.fecha_cita= this.fechaSelecionada;
      this.cita.hora_inicio= this.hora_inicio+":01";
      this.cita.hora_final= this.hora_final;
      this.cita.tipo_cita= "AGENDADA";
      this.cita.promocion= "true";
      this.cita.nombre_promocion = this.promocion.titulo;
      this.cita.id_sala= this.sala;
      if(this.cita.id_sala == "0"){
        this.cita.id_sala = "2";
      }
      this.cita.prueba= this.estudio.prueba;
      this.cita.categoria= this.estudio.categoria;
      this.cita.precioVenta= this.promocion.precioVenta;
      this.cita.Sucursal = this.sucursalSelecionada.Sucursal.id;
      this.cita.otro_parentesco_paciente = this.otro_parentesco_paciente;
      this.cita.otro_nombre_paciente = this.otro_nombre_paciente;
      this.cita.otro_fecha_nacimento = this.otro_fecha_nacimento;
      console.log(this.cita)
    }else if(!this.flagAgenda){
      console.log("EXTERNA")
      this.cita.tipo_cita= "EXTERNA";
      this.cita.promocion= "true";
      this.cita.nombre_promocion = this.promocion.titulo;
      this.cita.prueba= this.estudio.prueba;
      this.cita.categoria= this.estudio.categoria;
      this.cita.precioVenta= this.promocion.precioVenta;
      this.cita.Sucursal = "2";
      this.cita.otro_parentesco_paciente = this.otro_parentesco_paciente;
      this.cita.otro_nombre_paciente = this.otro_nombre_paciente;
      this.cita.otro_fecha_nacimento = this.otro_fecha_nacimento;
      console.log(this.cita)
    }else if(!this.flagCita){
      console.log("ABIERA")
      this.cita.tipo_cita= "ABIERTA";
      this.cita.promocion= "true";
      this.cita.nombre_promocion = this.promocion.titulo;
      this.cita.prueba= this.estudio.prueba;
      this.cita.categoria= this.estudio.categoria;
      this.cita.precioVenta= this.promocion.precioVenta;
      this.cita.Sucursal = "2";
      this.cita.otro_parentesco_paciente = this.otro_parentesco_paciente;
      this.cita.otro_nombre_paciente = this.otro_nombre_paciente;
      this.cita.otro_fecha_nacimento = this.otro_fecha_nacimento;
      console.log(this.cita)
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
      if(i.includes(this.estudio.sala)){
        console.log("hallado")    
        this.sala = this.sucursalSelecionada[i]
        console.log(this.sala)
        break
      }
    }
  }
  if(!(this.sucursalSelecionada.id == this.sucursalSelecionadaTmp.id )) 
  {
    this.sala=null;
    this.sucursalSelecionadaTmp = this.sucursalSelecionada;
    for(let i in this.sucursalSelecionada){
      if(i.includes(this.estudio.sala)){
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

consultarCitas(){ 
  console.log("xxxxxxxxxxxxxxxxxxxx Consultar citas");
  console.log(this.fechaSelecionada);
  console.log(this.estudio.sala);
  console.log(this.sucursalSelecionada.Sucursal.nombreSucursal);
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
  if(newDate.getDay() == 5){
    console.log("sabado")
    this.apuntadorInicio = new Date(this.fechaSelecionada+"T"+this.sucursalSelecionada.Sucursal.hora_apertura_sab+"-06:00")
    this.tmpApuntador = new Date(this.fechaSelecionada+"T"+this.sucursalSelecionada.Sucursal.hora_apertura_sab+"-06:00")
    this.apuntadorFinal = new Date(this.fechaSelecionada+"T"+this.sucursalSelecionada.Sucursal.hora_apertura+"-06:00")
    final = new Date(this.fechaSelecionada+"T"+this.sucursalSelecionada.Sucursal.hora_cierre_sab+"-06:00")
    inicio = new Date(this.fechaSelecionada+"T"+this.sucursalSelecionada.Sucursal.hora_apertura_sab+"-06:00")
  }else if(newDate.getDay() == 6){
    console.log("domingo")
    this.apuntadorInicio = new Date(this.fechaSelecionada+"T"+this.sucursalSelecionada.Sucursal.hora_apertura_dom+"-06:00")
    this.tmpApuntador = new Date(this.fechaSelecionada+"T"+this.sucursalSelecionada.Sucursal.hora_apertura_dom+"-06:00")
    this.apuntadorFinal = new Date(this.fechaSelecionada+"T"+this.sucursalSelecionada.Sucursal.hora_apertura+"-06:00")
    final = new Date(this.fechaSelecionada+"T"+this.sucursalSelecionada.Sucursal.hora_cierre_dom+"-06:00")
    inicio = new Date(this.fechaSelecionada+"T"+this.sucursalSelecionada.Sucursal.hora_apertura_dom+"-06:00")
  }else{
    console.log("lun -vie")
    this.apuntadorInicio = new Date(this.fechaSelecionada+"T"+this.sucursalSelecionada.Sucursal.hora_apertura+"-06:00")
    this.tmpApuntador = new Date(this.fechaSelecionada+"T"+this.sucursalSelecionada.Sucursal.hora_apertura+"-06:00")
    this.apuntadorFinal = new Date(this.fechaSelecionada+"T"+this.sucursalSelecionada.Sucursal.hora_apertura+"-06:00")
    final = new Date(this.fechaSelecionada+"T"+this.sucursalSelecionada.Sucursal.hora_cierre+"-06:00")
    inicio = new Date(this.fechaSelecionada+"T"+this.sucursalSelecionada.Sucursal.hora_apertura+"-06:00")
  }
  this.apuntadorInicio.setSeconds(this.apuntadorInicio.getSeconds() + 1 );
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
  console.log(this.apuntadorInicio)
  console.log(this.apuntadorFinal)
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
            console.log("-------------------")
            console.log(this.apuntadorInicio)
            console.log(this.apuntadorFinal)
            console.log("---------------------------")
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
      citaInicio = new Date(this.fechaSelecionada+"T"+results.hora_inicio+"-06:00")
      citaFinal = new Date(this.fechaSelecionada+"T"+results.hora_final+"-06:00")
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

seleccionarHora(inicio, final){
  this.hora_inicio = inicio;
  this. hora_final = final;
  this.horaFlag = true;
}

purgarHorario(){
  this.listaHoras = [];
  this.hora_inicio = null;
  this. hora_final = null; 
  this.fechaSelecionada = null;
  this.horaFlag = false;
}

purgarOtroPaciente(){
  this.cita.otro_parentesco_paciente = null;
  this.cita.otro_nombre_paciente = null;
  this.cita.otro_fecha_nacimento = null;
  this.otro_parentesco_paciente = null;
  this.otro_nombre_paciente = null;
  this.otro_fecha_nacimento = null;
}


verEstudio(){
  console.log(this.estudio)
}

// funcion para listado de todos los estudios
consultarEstudio(){
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
  for(let i in this.tiempos.results[0]){
    if(i.includes(nombre)){
      console.log("hallado")
      console.log(this.tiempos.results[0][i])
      this.tiempo = this.tiempos.results[0][i]
      if(this.tiempo == 0){
        console.log("tiempo 0")
        this.flagAgenda = false;
      }
    }
  }
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

  //aviso de exito en una operacion en el api
  mensajeExito(){
    this.ngxNotificationService.sendMessage('Búsqueda exitosa', 'success ', 'bottom-right');
  } 

  mensajeError(error){
    this.spinner.hide();
    this.ngxNotificationService.sendMessage('Ha ocurrido un error ', 'danger ', 'bottom-right');
    console.log(error);
  }

}
