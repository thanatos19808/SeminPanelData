import { Component, OnInit } from '@angular/core';
import { DataApiService } from "../../services/data-api.service";
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import * as _ from 'lodash';



@Component({
  selector: 'app-encuestas',
  templateUrl: './encuestas.component.html',
  styleUrls: ['./encuestas.component.css']
})

export class EncuestasComponent implements OnInit {
  sucursalSeleccionada = 0;
  estudioSeleccionado = 0;
  public ChartType = 'bar';
  
  public preguntaUnoOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    title: {
      text: 'Información proporcionada de manera correcta',
      display: true
    },
    scales: {
      yAxes: [{
          ticks: {
            max : 100,
            min: 0
          }
      }]
    }
  };

  public preguntaDosOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    title: {
      text: 'Estudio realizado',
      display: true
    },
    scales: {
      yAxes: [{
          ticks: {
            max : 100,
            min: 0
          }
      }]
    }
  };

  public preguntaTresOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    title: {
      text: 'Atencion proporcionada en escala 1 - 10',
      display: true
    },
    scales: {
      yAxes: [{
          ticks: {
            max : 100,
            min: 0
          }
      }]
    }
  };

  public preguntaUnoData: Array<any> = [
    { 
      data: []
    }
  ];

  public preguntaDosData: Array<any> = [
    { 
      data: []
    }
  ];

  public preguntaTresData: Array<any> = [
    { 
      data: []
    }
  ];

  constructor(private dataApiService: DataApiService) { 
  }

  preguntaUnoLabels = ['No', 'Si'];
  preguntaDosLabels = [];
  preguntaTresLabels = [];

  chartColors: any = [
    { 
      backgroundColor:[
        "#9AB638", "#9AB638", 
        "#9AB638", "#9AB638", 
        "#9AB638", "#9AB638", 
        "#9AB638", "#9AB638", 
        "#9AB638", "#9AB638", 
        "#9AB638", "#9AB638",
        "#9AB638", "#9AB638", 
        "#9AB638", "#9AB638", 
        "#9AB638", "#9AB638",
        "#9AB638", "#9AB638",
        "#9AB638", "#9AB638"
      ]
    }
  ];


  ngOnInit() {
    // Iniciamos la encuesta en valores por defecto
    this.dataApiService.consultarEncuestas('all', 'all')
    .subscribe((data : any) => {
      this.populateData(data.counterPrimeraPregunta, 1);
      this.populateData(data.counterSegundaPregunta, 2);
      this.populateData(data.counterTerceraPregunta, 3);
    }, 
    error => this.mensajeError(error)  
    );
  }

  // Adaptando los datos al formato de ng2-chart
  populateData(data: any, pregunta: number) {
    switch (pregunta) {
      case 1:
        for(let element in data) {
          this.preguntaUnoData[0].data.push(data[element].counter);
        }
        break;
      case 2:
        for (let element in data) {
          this.preguntaDosLabels.push(data[element].preguntaDos);
          this.preguntaDosData[0].data.push(data[element].counter);
        }
        break;
      case 3:
        // Ordenamos los datos del 1-10 usando lodash
        var order_data = _.sortBy(data, (obj) => { 
          return parseInt(obj.preguntaTres, 10);
        });
        for (let element in order_data) {
          this.preguntaTresLabels.push(order_data[element].preguntaTres);
          this.preguntaTresData[0].data.push(order_data[element].counter);
        }
        break;
      default:
        break;
    }
  }

  onChangeStateDropdown() {
    if(this.sucursalSeleccionada || this.estudioSeleccionado !== 0 ){
      this.dataApiService.consultarEncuestas(this.sucursalSeleccionada == 0 ? 'all' : this.sucursalSeleccionada, this.estudioSeleccionado == 0 ? 'all' : this.estudioSeleccionado)
        .subscribe((data : any) => {
          // Reset information 
          this.resetValues();
          this.populateData(data.counterPrimeraPregunta, 1);
          this.populateData(data.counterSegundaPregunta, 2);
          this.populateData(data.counterTerceraPregunta, 3);
    }, 
    error => this.mensajeError(error)  
    );
    }
  }

  mensajeError(error){
    console.log(error);
  }

  // Reseteamos los valores para evitar valores duplicados
  resetValues () {
    this.preguntaUnoLabels = ['No', 'Si'];
    this.preguntaUnoData = [ { data: [] } ];
    this.preguntaDosLabels = [];
    this.preguntaDosData = [ { data: [] } ];
    this.preguntaTresLabels = [];
    this.preguntaTresData = [ { data: [] } ];
  }

}
