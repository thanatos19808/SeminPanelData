import { Component, OnInit } from '@angular/core';
import { NgForm }   from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { NgxNotificationService } from 'ngx-notification';
import { NgxSpinnerService } from "ngx-spinner";
import { NgbModal} from '@ng-bootstrap/ng-bootstrap'; 
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router";

import { DataApiService } from "../../services/data-api.service";
import { AuthService } from "../../services/auth.service";

import { PromocionTicketInterface } from "../../models/promocionTicket-interface";
import { EstudioInterface } from "../../models/estudio-interface";
import { DisponibilidadInterface } from "../../models/disponibilidad-interface";
import { TiempoInterface } from "../../models/tiempo-interface";
import { CitaInterface } from "../../models/cita-interface";
import { UserInterface } from "../../models/user-interface";

import * as $ from 'jquery';


@Component({
  selector: 'app-promo-ticket',
  templateUrl: './promo-ticket.component.html',
  styleUrls: ['./promo-ticket.component.css']
})
export class PromoTicketComponent implements OnInit {

  loginForm: FormGroup;


  promoTickets: PromocionTicketInterface ={};
  promoTicket: PromocionTicketInterface ={};
  promoTicketRestar: PromocionTicketInterface ={};
  estudio: EstudioInterface ={};
  estudios: EstudioInterface={};
  disponibilidad: DisponibilidadInterface ={};
  tiempo: TiempoInterface ={};
  tiempos: TiempoInterface ={};
  citas: CitaInterface ={};
  cita: CitaInterface ={};
  user: UserInterface = {};
  userAPI: UserInterface = {};
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
  msgError = "Esta promocion no existe."  
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
  flagTicket = true; 
  flagExiste = true;
  flagLogin = false;
  noValido = false;
  msgLoginError= "Datos no validos";
  nombre = "";
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

  //Patrón para identificar un correo.
  emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  //Patrón para identificar un texto sin caracteres especiales
  textPattern: any=/^[^<>%$|&*;]*$/ 

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private ngxNotificationService: NgxNotificationService,
    private spinner: NgxSpinnerService,
    private dataApiService: DataApiService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
    ) { }


  // Aqui se definen las reglas que seguirá cada formulario.
  validarFormulario(){
    this.loginForm = this.formBuilder.group({
      email: ["", Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(40), Validators.pattern(this.emailPattern)])],
      password: ["", Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(30)])],
    });
  }

  validarOtroPacienteForm(){
    this.otroPacienteForm = this.formBuilder.group({
      otro_nombre_paciente: ["", Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100), Validators.pattern(this.textPattern)])], 
      otro_parentesco_paciente: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40), Validators.pattern(this.textPattern)])], 
      otro_fecha_nacimento: ["", Validators.compose([Validators.required, CustomValidators.minDate(this.minFechaNacimiento),CustomValidators.maxDate(this.maxFechaNacimiento)])],  });
  }

  correoMinusculas(){
    console.log("entra")
    this.user.email = this.user.email.toLowerCase();
  }

  ngOnInit() {
    window.scroll(0,0);
    this.userAPI = this.authService.getCurrentUser();
    this.consultarPromoTicket();
    console.log("usuario -------")
    console.log(this.userAPI)
    this.validarCitaFechaForm();
    this.validarOtroPacienteForm();
    this.validarFormulario();
  }

  onLogin(form){
    if(form.valid){
      this.spinner.show();
      return this.authService.loginuser(this.user.email, this.user.password)
      .subscribe(
        data =>{
          this.userAPI = data.user
          this.authService.setInterface(this.userAPI);
          this.authService.setToken(data.key);
          //Compara el tipo de usuario y si tiene un id_dem enlazado, en caso contrario no permite el login
          if(data.user.tipo == "Paciente" && data.user.id_sem){
            console.log("entra Paciente");
            this.spinner.hide();
            this.flagLogin = true;
          }else{
          // En caso de error regresa a la pagina de login
            console.log("no valido"); 
            localStorage.removeItem("currentUser");
            localStorage.removeItem("accessToken");
            this.loginError()  
          }
        },
          error => this.mensajeLoginError(error)  
      );
    }else{
      this.loginError();
    }
  }
  
  //en caso de un error en el login se muestra un mensaje durante 5 segundos
  loginError(){
    this.spinner.hide();
    this.noValido = true;
    console.log("no valido")
    setTimeout(() => {
      this.noValido = false;
      this.flagLogin = false;
    }, 5000);
  }

  //identifica el error de login 
  mensajeLoginError(error){
    this.spinner.hide();
    this.noValido = true;
    if (error.statusText== "Unknown Error"){
      this.msgLoginError = "No es posible consultar el expediente"  
    }
    else if (error.statusText== "Unauthorized"){
      this.msgLoginError = "Usuario o contraseña erroneas"
    }
    else if(error.statusText=="Too Many Requests"){
      this.msgLoginError = "Demasiados intentos errórneos"
    }
    setTimeout(() => {
      this.noValido = false;
      this.flagLogin = false;
    }, 5000);
  }  


  conteo(){
    console.log("entra")
    var deadline = new Date(this.promoTicket.caducidad).getTime();             
    var x = setInterval(function() {
    var currentTime = new Date().getTime();                
    var t = deadline - currentTime; 
    var days = Math.floor(t / (1000 * 60 * 60 * 24)); 
    var hours = Math.floor((t%(1000 * 60 * 60 * 24))/(1000 * 60 * 60)); 
    var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60)); 
    var seconds = Math.floor((t % (1000 * 60)) / 1000); 
    //@ts-ignore
    document.getElementById("day").innerHTML =days ; 
    //@ts-ignore
    document.getElementById("hour").innerHTML =hours; 
    //@ts-ignore
    document.getElementById("minute").innerHTML = minutes; 
    //@ts-ignore
    document.getElementById("second").innerHTML =seconds; 
    if (t < 0) {
      clearInterval(x); 
      document.getElementById("time-up").innerHTML = "PROMOCIÓN AGOTADA"; 
      document.getElementById("day").innerHTML ='0'; 
      document.getElementById("hour").innerHTML ='0'; 
      document.getElementById("minute").innerHTML ='0' ; 
      document.getElementById("second").innerHTML = '0'; 
    } 
    }, 1000);  
  }


  consultarPromoTicket(){ 
    this.spinner.show();  
    this.nombre =this.route.snapshot.paramMap.get('nombre'); 
    this.dataApiService.consultarPromoTicket(this.nombre)
    .subscribe((
      data : PromocionTicketInterface) => { this.promoTickets = data; 
      this.mensajeExito();
      //@ts-ignore
      this.promoTicket = this.promoTickets[0];
      console.log("Promo Cargada")
      console.log(this.promoTicket);
      if(this.promoTicket){ 
        this.conteo();
        this.verificarCaducidad();
        this.consultarCatalogoId();
      }
      this.spinner.hide();
    }, error => this.mensajeErrorPromo()  
    ); 
  }


  verificarCaducidad(){
    this.flagTicket = true;
    const tmpDate = new Date(Date.now());
        const fechaActual = new Date( tmpDate).getTime() / 1000
        const tmpDate2 = new Date(this.promoTicket.caducidad.split('T')[0]);
        const fechaPromo = new Date(tmpDate2).getTime() / 1000
        console.log(fechaActual)
        console.log(fechaPromo)
        if(fechaPromo > fechaActual){
          console.log("aun no caduca") 
          if(this.promoTicket.numVentas>0){
            this.flagTicket = true;
          }
          else{
            this.flagTicket = false;
          }
          
        }else{
          console.log("Caduca")
          this.flagTicket = false;
        }
  }


  restarPromoTicket(){ 
    console.log("restando")
    this.dataApiService.restarPromoTicket(this.promoTicket.id)
    .subscribe((
      data : PromocionTicketInterface) => { this.promoTicketRestar = data; 
      this.mensajeExito();
      console.log("Promo Cargada")
    }, error => this.mensajeError(error)  
    ); 
  }

  onRegistro(){   
    this.router.navigate(['/registro']);
  }

  consultarCatalogoId(){ 
    this.spinner.show();  
    this.dataApiService.consultarCatalogoId(this.promoTicket.estudioInicial)
    .subscribe((
      data : PromocionTicketInterface) => { this.estudio = data; 
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

    // funcion para abrir modal de estudios
    verEstudiosMd(modal){
      console.log("abriendo modal");
      this.modalService.open(modal, {
        //@ts-ignore
        size: 'md'
      });
    }

  validarCitaFechaForm(){
    this.citaFechaForm = this.formBuilder.group({
      fecha_cita: ["", Validators.compose([Validators.required, CustomValidators.minDate(this.minDate),CustomValidators.maxDate(this.maxDate)])], 
    },{validator: this.isSunday('fecha_cita')});
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
    this.restarPromoTicket()
    this.crearCitaList()    
    setTimeout(() => {
      this.router.navigate(['/inicio/carrito']);
    }, 500);
  }


  carrito(){
    this.asignarDatosCita() 
    this.restarPromoTicket()
    this.crearCitaList()
  }


  // Crear Cita
  crearCitaList(){
    this.dataApiService.crearCitaList(this.cita, this.promoTicket)
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
      this.cita.nombre_promocion = this.promoTicket.titulo;
      this.cita.id_sala= this.sala;
      this.cita.otro_parentesco_paciente = this.otro_parentesco_paciente;
      this.cita.otro_nombre_paciente = this.otro_nombre_paciente;
      this.cita.otro_fecha_nacimento = this.otro_fecha_nacimento;
      if(this.cita.id_sala == "0"){
        this.cita.id_sala = "2";
      }
      this.cita.prueba= this.estudio.prueba;
      this.cita.categoria= this.estudio.categoria;
      this.cita.precioVenta= this.promoTicket.precioVenta;
      this.cita.Sucursal = this.sucursalSelecionada.Sucursal.id;
      console.log(this.cita)
    }else if(!this.flagAgenda){
      console.log("EXTERNA")
      this.cita.tipo_cita= "EXTERNA";
      this.cita.promocion= "true";
      this.cita.nombre_promocion = this.promoTicket.titulo;
      this.cita.prueba= this.estudio.prueba;
      this.cita.categoria= this.estudio.categoria;
      this.cita.precioVenta= this.promoTicket.precioVenta;
      this.cita.Sucursal = "2";
      this.cita.otro_parentesco_paciente = this.otro_parentesco_paciente;
      this.cita.otro_nombre_paciente = this.otro_nombre_paciente;
      this.cita.otro_fecha_nacimento = this.otro_fecha_nacimento;
      console.log(this.cita)
    }else if(!this.flagCita){
      console.log("ABIERA")
      this.cita.tipo_cita= "ABIERTA";
      this.cita.promocion= "true";
      this.cita.nombre_promocion = this.promoTicket.titulo;
      this.cita.prueba= this.estudio.prueba;
      this.cita.categoria= this.estudio.categoria;
      this.cita.precioVenta= this.promoTicket.precioVenta;
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

  mensajeErrorPromo(){
    this.flagTicket = false;
    this.flagExiste = false;
    this.spinner.hide();  
    this.ngxNotificationService.sendMessage('Ha ocurrido un error', 'danger ', 'bottom-right');
    console.log(this.msgError)
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 5000);
  }
}