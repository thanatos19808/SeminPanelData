import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxNotificationService } from 'ngx-notification';
import { NgxSpinnerService } from "ngx-spinner";
import { CustomValidators } from 'ngx-custom-validators';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap'; 


import * as moment from 'moment';
import * as JSZip from 'jszip';
declare var $: any;
declare var require: any
const FileSaver = require('file-saver');
let zipFile: JSZip = new JSZip();


import { DataApiService } from "../../services/data-api.service";
import { AuthService } from "../../services/auth.service";

import { MedicoInterface } from "../../models/medico-interface"; 
import { TablaPermisosInterface } from "../../models/tablaPermisos-interface"; 

declare var $: any;

@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.css']
})
export class AdministracionComponent implements OnInit {

  medicoForm: FormGroup;
  medicoEstatusForm;
  imagenSubirForm: FormGroup;
  
  constructor(
    private authService: AuthService,
    private ngxNotificationService: NgxNotificationService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private dataApiService: DataApiService,
    private formBuilder: FormBuilder
    ) { }


    medico: MedicoInterface ={};
    medicos: MedicoInterface ={};
    medicoActualizar: MedicoInterface={};
    tablasPermisos: TablaPermisosInterface = {};

    edad;
    edadMeses;
    // Fecha minima de nacimiento (120 años)
    minFechaNacimiento = new Date("1900/01/01");
    // toma la fecha actual
    maxDate = new Date(Date.now());
    // Fecha minima de nacimiento (120 años)
    maxFechaCaducidad = new Date("2100/01/01");
    msgError = 'Error desconocido';
    cambiarMedicoEstatus = 0;
    tipoSeleccionado = 0;
    imagenEstatus = 0;
    estatusSeleccionado = 0;

    listaTipo = ["Null","PENDIENTE","APROBADO","RECHAZADO"]

    //Patrón para identificar un texto sin caracteres especialees-
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



    reiniciarValoresImagen(){
      this.imagenEstatus = 0;
      console.log(this.imagenEstatus)
    }

    // Rellena los datos de pago en caso de abrir #pagoActualizarModal
  rellenarMedicoCampos(){
    this.medicoActualizar = this.medico
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


  // funcion para agregar un medico a la tabla permisos
  importarTablaPermisosMedico(){
    this.spinner.show();  
    this.dataApiService.importarTablaPermisosMedico(this.medicoActualizar.email)
    .subscribe(( 
      data : TablaPermisosInterface) => { this.tablasPermisos = data; 
      console.log("Importe Cargado")
      console.log(this.tablasPermisos)
    }, error => this.mensajeError(error)  
    ); 
  }

  actualizarEstatus(){
    this.medicoActualizar = this.medico;
  }

    
    consultarMedicoAdmin(){  
      console.log("rembolsos")
      this.spinner.show();  
      this.dataApiService.consultarMedicosAdmin(this.listaTipo[this.tipoSeleccionado])
      .subscribe((
        data : MedicoInterface) => { this.medicos = data; 
        this.mensajeExito();
        console.log("Medicos Cargadas")
        console.log(this.medicos);
        console.log(this.medico);
        //la tabla nececita reiniciarse
        $("#listaMed").dataTable().fnDestroy(); 
        this.tablaMed();
      }, error => this.mensajeError(error)  
      ); 
    }

  // Actualizar Medico
  actualizarMedico(){
    this.dataApiService.actualizarMedicoAdmin(this.medicoActualizar)
    .subscribe(() => {  
      console.log("Actualizando Medico"+ this.medicoActualizar.id); 
      this.mensajeExito();
      this.medico = this.medicoActualizar; 
      this.consultarMedicoAdmin();
    }, error => this.mensajeError(error)  
    ); 
  }


    // Actualizar Medico
    actualizarMedicoEstatus(){ //front
      if(this.medicoActualizar.verificado == 'APROBADO'){
        this.importarTablaPermisosMedico();
      }
      this.dataApiService.actualizarMedicoEstatusAdmin(this.medicoActualizar)
      .subscribe(() => {  
        console.log("Actualizando Medico"+ this.medicoActualizar.id); 
        this.mensajeExito();
        this.medico = this.medicoActualizar; 
        this.consultarMedicoAdmin();
      }, error => this.mensajeError(error)  
      ); 
    }

  //Subir Imagen
  subirImagen(){
    this.imagenEstatus = 1;
    const formData = new FormData();
    formData.append('imagen', this.imagenSubirForm.get('imagen').value);
    this.dataApiService.actualizarMedicoImagenAdmin(formData, this.medico.id)
      .subscribe(() => {  
        this.consultarMedicoAdmin();
        this.imagenEstatus=2;
        console.log("Actualizando Medico"+ this.medico.id); 
        this.mensajeExito();
      }, error => this.mensajeError(error)  
      );
    }

    onFileSelect(event) {
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        this.imagenSubirForm.get('imagen').setValue(file);
      }
    }

    actualizarEstatusMedico(){
      console.log("actualizar estatus medico")
    }

  
    // funcion para abrir modal se sub categorias
    verModal(medico,modal){
      this.medico = medico
      console.log("abriendo modal");
      console.log(this.medico)
      this.modalService.open(modal, {
        size: 'xl'
      });
    }


    // funcion para abrir modal se sub categorias
    verModalMed(modal){
      console.log("abriendo modal");
      this.modalService.open(modal, {
        size: 'xl'
      });
    }


    ngOnInit() {
      window.scroll(0,0);
      this.validarMedicoFormulario();
      this.validarEstatusMedicoFormulario();
      this.validarSubirImagen();
      this.tablaMed();
      this.consultarMedicoAdmin();
    }


    validarMedicoFormulario(){
      this.medicoForm = this.formBuilder.group({
        verificado: ["", Validators.compose([Validators.minLength(2), Validators.maxLength(45), Validators.pattern(this.textPattern)])], 
        nombre: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(90), Validators.pattern(this.firstNamePattern)])],
        apellido_paterno: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(45), Validators.pattern(this.lastNamePattern)])],
        apellido_materno: ["", Validators.compose([Validators.minLength(3), Validators.maxLength(45), Validators.pattern(this.lastNamePattern)])],
        sexo: ["", Validators.compose([])],
        especialidad: ["", Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(45), Validators.pattern(this.textPattern)])], 
        subespecialidad: ["", Validators.compose([Validators.maxLength(200), Validators.pattern(this.textPattern)])], 
        fecha_nacimiento: ["", Validators.compose([CustomValidators.minDate(this.minFechaNacimiento),CustomValidators.maxDate(this.maxDate)])],
        caducidad: ["", Validators.compose([Validators.required, CustomValidators.minDate(this.maxDate),CustomValidators.maxDate(this.maxFechaCaducidad)])],
        calle: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(90), Validators.pattern(this.textPattern)])],
        colonia: ["", Validators.compose([Validators.minLength(5), Validators.maxLength(45), Validators.pattern(this.textPattern)])],
        num_interior: ["", Validators.compose([Validators.maxLength(10), Validators.pattern(this.textPattern)])],
        num_exterior: ["", Validators.compose([Validators.maxLength(10), Validators.pattern(this.textPattern)])],
        cp: ["", Validators.compose([Validators.min(10000), Validators.max(99999)])],
        municipio: ["", Validators.compose([Validators.minLength(2), Validators.maxLength(45), Validators.pattern(this.textPattern)])], 
        localidad: ["", Validators.compose([Validators.minLength(2), Validators.maxLength(200), Validators.pattern(this.textPattern)])],
        estado: ["", Validators.compose([Validators.minLength(2), Validators.maxLength(45), Validators.pattern(this.textPattern)])], 
        telefono: ["", Validators.compose([Validators.min(1000000000), Validators.max(9999999999)])], 
        descripcion: ["", Validators.compose([Validators.minLength(2), Validators.maxLength(45), Validators.pattern(this.textPattern)])], 
        ranking: ["", Validators.compose([Validators.required,Validators.min(1), Validators.max(1000000)])], 
        estrellas: ["", Validators.compose([Validators.required,Validators.min(1), Validators.max(5)])], 
        cedula: ["", Validators.compose([Validators.required,Validators.min(1000), Validators.max(9999999999)])], 
      });
    }
  
    validarEstatusMedicoFormulario(){
      this.medicoEstatusForm = this.formBuilder.group({
        verificado: ["", Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(45), Validators.pattern(this.textPattern)])],        
      });
    }
  
    
    // Aqui se definen las reglas que seguirá imagen subida
    validarSubirImagen(){
      this.imagenSubirForm = this.formBuilder.group({
        imagen: ["", Validators.compose([Validators.required])],
      });
    }
  
    


  //aviso de exito en una operacion en el api
  mensajeExito(){
    this.spinner.hide();  
    this.ngxNotificationService.sendMessage('Búsqueda exitosa', 'success ', 'bottom-right');
  } 

  //aviso de error en una operacion en el api
  mensajeError(error){
    this.spinner.hide();  
    this.cambiarMedicoEstatus = 3
    this.ngxNotificationService.sendMessage('Ha ocurrido un error ', 'danger ', 'bottom-right');
    console.log(error);
    this.msgError = error.error.status
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



  //funcion que maneja la table en jquery
  tablaMed(){
    $(document).ready(function() {
      $('#listaMed').DataTable( {
        "language": {
          "sProcessing":     "Procesando...",
          "sLengthMenu":     "Mostrar _MENU_ Médicos",
          "sZeroRecords":    "No se encontraron resultados",
          "sEmptyTable":     "Ningún dato disponible en esta tabla",
          "sInfo":           "Mostrando Médicos del _START_ al _END_ de un total de _TOTAL_ Médicos",
          "sInfoEmpty":      "Mostrando Médicos del 0 al 0 de un total de 0 registros",
          "sInfoFiltered":   "(filtrado de un total de _MAX_ Médicos)",
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
