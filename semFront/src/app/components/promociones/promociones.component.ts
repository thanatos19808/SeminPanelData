import { Component, OnInit } from '@angular/core';
import { NgxNotificationService } from 'ngx-notification';
import { NgxSpinnerService } from "ngx-spinner";
import { NgbModal} from '@ng-bootstrap/ng-bootstrap'; 
import { Router } from "@angular/router";

import { DataApiService } from "../../services/data-api.service";
import { AuthService } from "../../services/auth.service";  
import { UserInterface } from "../../models/user-interface";

import { PromocionInterface } from "../../models/promocion-interface";

@Component({
  selector: 'app-promociones',
  templateUrl: './promociones.component.html',
  styleUrls: ['./promociones.component.css']
})

export class PromocionesComponent implements OnInit {

  public promocion: PromocionInterface ={};
  public promociones: PromocionInterface ={};
  private userAPI: UserInterface = {};

  constructor(
    private authService: AuthService,
    private modalService: NgbModal,
    private ngxNotificationService: NgxNotificationService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private dataApiService: DataApiService
    ) { }

  ngOnInit() {
    window.scroll(0,0); 
    this.consultarPromociones();
    this.userAPI = this.authService.getCurrentUser();
    console.log(this.userAPI)
    this.validarUsuario()
  }

  validarUsuario(){
    console.log(this.userAPI.tipo)
    if(this.userAPI.tipo == 'Paciente'){
      setTimeout(() => {
        this.router.navigate(['/inicio/promociones']);
      }, 100);
    }
  }

  consultarPromociones(){ 
    this.spinner.show();  
    this.dataApiService.consultarPromociones()
    .subscribe((
      data : PromocionInterface) => { this.promociones = data; 
      this.mensajeExito();
      this.spinner.hide();  
      console.log("Promociones Cargadas")
      console.log(this.promociones);
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

  // funcion para abrir modal 
  verEstudiosId(promocion,modal){
    this.promocion=promocion;
    console.log(this.promocion);
    console.log("abriendo modal");
    this.modalService.open(modal, {
      size: 'xl'
    });
  }

  onLogin(){   
    this.router.navigate(['/login']);
  }

  onRegistro(){   
    this.router.navigate(['/registro']);
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
