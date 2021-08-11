import { Component, OnInit } from '@angular/core';
import { DataApiService } from '../../services/data-api.service';
import { DicomPacienteInterface } from '../../models/dicomPaciente-interface';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-radiologo-estudios',
  templateUrl: './radiologo-estudios.component.html',
  styleUrls: ['./radiologo-estudios.component.css']
})
export class RadiologoEstudiosComponent implements OnInit {
  pacientes: DicomPacienteInterface = {};
  dicomForm: FormGroup;
  cargarInterpretacionForm: FormGroup;
  nuevoPaciente: DicomPacienteInterface;
  historialModificaciones: any = {};
  selected_id: number = 0;
  file_selected: boolean = false;

  p: number = 1;
  error_message: string = ""

  @ViewChild('modalExito', { static: false }) private modalExito;
  @ViewChild('historialCambios', { static: false }) private historialCambios;
  @ViewChild('modalError', { static: false }) private modalError;

  constructor(
    private dataApiService: DataApiService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.consultarPacientesDicom();
    this.createDicomForm();
    this.createInterpretacionForm();
  }

  createDicomForm(){
    this.dicomForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido_paterno: ['', Validators.required],
      apellido_materno: ['', Validators.required],
      email: ['', Validators.required],
      estudio: ['', Validators.required],
      dicom_link: ['', Validators.required],
    });
  }

  createInterpretacionForm(){
    this.cargarInterpretacionForm = this.formBuilder.group({
      file: ['', Validators.required]
    })
  }

  consultarPacientesDicom() {  
      this.dataApiService.consultarPacientesDicom(
        1
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

  

  cargarDicom(instance: any){
    this.spinner.show();
    this.dataApiService.calculateDicomTime(instance.dicom_link)
    .subscribe(( data : any) => 
      { 
        this.dataApiService.loadDicomData(instance)
        .subscribe((data: any) => {
          this.spinner.hide();
          this.verModal(this.modalExito, 'md')
        },
        error => {
          this.spinner.hide();
          this.error_message = error.error.error
          this.verModal(this.modalError, 'md') 
          console.log(error.error)
        }
        )
    }, 
      error =>{
        this.spinner.hide();
        this.error_message = error.error.error
        this.verModal(this.modalError, 'md') 
        console.log(error.error)
      }
    ); 
  }

  reloadPage(){
    location.reload()
  }

  descargar(path: string){
    this.dataApiService.descargarZip(path)
  }

  onFileSelected(event: any){
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.cargarInterpretacionForm.get('file').setValue(file);
    }
    this.file_selected = true;
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
    );
  }

  
  cargarInterpretacion(){
    this.spinner.show();
    let formData = new FormData();
    formData.append('file', this.cargarInterpretacionForm.get('file').value);
    this.dataApiService.cargarInterpretacion(formData, this.selected_id)
    .subscribe(( data : any) => 
      { 
        this.spinner.hide();
        this.verModal(this.modalExito, 'md')
    }, 
      error => {
        this.spinner.hide();
        this.error_message = error.error.error
        this.verModal(this.modalError, 'md') 
        console.log(error.error)
      }
    );

  }

  removeInterpretation(){
    this.spinner.show();
    this.dataApiService.removeInterpretation(this.selected_id)
    .subscribe((data: any) => {
      let user = this.pacientes.data.find(i => i.paciente_id == this.selected_id)
      user.interpretado = false
      this.modalService.dismissAll() 
      this.spinner.hide()
    },
      error => {
        this.spinner.hide();
        this.error_message = error.error.error
        this.verModal(this.modalError, 'md') 
        console.log(error.error)
      }
    );
  }



    // funcion para abrir modal se sub categorias
    verModal(modal, size, selected_id?){
      this.file_selected = false;
      if (selected_id !== undefined){
        this.selected_id = selected_id
      }
      let modalRef = this.modalService.open(
        modal, {
        size: size
      });
    }

    closeModals(){
      this.modalService.dismissAll('modal')
    }

}
