import { Component, OnInit } from '@angular/core';
import { NgxNotificationService } from 'ngx-notification';
import { NgxSpinnerService } from "ngx-spinner";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap'; 
import { Router } from "@angular/router";  

import { UserInterface } from "../../models/user-interface";

import { DataApiService } from "../../services/data-api.service";
import { AuthService} from "../../services/auth.service";

import { MedicoInterface } from "../../models/medico-interface";

@Component({
  selector: 'app-medico-ajustes',
  templateUrl: './medico-ajustes.component.html',
  styleUrls: ['./medico-ajustes.component.css']
})
export class MedicoAjustesComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    private ngxNotificationService: NgxNotificationService,
    private spinner: NgxSpinnerService,
    private dataApiService: DataApiService,
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
    ) { }

  userAPI: UserInterface = {};
  userCrearTemp: UserInterface = {};
  medico : MedicoInterface ={};
  medicoTmp : MedicoInterface ={};
  medicoTmpSab : MedicoInterface ={};
  medicoTmpDom : MedicoInterface ={};
  flag = false;
  citaEstatusL = 0; 
  citaEstatusS = 0;
  citaEstatusD = 0;
  msgError ="Error" 


  horarioForm: FormGroup; 
  horarioFormSab: FormGroup; 
  horarioFormDom: FormGroup; 


  ngOnInit() {
    window.scroll(0,0);
    this.validarHorarioFormulario();
    this.validarHorarioFormularioSab();
    this.validarHorarioFormularioDom();
    this.userAPI = this.authService.getCurrentUser();
    this.consultarMedico();
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
    if(this.citaEstatusL=1){
      this.citaEstatusL==3;
    }
    if(this.citaEstatusS=1){
      this.citaEstatusS==3;
    }
    if(this.citaEstatusD=1){
      this.citaEstatusD==3;
    } 
    console.log(error);
  }

  // funcion para abrir el modal de aviso
  verAviso(modal){
    console.log("abriendo modal aviso");
    this.modalService.open(modal, {
      size: 'lg'
    });
  }

  consultarMedico(){ 
    this.spinner.show();    
    this.dataApiService.consultarMedico(this.userAPI.id_sem)
    .subscribe((
      data : MedicoInterface) => { this.medico = data; 
      this.mensajeExito();
      console.log("Medico Cargado")
      this.spinner.hide();
      //console.log(this.medico)
      console.log(this.medico)
    }, error => this.mensajeError(error)  
    ); 
  }

  // Cambiar contraseña
  cambiarContrasena(){
    this.spinner.show();    
    this.dataApiService.cambiarContrasena(this.userAPI.email)
    .subscribe((
      data : UserInterface) => { this.userCrearTemp = data;
      this.flag = true;
      this.mensajeExito()
      this.spinner.hide();    
    }, error => this.mensajeError(error)
      ); 
  }

  // Quitar token a paciente
  logoutPaciente(){
    this.spinner.show();    
    console.log("entra");
    this.dataApiService.logoutUserFull()
    .subscribe(() => {  
      this.mensajeExitoDes();
      this.spinner.hide();    
    }, error => this.mensajeError(error)  
    ); 
    setTimeout(() => {
      this.authService.logoutuser()
      this.router.navigate(['/login']);
    }, 5000);
  }

 

  // Aqui se definen las reglas que seguirá cada cita reagenda
  validarHorarioFormulario(){
    this.horarioForm = this.formBuilder.group({
      hora_apertura: ["", Validators.compose([Validators.required])],
      hora_cierre: ["", Validators.compose([Validators.required])],
    },{validator: this.dateLessThan('hora_apertura', 'hora_cierre')});
  }
 
   // Aqui se definen las reglas que seguirá cada cita reagenda sabado
   validarHorarioFormularioSab(){
    this.horarioFormSab = this.formBuilder.group({
      hora_apertura_sab: ["", Validators.compose([Validators.required])],
      hora_cierre_sab: ["", Validators.compose([Validators.required])],
    },{validator: this.dateLessThan('hora_apertura_sab', 'hora_cierre_sab')});
  }
 
   // Aqui se definen las reglas que seguirá cada cita reagenda domingo
   validarHorarioFormularioDom(){
    this.horarioFormDom = this.formBuilder.group({
      hora_apertura_dom: ["", Validators.compose([Validators.required])],
      hora_cierre_dom: ["", Validators.compose([Validators.required])],
    },{validator: this.dateLessThan('hora_apertura_dom', 'hora_cierre_dom')});
  }
 
  
  rellenarHorarios(){
    this.citaEstatusL=0
    this.citaEstatusS=0
    this.citaEstatusD=0
    this.medicoTmp.id = this.medico.id
    this.medicoTmpSab.id = this.medico.id
    this.medicoTmpDom.id = this.medico.id
    this.medicoTmp.hora_apertura = this.medico.hora_apertura
    this.medicoTmp.hora_cierre = this.medico.hora_cierre
    this.medicoTmpSab.hora_apertura_sab = this.medico.hora_apertura_sab
    this.medicoTmpSab.hora_cierre_sab = this.medico.hora_cierre_sab
    this.medicoTmpDom.hora_apertura_dom = this.medico.hora_apertura_dom
    this.medicoTmpDom.hora_cierre_dom = this.medico.hora_cierre_dom 
  }

  actualizarHorarioMedico(){
    this.spinner.show();    
    this.citaEstatusL=1;
    console.log("Actualizando Horario")
    this.dataApiService.actualizarHorarioMedico(this.medicoTmp)
    .subscribe(() => {  
      this.mensajeExito();
      this.spinner.hide();    
      this.citaEstatusL=2;
      this.consultarMedico();
    }, error => this.mensajeError(error)   
    ); 
  }

  actualizarHorarioMedicoSab(){
    this.spinner.show();    
    this.citaEstatusS=1;
    console.log("Actualizando Horario Sab")
    this.dataApiService.actualizarHorarioMedicoSab(this.medicoTmpSab)
    .subscribe(() => {  
      this.mensajeExito();
      this.spinner.hide();    
      this.citaEstatusS=2;
      this.consultarMedico();
    }, error => this.mensajeError(error)   
    ); 
  }

  actualizarHorarioMedicoDom(){
    this.spinner.show();    
    this.citaEstatusD=1;
    console.log("Actualizando Horario Dom")
    this.dataApiService.actualizarHorarioMedicoDom(this.medicoTmpDom)
    .subscribe(() => {  
      this.mensajeExito();
      this.spinner.hide();    
      this.citaEstatusD=2;
      this.consultarMedico();
    }, error => this.mensajeError(error)   
    ); 
  }


  //funcion que compara la hora_inicio y hora_final 
  dateLessThan(from: string, to: string) {
    return (group: FormGroup): { [key: string]: any } => {
      const inputFrom = group.controls[from];
      const inputTo = group.controls[to];
      const bothFilled = inputFrom.value && inputTo.value;
      if (bothFilled && inputFrom.value >= inputTo.value) {
        return {
          dates: ""
        };
      }
      return {};
    }
  }

}
