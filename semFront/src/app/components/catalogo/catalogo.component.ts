import { Component, OnInit } from '@angular/core';
import { NgForm }   from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { NgxNotificationService } from 'ngx-notification';
import { NgxSpinnerService } from "ngx-spinner";
import { NgbModal} from '@ng-bootstrap/ng-bootstrap'; 

import { DataApiService } from "../../services/data-api.service";

import { EstudioInterface } from "../../models/estudio-interface";
import { QueryInterface } from "../../models/query-interface";

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {

  queryForm: FormGroup;
  query; 
  todosLista = true; 
  initialFlag =false;
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

  estudio: EstudioInterface ={};
  estudios: EstudioInterface={};
  consulta: QueryInterface ={};

  constructor(
    private modalService: NgbModal,
    private ngxNotificationService: NgxNotificationService,
    private spinner: NgxSpinnerService,
    private dataApiService: DataApiService,
    private formBuilder: FormBuilder
    ) { }

  //Patrón para identificar un texto sin caracteres especiales
  textPattern: any=/^[^<>%$|&*;]*$/ 

  ngOnInit() {
    this.validarQueryFormulario();
    window.scroll(0,0);
  }

  //detecta el enter en la barra del buscador
  onKeydown(event) {
    if (event.key === "Enter") {
      console.log(event);
      this.consultarEstudio();
    }
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

  validarQueryFormulario(){
    this.queryForm = this.formBuilder.group({
      query: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(90), Validators.pattern(this.textPattern)])], });
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
  verEstudios(modal){
    console.log("abriendo modal");
    this.modalService.open(modal, {
      size: 'lg'
    });
  }

  // funcion para listado de todos los estudios
  consultarEstudio(){
    this.spinner.show();  
    this.dataApiService.consultarEstudio(this.query,this.list)
    .subscribe((
      data : EstudioInterface) => { this.estudios = data; 
      this.mensajeExito();
      this.spinner.hide();  
      console.log("Estudio Cargado")
      console.log(this.estudios);
      this.initialFlag= true;
    }, error => this.mensajeError(error)  
    ); 
  }

  almacenarConsulta(){
    this.dataApiService.almacenarConsulta(this.query,"AGENDA")
    .subscribe((
      data : QueryInterface) => { this.consulta = data; 
      this.mensajeExito();
      console.log("Query registrada");
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
