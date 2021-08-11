import { Component, OnInit } from '@angular/core'
import { UserInterface } from '../../models/user-interface'
import { AuthService } from '../../services/auth.service' 
import { ImagenologiaInterface } from '../../models/imagenologia-interface'
import { DataApiService } from '../../services/data-api.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ViewChild } from '@angular/core';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-perfil-radiologo',
  templateUrl: './perfil-radiologo.component.html',
  styleUrls: ['./perfil-radiologo.component.css']
})
export class PerfilRadiologoComponent implements OnInit {
  @ViewChild('modalExito', { static: false }) private modalExito
  cargarMarcaDeAguaForm: FormGroup

  constructor(
    private authService: AuthService,
    private dataApiService: DataApiService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    ) { }

  private userAPI: UserInterface = {}
  private imagenologo: ImagenologiaInterface = {}

  ngOnInit() {
    this.userAPI = this.authService.getCurrentUser()
    this.spinner.show()
    this.consultarImagenologo()
    this.createMarcaDeAguaForm()
  }

  createMarcaDeAguaForm(){
    this.cargarMarcaDeAguaForm = this.formBuilder.group({
      file: ['', Validators.required]
    })
  }

  onFileSelected(event: any){
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.cargarMarcaDeAguaForm.get('file').setValue(file);
    }
  }

  cargarMarca(){
    this.spinner.show();
    let formData = new FormData();
    formData.append('file', this.cargarMarcaDeAguaForm.get('file').value);
    this.dataApiService.cargarMarca(
      formData, 
      this.userAPI.id_sem
    ).subscribe((data: any) => {
      this.spinner.hide()
      this.verModal(this.modalExito, 'md')
    },
      error => {
        this.spinner.hide();
        //this.error_message = error.error.error
        //this.verModal(this.modalError, 'md') 
        console.log(error.error)
      }
    )

  }

  consultarImagenologo() {  
    this.dataApiService.consultarImagenologo(
      this.userAPI.id_sem,
    )
    .subscribe((data: any) => {
      this.imagenologo = data.data;
      this.spinner.hide();
      console.log(this.imagenologo)
    }, (error) => {
      this.spinner.hide();
      //this.error_message = error.error.error
      //this.verModal(this.modalError, 'md') 
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
