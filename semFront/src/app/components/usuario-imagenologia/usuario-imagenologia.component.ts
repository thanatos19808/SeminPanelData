import { Component, OnInit } from '@angular/core';
import { DataApiService } from '../../services/data-api.service';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap'; 
import { ViewChild } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { DicomPacienteInterface } from '../../models/dicomPaciente-interface';
import { UserInterface } from '../../models/user-interface'
import { AuthService } from '../../services/auth.service' 


@Component({
  selector: 'app-usuario-imagenologia',
  templateUrl: './usuario-imagenologia.component.html',
  styleUrls: ['./usuario-imagenologia.component.css']
})
export class UsuarioImagenologiaComponent implements OnInit {

  historialModificaciones: any = {};
  selected_id: number = 0;
  p: number = 1;
  pacientes: DicomPacienteInterface = {};


  @ViewChild('modalExito', { static: false }) private modalExito;
  @ViewChild('historialCambios', { static: false }) private historialCambios;

  constructor(
    private authService: AuthService,
    private dataApiService: DataApiService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
  ) { }

  private userAPI: UserInterface = {}


  ngOnInit() {
    this.userAPI = this.authService.getCurrentUser()
    this.spinner.show()
    this.consultarPacientesDicom()
  }

  consultarPacientesDicom() {  
      this.dataApiService.consultarPacientesDicom(1, this.userAPI.id_sem)
      .subscribe((data: any) => {
        this.pacientes = data;
        this.spinner.hide();
      }, (error) => {
        console.log(error);
      })
  }

  descargar(path: string){
    this.dataApiService.descargarZip(path)
  }
}
