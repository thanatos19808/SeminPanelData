import { Component, OnInit } from '@angular/core';
import { NgxNotificationService } from 'ngx-notification';
import { NgxSpinnerService } from "ngx-spinner";
import { NgbModal} from '@ng-bootstrap/ng-bootstrap'; 
import { Router } from "@angular/router";  

import { UserInterface } from "../../models/user-interface";

import { DataApiService } from "../../services/data-api.service";
import { AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.component.html',
  styleUrls: ['./ajustes.component.css']
})
export class MenuAjustesComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    private ngxNotificationService: NgxNotificationService,
    private spinner: NgxSpinnerService,
    private dataApiService: DataApiService,
    private authService: AuthService,
    private router: Router
    ) { }

  userAPI: UserInterface = {};
  userCrearTemp: UserInterface = {};
  flag = false;

  ngOnInit() {
    window.scroll(0,0);
    this.userAPI = this.authService.getCurrentUser();
  }

  verModal(modal){
    console.log("abriendo modal");
    this.modalService.open(modal, {
      size: 'lg'
    });
  }

  //aviso de exito en una operacion en el api
  mensajeExito(){
    this.ngxNotificationService.sendMessage('Solicitud Aceptada', 'success ', 'bottom-right');
  } 

  mensajeExitoDes(){
    this.ngxNotificationService.sendMessage('Solicitud Aceptada, usted será desconectado en 5 segundos', 'success ', 'bottom-right');
  } 

  mensajeError(error){
    this.spinner.hide();  
    this.ngxNotificationService.sendMessage('Ha ocurrido un error ', 'danger ', 'bottom-right');
    console.log(error);
  }

  
  // funcion para abrir el modal de aviso
  verAviso(modal){
    console.log("abriendo modal aviso");
    this.modalService.open(modal, {
      size: 'lg'
    });
  }

  // Cambiar contraseña
  cambiarContrasena(){
    this.spinner.show();  
    this.dataApiService.cambiarContrasena(this.userAPI.email)
    .subscribe((
      data : UserInterface) => { this.userCrearTemp = data;
      this.flag = true;
      this.spinner.hide();  
      this.mensajeExito()
    }, error => this.mensajeError(error)
      ); 
  }

  // Quitar token a paciente
  logoutPaciente(){
    this.spinner.show();  
    console.log("entra");
    this.dataApiService.logoutUserFull()
    .subscribe(() => {  
      this.spinner.hide();  
      this.mensajeExitoDes();
    }, error => this.mensajeError(error)  
    ); 
    setTimeout(() => {
      this.authService.logoutuser()
      this.router.navigate(['/login']);
    }, 5000);
  }

}
