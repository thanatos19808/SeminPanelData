import { Component, OnInit } from '@angular/core';
import { DataApiService } from '../../services/data-api.service';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap'; 
import { ViewChild } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { DicomPacienteInterface } from '../../models/dicomPaciente-interface';


@Component({
  selector: 'app-operador-imagenologia',
  templateUrl: './operador-imagenologia.component.html',
  styleUrls: ['./operador-imagenologia.component.css']
})
export class OperadorImagenologiaComponent implements OnInit {
  historialModificaciones: any = {};
  selected_id: number = 0;
  p: number = 1;
  pacientes: DicomPacienteInterface = {};
  error_message: string = ""


  @ViewChild('modalExito', { static: false }) private modalExito;
  @ViewChild('historialCambios', { static: false }) private historialCambios;
  @ViewChild('modalError', { static: false }) private modalError;

  constructor(
    private dataApiService: DataApiService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.spinner.show()
    this.consultarPacientesDicom()
  }

  consultarPacientesDicom() {  
      this.dataApiService.consultarPacientesDicom(
        1,
      )
      .subscribe((data: any) => {
        this.pacientes = data;
        this.spinner.hide();
      }, (error) => {
        this.spinner.hide();
        this.error_message = error.error.error
        this.verModal(this.modalError, 'md') 
        console.log(error.error)
      })
  }

  reloadPage(){
    location.reload()
  }

  descargar(path: string){
    this.dataApiService.descargarZip(path)
  }

  getHistorial(id: any){
    this.spinner.show();
    this.dataApiService.getHistorial(id)
    .subscribe(( data : any) => 
      { 
        this.historialModificaciones = data;
        this.spinner.hide();
        this.verModal(this.historialCambios, 'md')
    }, 
      error => {
        this.spinner.hide();
        this.error_message = error.error.error
        this.verModal(this.modalError, 'md') 
        console.log(error.error)
      }
    )
  }

  liberarEstudio(result){
    this.spinner.show()
    this.dataApiService.liberarEstudio(result.id)
    .subscribe((data: any) => {
      let user = this.pacientes.data.find(i => i.id == result.id)
      user.liberado = !user.liberado
      this.spinner.hide()
    },
    error => {
      this.spinner.hide();
      this.error_message = error.error.error
      this.verModal(this.modalError, 'md') 
      console.log(error.error)
    })
  }


    verModal(modal, size, selected_id?){
      let modalRef = this.modalService.open(
        modal, {
        size: size
      });
    }

  closeModals(){
    this.modalService.dismissAll('modal')
  }
  

}
