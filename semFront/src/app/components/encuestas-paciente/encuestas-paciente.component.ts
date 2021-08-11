import { Component, OnInit, ViewChild } from '@angular/core';
import { ArchwizardModule } from 'angular-archwizard';
import { DataApiService } from "../../services/data-api.service";

@Component({
  selector: 'app-encuestas-paciente',
  templateUrl: './encuestas-paciente.component.html',
  styleUrls: ['./encuestas-paciente.component.css']
})
export class EncuestasPacienteComponent implements OnInit {
  public respuestaUno = "Sí";
  public respuestaDos = "21";
  public respuestaTres = "10";
  public mensaje = '';
  public estudios = {
    '1' : 'Analisis Sanguineos',
    '2' : 'Analisis Clinicos',
    '3' : 'Ultrasonografia',
    '4' : 'Ultrasonografia Doppler',
    '5' : 'Rayos X',
    '6' : 'Rayos X Contrastado',
    '7' : 'Mastografia',
    '8' : 'Papanicolau',
    '9' : 'Cardiologia',
    '10' : 'Tomografia',
    '11' : 'Tomografia Contrastada',
    '12' : 'Resonancia Magnetica Contrastada',
    '13' : 'Colposcopia',
    '14' : 'Densitometria',
    '15' : 'Audiologia',
    '16' : 'Espirometria',
    '17' : 'Patologia',
    '18' : 'Consulta',
    '19' : 'Cardiologia',
    '20' : 'Rehabilitacion',
    '21' : 'Otro'
}

  constructor(private dataApiService: DataApiService) { }

  ngOnInit() {
  }


  finalizeStep() {
    this.dataApiService.crearEncuesta(this.respuestaUno, this.estudios[this.respuestaDos], this.respuestaTres)
      .subscribe(
        data => {
          this.mensaje = data.id ? 'Gracias por su respuesta' : 'Algo salio mal =('; 
        },
        error => this.mensajeError(error)
      );
  }

  mensajeError(error){
    console.log(error);
  }

}
