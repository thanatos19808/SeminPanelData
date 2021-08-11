import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxNotificationService } from 'ngx-notification';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from "@angular/router";

import { UserInterface } from "../../../models/user-interface";

import { DataApiService } from "../../../services/data-api.service";

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {

  olvidadaForm: FormGroup;

  constructor(
    private dataApiService: DataApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private ngxNotificationService: NgxNotificationService
    ) { }
  
  userCrearTemp: UserInterface = {};
  flag = false;
  err = false;
  email = null;
  //Patrón para identificar un correo.
  emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //Patrón para identificar un texto sin caracteres especiales
  
  validarOlvidadaFormulario(){
    this.olvidadaForm = this.formBuilder.group({
      email: ["", Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(90), Validators.pattern(this.emailPattern)])],});
  }

  ngOnInit() {
    this.validarOlvidadaFormulario()
  }

  // Cambiar contraseña
  cambiarContrasena(){
    console.log("entra")
    this.spinner.show();
    this.dataApiService.cambiarContrasena(this.email)
    .subscribe((
      data : UserInterface) => { this.userCrearTemp = data;
      this.flag = true;
      this.mensajeExito()
      this.spinner.hide();
    }, error => this.mensajeError(error)
      ); 
  }

  mensajeExito(){
    this.ngxNotificationService.sendMessage('Cambios realizados', 'success ', 'bottom-right'); 
    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 4000);
  } 

  mensajeError(error){
    this.spinner.hide();
    this.ngxNotificationService.sendMessage('Ha ocurrido un error ', 'danger ', 'bottom-right');
    console.log(error);
    this.err = true;
    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 4000);
  }
}