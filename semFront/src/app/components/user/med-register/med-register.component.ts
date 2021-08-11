import { Component, OnInit } from '@angular/core';
import { NgForm }   from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { NgxNotificationService } from 'ngx-notification';
import { NgxSpinnerService } from "ngx-spinner";
import { NgbModal} from '@ng-bootstrap/ng-bootstrap'; 
import { Router } from "@angular/router";

import { DataApiService } from "../../../services/data-api.service";
import { AuthService} from "../../../services/auth.service";

import { UserInterface } from "../../../models/user-interface";
import { MedicoInterface } from "../../../models/medico-interface";
import { PacienteInterface } from "../../../models/paciente-interface"; 

@Component({
  selector: 'app-med-register',
  templateUrl: './med-register.component.html',
  styleUrls: ['./med-register.component.css']
})
export class MedRegisterComponent implements OnInit {

  usuarioForm: FormGroup;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private ngxNotificationService: NgxNotificationService,
    private spinner: NgxSpinnerService,
    private dataApiService: DataApiService,
    private authService: AuthService,
    private formBuilder: FormBuilder
    ) { }

  userCrear: UserInterface = {};
  userCrearTemp: UserInterface = {};
  medico: MedicoInterface = {};
  medicoSearch: MedicoInterface = {};
  pacienteSearch: PacienteInterface ={};

  flag= false;
  err= false; 
  exito= false; 
  procesando = false;
  msgError = "Servicio no disponible, por favor intente mas tarde."
  medicoFlag = 0;
  pacienteFlag = 0;

  
  tmpDate = new Date(Date.now());
  tmpDate2 = new Date(Date.now());
  tmpDate3 = new Date(Date.now());
  // Fecha minima de nacimiento (120 años)
  minFechaNacimiento  = this.tmpDate2.setMonth(this.tmpDate2.getMonth() - 1440);
  // toma la fecha actual y resta 21 años
  maxDate = this.tmpDate.setMonth(this.tmpDate.getMonth() - 252);
  // toma la fecha actual y suma dos años
  caducidad = this.tmpDate3.setMonth(this.tmpDate3.getMonth() + 24);
  
  //Patrón para identificar un correo.
  emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //Patrón para identificar un texto sin caracteres especiales
  textPattern: any=/^[^<>%$|&*;]*$/ 
  //Patrón para identificar un nombre
  firstNamePattern: any = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/
  //Patrón para identificar un apellido 
  lastNamePattern: any = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/

  validarUsuarioFormulario(){
    this.usuarioForm = this.formBuilder.group({
      nombre: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(90), Validators.pattern(this.firstNamePattern)])],
      primer_apellido: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(45), Validators.pattern(this.lastNamePattern)])],
      segundo_apellido: ["", Validators.compose([Validators.minLength(3), Validators.maxLength(45), Validators.pattern(this.lastNamePattern)])],
      telefono: ["", Validators.compose([Validators.required, Validators.min(1000000000), Validators.max(9999999999)])],
      sexo: ["", Validators.compose([Validators.required])],
      fecha_nacimiento: ["", Validators.compose([Validators.required,CustomValidators.minDate(this.minFechaNacimiento),CustomValidators.maxDate(this.maxDate)])],
      estado: ["", Validators.compose([Validators.required,Validators.minLength(2), Validators.maxLength(45), Validators.pattern(this.textPattern)])],
      especialidad: ["", Validators.compose([Validators.required,Validators.minLength(2), Validators.maxLength(45), Validators.pattern(this.textPattern)])],
      cedula: ["", Validators.compose([Validators.required, Validators.min(10000), Validators.max(9999999999)])],
      email: ["", Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(90), Validators.pattern(this.emailPattern)])],
      password: ["", Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(30), Validators.pattern(this.textPattern)])],
      password2: ["", Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(30), Validators.pattern(this.textPattern)])], });
  }


  ngOnInit() {
    this.validarUsuarioFormulario()
  }


  

  registerUser(){
    this.spinner.show();
    this.procesando = true;
    this.flag = true;
    this.authService.registerUser(this.userCrear.password, this.userCrear.password2, this.userCrear.email)
    .subscribe((
      data : UserInterface) => { this.userCrearTemp = data;
      console.log(this.userCrear)
      console.log("Registro")
      this.flag = true;
      this.medicoLogin();
    }, error => this.mensajeError(error)
      ); 
  }

  //función para login al sistema
  medicoLogin(){
    this.procesando=true
    console.log(this.userCrear)
      return this.authService.loginuser(this.userCrear.email, this.userCrear.password)
      .subscribe(
        data =>{
          this.authService.setToken(data.key);
          console.log("login exitoso")
          this.crearMedico()
      }, error => this.mensajeError(error)
      );
  }

  // Crear Medico
  crearMedico(){
    this.userCrear.room = Math.random().toString(36).substring(2,12)+Math.random().toString(36).substring(2,12)+Math.random().toString(36).substring(2,12)+Math.random().toString(36).substring(2,12)+Math.random().toString(36).substring(2,12)+Math.random().toString(36).substring(2,12);
    this.userCrear.caducidad = this.tmpDate3.getFullYear() +'-'+ (this.tmpDate3.getMonth()+1) +'-'+ this.tmpDate3.getDate();
    this.dataApiService.crearMedico(this.userCrear)
    .subscribe((
      data : MedicoInterface) => { this.medico = data;
      console.log("Medico creado");
      this.actualizarPerfilMedico();
    }, error => this.mensajeError(error)
      );
  }


  actualizarPerfilMedico(){
    console.log("actualizar perfil")
    this.dataApiService.actualizarPerfilMedico(this.medico.id)
    .subscribe(() => { 
      console.log("Actualizar perfil de Medico"+ this.medico.id); 
      this.mensajeExito();
      this.flag = true;
      this.spinner.hide();
      this.exito = true;
      setTimeout(() => {
        document.location.href = 'https://semindigital.com';
      }, 2000);
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

  consultarDisponibilidadEmail(){
    this.consultarMedico();
    this.consultarPaciente();
  }
 
  // funcion para busqueda de un medico mediante su email
  consultarMedico(){    
    this.medicoFlag = 0
    this.dataApiService.consultarEmailMedico(this.userCrear.email)
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
          this.medicoSearch = {}
        }
      }
    }, error => this.mensajeError(error)  
    ); 
  }


    // funcion para busqueda de un medico mediante su email
    consultarPaciente(){    
      this.pacienteFlag = 0
      this.dataApiService.consultarEmailPaciente(this.userCrear.email)
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
          }
        }
      }, error => this.mensajeError(error)  
      ); 
    }


  
  mensajeExito(){
    this.ngxNotificationService.sendMessage('Cambios realizados', 'success ', 'bottom-right');
  } 

  mensajeError(error){
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
    setTimeout(() => {
      this.router.navigateByUrl('/registro');
    }, 4000);
  }

}