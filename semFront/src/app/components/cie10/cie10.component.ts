import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxNotificationService } from 'ngx-notification';
import { NgxSpinnerService } from "ngx-spinner";
import { DataApiService } from '../../services/data-api.service';
import { CIE10Interface } from '../../models/cie10-interface';

@Component({
  selector: 'app-cie10',
  templateUrl: './cie10.component.html',
  styleUrls: ['./cie10.component.css']
})
export class Cie10Component implements OnInit {
  queryForm: FormGroup;
  query;
  //Patrón para identificar un texto sin caracteres especiales
  textPattern: any = /^[^<>%$|&*;]*$/;
  enfermedades: CIE10Interface = {};
  initialFlag =false;

  constructor(
    private formBuilder: FormBuilder,
     private ngxNotificationService: NgxNotificationService, 
     private spinner: NgxSpinnerService,
     private dataApiService: DataApiService
     ) { }

  ngOnInit() {
    this.validarQueryFormulario();
    window.scroll(0,0);
  }

  //detecta el enter en la barra del buscador
  onKeydown(event) {
    if (event.key === "Enter") {
      this.consultarEnfermedades();
    }
  }

  // Obtener enfermedades 
  consultarEnfermedades() {
    this.spinner.show();  
    this.dataApiService.consultarEnfermedades(this.query)
    .subscribe((data: CIE10Interface) => {
      this.enfermedades = data;
      this.mensajeExito();
      this.spinner.hide();  
      this.initialFlag= true;
    }, (error) => {
      this.mensajeError(error);
    })
  }

  validarQueryFormulario(){
    this.queryForm = this.formBuilder.group({
      query: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(90), Validators.pattern(this.textPattern)])], });
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
