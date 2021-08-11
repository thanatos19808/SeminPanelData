import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataApiService } from '../../../services/data-api.service';

@Component({
  selector: 'app-buscador-fisio-studio',
  templateUrl: './buscador-fisio-studio.component.html',
  styleUrls: ['./buscador-fisio-studio.component.css']
})
export class BuscadorFisioStudioComponent implements OnInit {

  expedientes:any[] = [];
  loading:boolean;
  mensajeError:string;
  error:boolean;

  constructor(private router: Router, private api:DataApiService) {}

  buscar(termino : string){

    this.error = false;
    this.loading = true;

    this.api.searchExp(termino).subscribe(
      (data:any)=>{
        this.expedientes = data;
        this.loading = false;
      },
      (errorServicio) => {
        this.loading = false;
        this.error = true;
        this.expedientes = [];
        this.mensajeError = errorServicio.error.message;
      }
    );

  }

  verExpediente(item:any){
    let estudioID;
    estudioID = item.id;
    this.router.navigate(['/fisio/studio/', estudioID]);
  }

  ngOnInit() {}

}
