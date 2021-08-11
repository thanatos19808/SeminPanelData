import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataApiService } from '../../../services/data-api.service';

@Component({
  selector: 'app-visualizador-fisio',
  templateUrl: './visualizador-fisio.component.html',
  styleUrls: ['./visualizador-fisio.component.css']
})
export class VisualizadorFisioComponent implements OnInit {

  expediente: any = {};
  contador = 1;
  status;
  statusDocuments:any[] = [];
  loading:boolean;
  firmas:string;
  observaciones:string;
  enviando:boolean = false;

  //variables del plugin para zoom de una imagen
  enableLens = true
	magnification = 2
  enableScrollZoom = true
  lensWidth=200
	hoja4_30: string;
  constancia_vigencia:string;
  orden_trabajo:string;
  identificacion:string;
  carnet:string;
  bitacora:string;

  constructor(private router:ActivatedRoute, private rout: Router, private api:DataApiService) {
    this.loading = true;
    this.router.params.subscribe((params) => {
      this.getExpediente(params['id']);
    });
  }

  getExpediente(id:string){
    this.api.consultarExpedienteFisio(id).subscribe((data:any)=>{
      // console.log(this.expediente);
      this.expediente = data;

      const {
        hoja_430,
        constancia_vigencia, 
        orden_trabajo,
        identificacion,
        carnet,
        bitacora
      } = this.expediente;

      this.hoja4_30 = `https://semindigital.com:8090${hoja_430}`;
      this.constancia_vigencia = `https://semindigital.com:8090${constancia_vigencia}`;
      this.orden_trabajo = `https://semindigital.com:8090${orden_trabajo}`;
      this.identificacion = `https://semindigital.com:8090${identificacion}`;
      this.carnet = `https://semindigital.com:8090${carnet}`;
      this.bitacora = `https://semindigital.com:8090${bitacora}`;

      this.loading = false;

    });
  }

  changeExpediente(id:string, status:string, firmas:string, observaciones:string){
    this.api.editExpediente(id, status, firmas, observaciones).subscribe((data:any)=>{
      let {status, firmas, observaciones} = this.expediente;

      // console.log(data);
      status = data.status;
      firmas = data.numero_firmas;
      observaciones = data.observaciones;

      this.rout.navigate(['/fisio/studios']);

    });
  }

  queryForEdit(statusExpediente:string){
    this.router.params.subscribe((params) => {
      this.changeExpediente(params['id'], statusExpediente, this.firmas, this.observaciones);
    });
  }

  isValid(){
    this.status = 1;
    this.statusDocuments.push(this.status);
    console.log('correcto');
    this.contador++;
  }

  isInvalid(){
    this.status = 0;
    this.statusDocuments.push(this.status);
    console.log('invalido');
    this.contador++;
  }

  isPendiente(){
    this.status = 2;
    this.statusDocuments.push(this.status);
    console.log('pendiente');
    this.contador++;
  }

  addEditsExpediente(){
    let newStatus:string;
    this.enviando = true;

    for(let item of this.statusDocuments){
      if( item === 0 ){
        newStatus = 'Incorrecto'
        break;
      }else if(item === 2){
        newStatus = 'Pendiente';
        break;
      }else{
        newStatus = 'Correcto';
      }
    }

    this.queryForEdit(newStatus);

  }

  masContador(){
    this.contador++;
  }

  ngOnInit() {}

}

