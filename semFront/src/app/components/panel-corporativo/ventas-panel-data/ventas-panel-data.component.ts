import { Component, OnInit } from '@angular/core';
import { FormsModule, FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { AuthService } from '../../../services/auth.service'
import { PanelDataService } from '../../../services/panel-data.service';
import { DataApiService } from '../../../services/data-api.service';

import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-ventas-panel-data',
  templateUrl: './ventas-panel-data.component.html',
  styleUrls: ['./ventas-panel-data.component.css']
})
export class VentasPanelDataComponent implements OnInit {

  sucursales: any = [];
  ventaEstudios: any = [];
  ventas: number[] = [];
  numeroEstudies: number[] = [];
  ventasDepartament: any = [];
  clearItem: string[] = [];
  ventaArea: any = [];
  total: number[] = [];
  venta_total_empresa = [] = [];

  user: any = {};
  permisos_user: any = {};

  valeRespuesta: string = "";

  select_venta_sucursal: boolean = false;
  select_venta_estudio: boolean = false;
  select_venta_departamento: boolean = false;
  select_venta_area: boolean = false;
  loading: boolean = false;
  message: boolean = false;
  content_data: boolean = false;
  enviando: boolean = false;

  venta_total: boolean = false;
  venta_sucursal: boolean = false;
  venta_estudio: boolean = false;
  venta_departamento: boolean = false;
  venta_area: boolean = false;

  today = new Date(Date.now());
  maxDate = new Date(Date.now());
  minDate = this.today.setMonth(this.today.getMonth() - 1440);
  minSecondDate;

  months = {
    0: 'Enero',
    1: 'Febrero',
    2: 'Marzo',
    3: 'Abril',
    4: 'Mayo',
    5: 'Junio',
    6: 'Julio',
    7: 'Agosto',
    8: 'Septiembre',
    9: 'Octubre',
    10: 'Noviembre',
    11: 'Diciembre',
  }

  VALIDATE_ITEMS = {
    empresa: [{ type: 'required', message: 'Este campo es requerido' }],
    type_venta: [{ type: 'required', message: 'Este campo es requerido' }],
    sucursal: [{ type: 'required', message: 'Este campo es requerido' },],
    estudio: [
      { type: 'pattern', message: 'Compruebe la escritura' },
    ],
    departament: [
      { type: 'pattern', message: 'Compruebe la escritura' },
    ],
    first_date: [
      { type: 'required', message: 'Este campo es requerido' },
      { type: 'minDate', message: 'Fecha minima incorrecta' },
      { type: 'maxDate', message: 'Fecha incorrecta, compruebe el dia de hoy' },
    ],
    second_date: [
      { type: 'required', message: 'Este campo es requerido' },
      { type: 'minDate', message: 'Fecha minima incorrecta' },
      { type: 'maxDate', message: 'Fecha incorrecta, compruebe el dia de hoy' },
    ],
  }

  formGroupData: FormGroup;

  constructor(private formBuilder: FormBuilder, private api_panel: PanelDataService) {
    this.getSucursals();
    this.user = this.api_panel.getUserLocalStorage();
    console.log(this.user.tipo);
    if (this.user.tipo != "Auditor_panel") {
      this.api_panel.getPermisos(this.user.email)
        .subscribe((data: any) => {
          this.permisos_user = data;
          console.log(this.permisos_user);
          const { venta_tolal, venta_sucursal, venta_estudios, venta_departamentos, venta_areas } = this.permisos_user;

          this.venta_total = venta_tolal;
          this.venta_sucursal = venta_sucursal;
          this.venta_estudio = venta_estudios;
          this.venta_departamento = venta_departamentos;
          this.venta_area = venta_areas;
        })
    }
    else {
      this.venta_total = true;
      this.venta_sucursal = true;
      this.venta_estudio = true;
      this.venta_departamento = true;
      this.venta_area = true;
    }

  };

  getSucursals = () => {
    this.api_panel.getSucursales()
      .subscribe((data: any) => {
        this.sucursales = data;
        this.formGroupData.get('sucursal').enable();
      }, (errors) => {
        this.formGroupData.get('sucursal').disable();
      });
  };

  createformGroupData() {
    this.formGroupData = this.formBuilder.group({
      empresa: ['', Validators.required],
      type_venta: ['', Validators.required],
      sucursal: [''],
      estudio: ['', Validators.pattern('[a-zA-Z ]+')],
      departament: ['', Validators.pattern('[a-zA-Z ]+')],
      area: [''],
      first_date: [
        '',
        Validators.compose([
          Validators.required,
          CustomValidators.minDate(this.minDate),
          CustomValidators.maxDate(this.maxDate),
        ])
      ],
      second_date: [
        '',
        Validators.compose([
          Validators.required,
          CustomValidators.minDate(this.minDate),
          CustomValidators.maxDate(this.maxDate),
        ])
      ],

    })
  };

  showOptions = () => {
    if (this.formGroupData.get('type_venta').value == 'venta_sucursal') {
      this.select_venta_estudio = false;
      this.select_venta_area = false;
      this.select_venta_sucursal = true;
      this.select_venta_departamento = false;
      this.clearItem.push("departament", "estudio", "area");
      this.clearItems(this.clearItem);
    }
    else if (this.formGroupData.get('type_venta').value == 'venta_total') {
      this.select_venta_estudio = false;
      this.select_venta_sucursal = false;
      this.select_venta_area = false;
      this.select_venta_departamento = false;
      this.clearItem.push("departament", "estudio", "sucursal", "area");
      this.clearItems(this.clearItem);
    }
    else if (this.formGroupData.get('type_venta').value == 'venta_estudio') {
      this.select_venta_sucursal = true;
      this.select_venta_estudio = true;
      this.select_venta_area = false;
      this.select_venta_departamento = false;
      this.clearItem.push("departament", "area");
      this.clearItems(this.clearItem);
    }
    else if (this.formGroupData.get('type_venta').value == 'venta_departamento') {
      this.select_venta_sucursal = true;
      this.select_venta_departamento = true;
      this.select_venta_estudio = false;
      this.select_venta_area = false;
      this.clearItem.push("estudio", "area");
      this.clearItems(this.clearItem);
    }
    else if (this.formGroupData.get('type_venta').value == 'venta_area') {
      this.select_venta_sucursal = false;
      this.select_venta_area = true;
      this.select_venta_estudio = false;
      this.select_venta_departamento = false;
      this.clearItem.push("estudio", "departament");
      this.clearItems(this.clearItem);
    }

  };

  clearItems = (options: string[]) => {
    options.forEach(option => this.formGroupData.get(option).setValue(''));
  };

  selectOtherSucursals = () => {
    let departamentNotNull = this.formGroupData.get('departament').value;
    let estudieNotNull = this.formGroupData.get('estudio').value;
    if (estudieNotNull) {
      this.formGroupData.get('estudio').setValue('');
    }
    if (departamentNotNull) {
      this.formGroupData.get('departament').setValue('');
    }
  };

  consultData = () => {
    this.enviando = true;
    this.loading = true;
    console.log(this.formGroupData.value);
    const valueEmpresa: string = this.formGroupData.get('empresa').value;
    const valueSucursal: string = this.formGroupData.get('sucursal').value;
    const valueEstudio: string = this.formGroupData.get('estudio').value;
    const valueFirstDate: string = this.formGroupData.get('first_date').value;
    const valueSecondDate: string = this.formGroupData.get('second_date').value;
    const valueDepartament: string = this.formGroupData.get('departament').value;
    const valueArea: string = this.formGroupData.get('area').value;
    const valueTypeVenta: string = this.formGroupData.get('type_venta').value;

    // desestructurar datos del usuario para ingresarlos al modelo privado
    const { first_name, last_name, tipo } = this.user;

    if (valueTypeVenta == "venta_total") {
      console.log('venta total de la empresa seleccionada');
      this.ventasTotal(valueEmpresa, valueFirstDate, valueSecondDate);
    }
    else if (valueDepartament != "") {
      console.log('consulta de venta por departamento');
      this.getVentasDepartament(valueEmpresa, valueSucursal, valueDepartament, valueFirstDate, valueSecondDate);
    }
    else if (valueTypeVenta == "venta_area") {
      console.log("venta por area");
      this.getVentasArea(valueEmpresa, valueArea, valueFirstDate, valueSecondDate);
    }
    else {
      this.getVentaEstudies(valueEmpresa, valueSucursal, valueEstudio, valueFirstDate, valueSecondDate);
    }

    let datos: string = `${valueEmpresa}, ${valueSucursal}, ${valueFirstDate}, ${valueSecondDate}, ${valueEstudio}, ${valueDepartament}, ${valueArea}`;
    // this.postActivityViews(first_name,last_name,valueTypeVenta,datos);

  };


  ventasTotal = (empresa: string, minDate: string, maxDate: string): void => {
    this.api_panel.getAllVentas(empresa, minDate, maxDate)
      .subscribe((data: any) => {

        this.venta_total_empresa = data;

        console.log(data);
        if (data.length <= 0) {
          this.doughnutChartData = [];
          this.loading = false;
          this.message = true;
        }
        else {
          this.barChartData = [];
          this.doughnutChartData = [];
          this.ventas = [];

          const labels: any[] = ['Venta total'];
          const total = this.getVentas(data);

          this.doughnutChartLabels = labels;
          this.doughnutChartData.push(total);

          this.message = false;
          this.loading = false;

        }

      });
  };

  getVentaEstudies = (empresa, sucursal, estudio, firstDate, secondDate) => {
    this.api_panel.getFilterVentasEstudios(empresa, sucursal, estudio, firstDate, secondDate).subscribe(
      (data: any) => {
        console.log(data);
        this.ventaEstudios = data;
        // console.log(this.ventaEstudios);
        if (this.ventaEstudios.length == 0) {
          this.loading = false;
          this.message = true;
          this.doughnutChartData = [];
        }
        else {
          this.barChartData = [];
          this.doughnutChartData = [];
          this.ventas = [];
          this.numeroEstudies = [];
          const labels: any[] = ['Venta total', 'Numero de estudios'];
          const dataVentas: any[] = [];

          let total = this.getVentas(this.ventaEstudios);
          total.push(0);
          let numeroEstudies = this.getNumberStudies(this.ventaEstudios);
          numeroEstudies.unshift(0);

          this.doughnutChartLabels = labels;
          this.doughnutChartData.push(total);
          this.doughnutChartData.push(numeroEstudies);

          this.message = false;
          this.loading = false;
        }
      }
    );
  };

  getVentasDepartament = (empresa, sucursal, departament, firstDate, secondDate) => {
    this.api_panel.getFilterVentasDepartament(empresa, sucursal, departament, firstDate, secondDate).subscribe(
      (data: any) => {
        console.log(data);
        this.ventasDepartament = data;
        this.valeRespuesta = "";
        if (this.ventasDepartament.length == 0) {
          this.doughnutChartData = [];
          this.loading = false;
          this.message = true;
        }
        else {
          this.doughnutChartData = [];
          this.ventas = [];

          const labels: any[] = ['Venta total departamento'];
          let total = this.getVentas(this.ventasDepartament);

          this.doughnutChartLabels = labels;
          this.doughnutChartData.push(total);
          // console.log(this.doughnutChartData);
          this.message = false;
          this.loading = false;
        }
      }
    );
  };

  getVentasArea = (empresa: string, area: string, firstDate?: string, secondDate?: string) => {
    let namelabels: string[] = [];

    this.api_panel.getVentasAreas(empresa, area, firstDate, secondDate).subscribe(
      (data: any) => {
        console.log(data);
        this.ventaArea = data;
        if (data.length === 0) {
          this.barChartData = [];
          this.loading = false;
          this.message = true;
          this.content_data = false;
        }
        else {
          this.doughnutChartData = [];
          this.ventas = [];
          this.total = this.getVentas(data);
          this.loading = false;
          this.message = false;
          this.content_data = true;
        }

      }
    );
  };

  getVentas = (data: any[]): number[] => {
    const total = data.map(total => total.total);
    const ventaTotal = total.reduce((a, b) => a + b, 0);
    this.ventas.push(ventaTotal);
    // console.log(this.ventas);
    return this.ventas;
  };

  getNumberStudies = (data: any[]): number[] => {
    const total = data.map(total => total.numero_estudios);
    const numero_estudios = total.reduce((a, b) => a + b, 0);
    this.numeroEstudies.push(numero_estudios);
    // console.log(this.numeroEstudies);
    return this.numeroEstudies;
  };

  postActivityViews = (
    nombre: string, apellido1: string,
    consulta: string, datos?: string, apellido2?: string
  ): void => {
    this.api_panel.postAllViews(nombre, apellido1, consulta, datos, apellido2).subscribe(
      (resp: any) => {
        console.log(resp);
      }
    );
  };

  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartLabels: Label[] = [];
  public doughnutChartData: MultiDataSet = [];

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
  };
  public barChartType: ChartType = 'bar';
  public barChartLabels: Label[] = [];
  public barChartLegend = true;
  public barChartData: ChartDataSets[] = [];

  // creando el pdf
  generatePDF = () => {
    const DATA = document.getElementById('htmlData');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };
    html2canvas(DATA, options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');

      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {
      docResult.save(`Reporte Ejectivo-${new Date().toISOString()}.pdf`);
    });
  }

  ngOnInit() {
    this.createformGroupData();
    this.barChartData = [];
    this.doughnutChartData = [];
  }

}
