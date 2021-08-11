import { Component, OnInit } from '@angular/core';
import { NgForm }   from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { NgxNotificationService } from 'ngx-notification';
import { NgxSpinnerService } from "ngx-spinner";
import { NgbModal} from '@ng-bootstrap/ng-bootstrap'; 

import { DataApiService } from "../../services/data-api.service";
import { AuthService} from "../../services/auth.service";

import { UserInterface } from "../../models/user-interface";
import { MedicoInterface } from "../../models/medico-interface"; 


import * as moment from 'moment';
import * as JSZip from 'jszip';
declare var $: any;
declare var require: any
const FileSaver = require('file-saver');
let zipFile: JSZip = new JSZip();

@Component({
  selector: 'app-medico-perfil',
  templateUrl: './medico-perfil.component.html',
  styleUrls: ['./medico-perfil.component.css']
})
export class MedicoPerfilComponent implements OnInit {

  medicoForm: FormGroup;
  imagenSubirForm: FormGroup;

  constructor(
    private modalService: NgbModal,
    private ngxNotificationService: NgxNotificationService,
    private spinner: NgxSpinnerService,
    private dataApiService: DataApiService,
    private authService: AuthService,
    private formBuilder: FormBuilder
    ) { }

  medico: MedicoInterface={};
  medicoActualizar: MedicoInterface={};
  userAPI: UserInterface = {};
  // valor para almacenar la edad del doctor o del asistente calculada a partir de la fecha_nacimiento
  edad;
  edadMeses;
  // Fecha minima de nacimiento (120 años)
  
  tmpDate = new Date(Date.now());
  tmpDate2 = new Date(Date.now());
  // Fecha minima de nacimiento (120 años)
  minFechaNacimiento  = this.tmpDate2.setMonth(this.tmpDate2.getMonth() - 1440);
  // toma la fecha actual y resta 21 años
  maxDate = this.tmpDate.setMonth(this.tmpDate.getMonth() - 252);

  flag_hora;
  imagenEstatus = 0;
  msgError ="Error" 
  
  //Patrón para identificar un correo.
  emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //Patrón para identificar un nombre
  firstNamePattern: any = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/
  //Patrón para identificar un apellido 
  lastNamePattern: any = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/
  //Patrón para identificar un texto sin caracteres especiales
  textPattern: any=/^[^<>%$|&*;]*$/ 
  
  ngOnInit() {
    this.userAPI = this.authService.getCurrentUser();
    this.spinner.show();
    this.validarMedicoFormulario();
    this.validarSubirImagen();
    this.consultarMedico();
    window.scroll(0,0);
  }

  
  // Rellena los datos de pago en caso de abrir #pagoActualizarModal
  rellenarMedicoCampos(){
    this.medicoActualizar = this.medico;
  }

  validarMedicoFormulario(){
    this.medicoForm = this.formBuilder.group({
      sexo: ["", Validators.compose([])],
      fecha_nacimiento: ["", Validators.compose([Validators.required, CustomValidators.minDate(this.minFechaNacimiento),CustomValidators.maxDate(this.maxDate)])],
      calle: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(90), Validators.pattern(this.textPattern)])],
      colonia: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(45), Validators.pattern(this.textPattern)])],
      num_interior: ["", Validators.compose([Validators.maxLength(10), Validators.pattern(this.textPattern)])],
      num_exterior: ["", Validators.compose([Validators.maxLength(10), Validators.pattern(this.textPattern)])],
      especialidad: ["", Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(45), Validators.pattern(this.textPattern)])], 
      subespecialidad: ["", Validators.compose([Validators.maxLength(200), Validators.pattern(this.textPattern)])], 
      cp: ["", Validators.compose([Validators.min(10000), Validators.max(99999)])],
      municipio: ["", Validators.compose([Validators.minLength(2), Validators.maxLength(45), Validators.pattern(this.textPattern)])], 
      localidad: ["", Validators.compose([Validators.minLength(2), Validators.maxLength(200), Validators.pattern(this.textPattern)])],
      estado: ["", Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(45), Validators.pattern(this.textPattern)])], 
      telefono: ["", Validators.compose([Validators.required, Validators.min(1000000000), Validators.max(9999999999)])], 
      descripcion: ["", Validators.compose([Validators.minLength(2), Validators.maxLength(1000), Validators.pattern(this.textPattern)])],
     });
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
    }
  }


  // funcion para abrir modal se sub categorias
  verMedico(modal){
    console.log("abriendo modal");
    this.modalService.open(modal, {
      size: 'lg'
    });
  }

  reiniciarValoresImagen(){
    this.imagenEstatus = 0;
    console.log(this.imagenEstatus)
  }


  // Si se ejecutan los detalles del medico calcula sus años de edad a partir de la fecha de nacimiento
  calcularEdadMedico(fecha_nacimiento){
    this.edad = moment().diff(this.medico.fecha_nacimiento, 'years');
    this.edadMeses = moment().diff(this.medico.fecha_nacimiento, 'months');
  }

  //vacia formulario de acompañante
  vaciarMedicoCampos(){
    this.medico ={};
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


    // Consultar Medico
    //front
    consultarMedico(){
      this.dataApiService.consultarMedico(this.userAPI.id_sem)
      .subscribe((
        data : MedicoInterface) => { this.medico = data; 
        console.log("Medico Cargado"); 
        console.log(this.medico)
        this.spinner.hide();
        //calcula la edad del doctor y la guarda en la variable edad
        this.calcularEdadMedico(this.medico.fecha_nacimiento); 
      }, error => this.mensajeError(error)  
      ); 
    }
  
  // Actualizar Medico
  actualizarMedico(){
    this.dataApiService.actualizarMedico(this.medicoActualizar)
    .subscribe(() => {  
      console.log("Actualizando Medico"+ this.medico.id); 
      this.mensajeExito();
      this.medico = this.medicoActualizar;
      this.consultarMedico();
    }, error => this.mensajeError(error)  
    ); 
  }

  //Subir Imagen
  subirImagen(){
    this.imagenEstatus = 1;
    const formData = new FormData();
    formData.append('imagen', this.imagenSubirForm.get('imagen').value);
    formData.append('medicoSemin', this.medico.medicoSemin);
    this.dataApiService.actualizarMedicoImagen(formData, this.medico.id)
      .subscribe(() => {  
        this.consultarMedico();
        this.imagenEstatus=2;
        console.log("Actualizando Medico"+ this.medico.id); 
        this.mensajeExito();
      }, error => this.mensajeError(error)  
      );
    }





}



  
  






