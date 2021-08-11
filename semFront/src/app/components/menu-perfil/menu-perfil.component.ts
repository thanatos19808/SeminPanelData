import { Component, OnInit } from '@angular/core';
import { NgForm }   from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { NgxNotificationService } from 'ngx-notification';
import { NgxSpinnerService } from "ngx-spinner";
import { NgbModal} from '@ng-bootstrap/ng-bootstrap'; 
import { Router } from "@angular/router";

import { DataApiService } from "../../services/data-api.service";
import { AuthService} from "../../services/auth.service";

import { UserInterface } from "../../models/user-interface";
import { PacienteInterface } from "../../models/paciente-interface"; 

import * as moment from 'moment';
import * as JSZip from 'jszip';
declare var $: any;
declare var require: any
const FileSaver = require('file-saver');
let zipFile: JSZip = new JSZip();

@Component({
  selector: 'app-menu-perfil',
  templateUrl: './menu-perfil.component.html',
  styleUrls: ['./menu-perfil.component.css']
})
export class MenuPerfilComponent implements OnInit {

  pacienteForm: FormGroup;
  imagenSubirForm: FormGroup;

  constructor(
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private ngxNotificationService: NgxNotificationService,
    private dataApiService: DataApiService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    ) { }

  paciente: PacienteInterface={};
  pacienteActualizar: PacienteInterface={};
  userAPI: UserInterface = {};
  // valor para almacenar la edad del doctor o del asistente calculada a partir de la fecha_nacimiento
  edad;
  edadMeses;
  // Fecha minima de nacimiento (120 años)
  minFechaNacimiento = new Date("1900/01/01");
  // toma la fecha actual
  maxDate = new Date(Date.now());
  // toma la fecha actual
  flag_hora;
  msgError ="Error" 
  imagenEstatus = 0;

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

  validarPacienteFormulario(){
    this.pacienteForm = this.formBuilder.group({
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
      telefonoCasa: ["", Validators.compose([Validators.required, Validators.min(1000000000), Validators.max(9999999999)])],
      telefonoOficina: ["", Validators.compose([Validators.required, Validators.min(1000000000), Validators.max(9999999999)])],
      telefonoCelular: ["", Validators.compose([Validators.required, Validators.min(1000000000), Validators.max(9999999999)])], });
  }

  ngOnInit() {
    this.spinner.show();
    this.userAPI = this.authService.getCurrentUser();
    this.validarPacienteFormulario();
    this.consultarPaciente();
    this.validarSubirImagen();
    window.scroll(0,0);
  }

  // Aqui se definen las reglas que seguirá imagen subida
  validarSubirImagen(){
    this.imagenSubirForm = this.formBuilder.group({
      imagen: ["", Validators.compose([Validators.required])],
    });
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.imagenSubirForm.get('imagen').setValue(file);
      // console.log(file);
    }
  }


  
  //Subir Imagen
  subirImagen(){
    this.imagenEstatus = 1;
    const formData = new FormData();
    formData.append('imagen', this.imagenSubirForm.get('imagen').value);
    this.dataApiService.actualizarPacienteImagen(formData, this.paciente.id)
      .subscribe(() => {  
        this.consultarPaciente();
        this.imagenEstatus=2;
        console.log("Actualizando Paciente"+ this.paciente.id); 
        this.mensajeExito();
      }, error => this.mensajeError(error)  
      );
    }

  // funcion para abrir modal se sub categorias
  verPaciente(modal){
    console.log("abriendo modal");
    this.modalService.open(modal, {
      size: 'lg'
    });
  }

  reiniciarValoresImagen(){
    this.imagenEstatus = 0;
    console.log(this.imagenEstatus)
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
  }

  buscador(){
    this.router.navigate(["/inicio/lista"]); 
  }

  //aviso de exito en una operacion en el api
  mensajeExito(){
    this.ngxNotificationService.sendMessage('Cambios realizados', 'success ', 'bottom-right');
  } 

  mensajeError(error){
    this.spinner.hide();
    this.ngxNotificationService.sendMessage('Ha ocurrido un error ', 'danger ', 'bottom-right');
    console.log(error);
    if(this.imagenEstatus==1){
      this.imagenEstatus=3;
    }
  }

  // Consultar Paciente
  consultarPaciente(){
    this.dataApiService.consultarPaciente(this.userAPI.id_sem)
    .subscribe((
      data : PacienteInterface) => { this.paciente = data; 
      console.log("Paciente Cargado")
      console.log(this.paciente)
      this.spinner.hide();
      //calcula la edad del doctor y la guarda en la variable edad
      this.calcularEdadPaciente(this.paciente.fecha_nacimiento); 
    }, error => this.mensajeError(error)  
    ); 
  }

  // Actualizar Paciente
  actualizarPaciente(){
    this.dataApiService.actualizarPaciente(this.pacienteActualizar)
    .subscribe(() => {  
      this.consultarPaciente();
      console.log("Actualizando Paciente"+ this.paciente.id); 
      this.mensajeExito();
      this.paciente = this.pacienteActualizar
    }, error => this.mensajeError(error)  
    ); 
  }

}