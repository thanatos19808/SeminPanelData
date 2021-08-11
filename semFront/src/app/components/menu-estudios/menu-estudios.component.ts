import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxNotificationService } from 'ngx-notification';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap'; 
import { NgxSpinnerService } from "ngx-spinner";


import { FormControl, Form } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpModule } from '@angular/http';


import { DataApiService } from "../../services/data-api.service";
import { AuthService } from "../../services/auth.service";

import { UserInterface } from "../../models/user-interface";
import { CitaInterface } from "../../models/cita-interface";
import { ResultadoInterface } from "../../models/resultado-interface"; 


import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as JSZip from 'jszip';

declare var $: any;
declare var require: any
const FileSaver = require('file-saver');
let zipFile: JSZip = new JSZip();

@Component({
  selector: 'app-menu-estudios',
  templateUrl: './menu-estudios.component.html',
  styleUrls: ['./menu-estudios.component.css']
})
export class MenuEstudiosComponent implements OnInit {
  
  constructor(
    private modalService: NgbModal,
    private ngxNotificationService: NgxNotificationService,
    private spinner: NgxSpinnerService,
    private dataApiService: DataApiService,
    private authService: AuthService,
    private formBuilder: FormBuilder
    ) { }
 

  downloadPDF(){
    this.descargarPDF = false;
    var element = document.getElementById('pdfTable');
    html2canvas(element).then((canvas) =>{console.log(canvas)
    var imgData = canvas.toDataURL('image/png')
    var doc = new jsPDF()
    var width = doc.internal.pageSize.width;    
    var aspectwidth1= (width)*(9/16);
    doc.addImage(imgData, 'JPEG', 15, 5, 200, 160);
    doc.save("comprobante.pdf")
    })
}
  
  resultados: ResultadoInterface={};
  resultado: ResultadoInterface={};
  citas: CitaInterface ={};
  cita: CitaInterface ={};
  userAPI: UserInterface = {};
  
  razonCancelacion = 0;
  flagRembolso = 0;
  descargarPDF = true;

  ngOnInit() {
    window.scroll(0,0);
    this.spinner.show();
    this.userAPI = this.authService.getCurrentUser();
    this.consultarResultados();
    this.consultarPacienteCitas();
  }

  download() {
    let paciente
    paciente = this.userAPI.first_name+" "+this.userAPI.last_name
    const url = 'https://semindigital.com:8090' + this.resultado.file;    
    const name = this.resultado.tipoEstudio +" "+ this.resultado.creacion.split('T')[0] +" "+ paciente;
    FileSaver.saveAs(url, name);
  }

  downloadDicom() {
    let paciente
    paciente = this.userAPI.first_name+" "+this.userAPI.last_name
    const url = 'https://semindigital.com:8090' + this.resultado.fileDicom;    
    const name = this.resultado.tipoEstudio +" "+ this.resultado.creacion.split('T')[0] +" "+ paciente;
    FileSaver.saveAs(url, name);
  }

  // funcion para abrir modal se sub estudios
  verEstudio(resultado, modal){
    this.resultado = resultado
    console.log("abriendo modal");
    console.log(this.resultado)
    this.modalService.open(modal, {
      size: 'xl'
    });
  }

    // funcion para abrir modal se sub estudios
    verCita(cita, modal){
      this.descargarPDF = true;
      console.log(this.descargarPDF)
      this.cita = cita
      console.log("abriendo modal");
      console.log(this.cita)
      this.modalService.open(modal, {
        size: 'xl'
      });
    }

  
  // funcion para abrir modal se sub categorias
  verModal(modal){
    this.flagRembolso = 0;
    console.log("abriendo modal");
    this.modalService.open(modal, {
      size: 'xl'
    });
  }


  // funcion para abrir modal se sub categorias
  verModalg(modal){
    this.flagRembolso = 0;
    console.log("abriendo modal");
    this.modalService.open(modal, {
      size: 'lg'
    });
  }

    // funcion para abrir modal se sub categorias
    verModalFactura(modal){
      console.log("abriendo modal");
      this.modalService.open(modal, {
        size: 'xl'
      });
    }

    // Actualizar cita de Paciente
    editarCita(){
      this.flagRembolso = 1;
      let razon
      this.cita.estatus_rembolso = "SOLICITADO"
      switch (this.razonCancelacion) {
        case 1:
          razon = "No pude hacer el estudio por no cumplir las condiciones requeridas"
          break;
        case 2:
          razon = "Ya no requiero el estudio"
          break;
        case 3: 
          razon = "Requiero un cambio de estudio"
          break;
        case 4: 
          razon = "No me gusto el servicio"
          break;        
        case 5: 
          razon = "El personal no tiene buena actitud"
          break;        
        case 6: 
          razon = "Requiero un descuento adicional"
          break;                
      }
      if(!this.cita.id_pago){
        this.cita.estatus = 'CANCELADA' 
        this.cita.estatus_rembolso = 'APROBADO'
        console.log("no pagada")
      }
      this.dataApiService.editarCitaRem(this.cita.id,this.cita.estatus_rembolso,razon,this.cita.estatus)
      .subscribe(() => {  
        this.mensajeExito();
        this.flagRembolso = 2;
        this.consultarPacienteCitas(); 
        //la tabla nececita reiniciarse al eliminar un item
        $("#listaCitas").dataTable().fnDestroy(); 
      }, error => this.mensajeError(error)  
      ); 
    }
    
  //aviso de exito en una operacion en el api
  mensajeExito(){
    this.ngxNotificationService.sendMessage('Cambios realizados', 'success ', 'bottom-right');
  } 

  mensajeError(error){
    this.spinner.hide();
    this.flagRembolso = 3;
    this.ngxNotificationService.sendMessage('Ha ocurrido un error ', 'danger ', 'bottom-right');
    console.log(error);
  }

  // funcion para listado de todos los pacientes
  consultarResultados(){
    this.dataApiService.consultarResultados()
    .subscribe((
      data : ResultadoInterface) => { this.resultados = data; 
      this.lista();
      console.log("Resultados Cargados");
      console.log(this.resultados);
      this.spinner.hide();
    }, error => this.mensajeError(error)  
    ); 
  }

  // funcion para listado de todos los estudios
  consultarPacienteCitas(){
    this.citas={}
    this.dataApiService.consultarPacienteCitas()
    .subscribe((
      data : CitaInterface) => { this.citas = data; 
      this.listaCitas();
      this.mensajeExito();
      console.log("Citas Cargadas")
      console.log(this.citas);
      this.spinner.hide();
    }, error => this.mensajeError(error)  
    ); 
  } 

  
  //funcion que maneja la table en jquery de Estudios
  lista(){
    $(document).ready(function() {
      $('#lista').DataTable( {
        "language": {
          "sProcessing":     "Procesando...",
          "sLengthMenu":     "Mostrar _MENU_ Estudios",
          "sZeroRecords":    "No se encontraron resultados",
          "sEmptyTable":     "Ningún dato disponible en esta tabla",
          "sInfo":           "Mostrando Estudios del _START_ al _END_ de un total de _TOTAL_ Estudios",
          "sInfoEmpty":      "Mostrando Estudios del 0 al 0 de un total de 0 registros",
          "sInfoFiltered":   "(filtrado de un total de _MAX_ Estudios)",
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

  
//FRONT
  //funcion que maneja la table en jquery de Citas
  listaCitas(){
    $(document).ready(function() {
      $('#listaCitas').DataTable( {
        "language": {
          "sProcessing":     "Procesando...",
          "sLengthMenu":     "Mostrar _MENU_ Citas",
          "sZeroRecords":    "No se encontraron resultados",
          "sEmptyTable":     "Ningún dato disponible en esta tabla",
          "sInfo":           "Mostrando Citas del _START_ al _END_ de un total de _TOTAL_ Citas",
          "sInfoEmpty":      "Mostrando Citas del 0 al 0 de un total de 0 registros",
          "sInfoFiltered":   "(filtrado de un total de _MAX_ Citas)",
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
