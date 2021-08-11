import { Component, OnInit } from '@angular/core';
import { FormsModule, FormGroup, FormBuilder, Validators, NgForm, FormControl } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { AuthService } from '../../../services/auth.service';
import { PanelDataService } from '../../../services/panel-data.service';
import { DataApiService } from '../../../services/data-api.service';

import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-finanzas-panel-data',
  templateUrl: './finanzas-panel-data.component.html',
  styleUrls: ['./finanzas-panel-data.component.css']
})
export class FinanzasPanelDataComponent implements OnInit {

  select_sucursals: boolean = false;
  select_type_pay: boolean = false;
  loading: boolean = false;
  message: boolean = false;
  devoluciones: boolean = false;
  corte_caja: boolean = false;
  tipos_pagos: boolean = false;
  devoluciones_permisos: boolean = false;
  cambio_estudio: boolean = false;
  error: boolean = false;

  pago: boolean = false;

  sucursales: any = [];
  corteCajaData: any = [];
  montosCaja: any = [];
  montoDevolucion: any = [];

  user: any = {};
  permisos_user: any = {};

  today = new Date(Date.now());
  maxDate = new Date(Date.now());
  minDate = this.today.setMonth(this.today.getMonth() - 1440);

  errors: string = "";

  VALIDATE_ITEMS = {
    empresa: [{ type: 'required', message: 'Este campo es requerido' }],
    option_finanzas: [{ type: 'required', message: 'Este campo es requerido' }],
    sucursal: [{ type: 'required', message: 'Este campo es requerido' },],
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
    if (this.user.tipo != "Auditor_panel") {
      this.api_panel.getPermisos(this.user.email).subscribe(
        (data: any) => {
          this.permisos_user = data;
          const { corte_caja, tipos_pagos, devoluciones, cambio_estudio } = this.permisos_user;
          this.corte_caja = corte_caja;
          this.tipos_pagos = tipos_pagos;
          this.devoluciones_permisos = devoluciones;
          this.cambio_estudio = cambio_estudio;
        }
      );
    }
    else {
      this.corte_caja = true;
      this.tipos_pagos = true;
      this.devoluciones_permisos = true;
      this.cambio_estudio = true;
    }

  };

  getSucursals = (): void => {
    this.api_panel.getSucursales().subscribe(
      (data: any) => {
        this.sucursales = data;
        this.formGroupData.get('sucursal').enable();
      },
      (errors) => {
        this.formGroupData.get('sucursal').disable();
      }
    );
  };

  createformGroupData() {
    this.formGroupData = this.formBuilder.group({
      empresa: ['', Validators.required],
      option_finanzas: ['', Validators.required],
      sucursal: ['',],
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

  showOptions = (): void => {
    if (this.formGroupData.get('option_finanzas').value == 'box_cut') {
      this.select_type_pay = false;
    }
    else if (this.formGroupData.get('option_finanzas').value == 'type_pay') {
      this.select_type_pay = true;
    }
  }

  consultData = (): void => {
    console.log(this.formGroupData.value);
    this.loading = true;
    let valueEmpresa: string = this.formGroupData.get('empresa').value;
    let valueSucursal: string = this.formGroupData.get('sucursal').value;
    let valueMinDate: string = this.formGroupData.get('first_date').value;
    let valueMaxDate: string = this.formGroupData.get('second_date').value;
    let valueOption: string = this.formGroupData.get('option_finanzas').value;

    const { first_name, last_name, tipo } = this.user;

    if (valueOption == 'box_cut') {
      this.getBoxCut(valueEmpresa, valueSucursal, valueMinDate);
      // consultar el usuario con el corte incial y el corte al final del dia
    } else if (valueOption == 'type_pay') {
      this.devoluciones = false;
      this.getTypePays(valueEmpresa, valueSucursal, valueMinDate, valueMaxDate);
    } else if (valueOption == 'devoluciones') {
      console.log('entrando a devoluciones');
      this.devoluciones = true;
      this.getTypeDevolutions(valueEmpresa, valueSucursal, valueMinDate, valueMaxDate);
    } else {
      console.log('selecciono otra opcion' + valueOption);
    }

    let datos: string = `${valueEmpresa}, ${valueSucursal}, ${valueMinDate}, ${valueMaxDate}`;
    // this.postActivityViews(first_name, last_name, valueOption, datos);

  }

  getBoxCut = (empresa: string, sucursal: string, date?: string): void => {
    this.api_panel.getFilterBoxCut(empresa, sucursal, date).subscribe(
      (data: any) => {
        console.log(data);
        this.corteCajaData = data;
        this.barChartData = [];

        if (this.corteCajaData.length == 0) {
          this.doughnutChartData = [];
          this.loading = false;
          this.message = true;
        }
        else {
          this.doughnutChartData = [];
          this.montosCaja = [];

          const labels: any[] = ['Monto inicial', 'Monto final'];
          const montos = this.getMontos(this.corteCajaData);

          this.doughnutChartLabels = labels;
          this.doughnutChartData.push(montos);

          this.message = false;
          this.loading = false;
        }

      }
    )
  };

  getMontos = (data: any[]): number[] => {
    const montosIniciales = data.map(montoInicio => montoInicio.apertura_cierre.monto_inicial);
    const montosFinales = data.map(total => total.total);
    const montoInicial = montosIniciales.reduce((a, b) => a + b, 0);
    const montoFinal = montosFinales.reduce((a, b) => a + b, 0);

    this.montosCaja.push(montoInicial);
    this.montosCaja.push(montoFinal);

    return this.montosCaja;
  };

  getTypePays = (empresa: string, sucursal: string, min_date?: string, max_date?: string): void => {
    const labels: string[] = ['Efectivo', 'Tranferencia', 'Tarjeta de debito', 'Tarjeta de credito'];
    const number_type: number[] = [];
    this.doughnutChartData = [];

    this.api_panel.getTypePay(empresa, sucursal, min_date, max_date).subscribe(
      (data: any) => {
        // console.log(data);
        let dataTemp: any[] = data;
        if (dataTemp.length == 0) {
          this.barChartData = [];
          this.loading = false;
          this.message = true;
        } else {
          let efectivo: number = 0;
          let transferencia_electrónica: number = 0;
          let tarjeta_credio: number = 0;
          let tarjeta_debito: number = 0;
          for (let item of data) {
            if (item == 'Efectivo') {
              efectivo++;
            }
            else if (item == 'Transferencia electrónica') {
              transferencia_electrónica++;
            }
            else if (item == 'Tarjeta de credito') {
              tarjeta_credio++;
            }
            else {
              tarjeta_debito++;
            }
          }
          number_type.push(efectivo, transferencia_electrónica, tarjeta_debito, tarjeta_credio);
          this.addDataForGrafBar(number_type, labels);
          this.message = false;
          this.loading = false;
        }

      },
      (errors) => {
        this.loading = false;
        this.error = true;
        this.errors = errors.error.message;
      }
    )

  };

  getTypeDevolutions = (empresa: string, sucursal: string, min_date?: string, max_date?: string): void => {
    const labels: string[] = ['Efectivo', 'Tranferencia', 'Tarjeta de debito', 'Tarjeta de credito'];
    const number_type: number[] = [];
    this.doughnutChartData = [];

    this.api_panel.getDevoluciones(empresa, sucursal, min_date, max_date).subscribe(
      (data: any) => {
        // console.log(data);
        if (data.length == 0) {
          this.barChartData = [];
          this.loading = false;
          this.error = false;
          this.message = true;
        }
        else {
          let efectivo: number = 0;
          let transferencia_electronica: number = 0;
          let tarjeta_credito: number = 0;
          let tarjeta_debito: number = 0;
          const type_pay = data.map(item => item.tipo_devolucion)

          for (let item of type_pay) {
            // console.log(item);
            if (item == 'Efectivo') {
              efectivo++;
            }
            else if (item == 'Transferencia electronica') {
              transferencia_electronica++;
            }
            else if (item == 'Tarjeta de debito') {
              tarjeta_debito++;
            }
            else {
              tarjeta_credito++;
            }

          }
          number_type.push(efectivo, transferencia_electronica, tarjeta_debito, tarjeta_credito);
          this.addDataForGrafBar(number_type, labels);

          this.getNumDevoluciones(empresa, sucursal, "efectivo", min_date, max_date);
          this.getNumDevoluciones(empresa, sucursal, "transferencia electronica", min_date, max_date);
          this.getNumDevoluciones(empresa, sucursal, "tarjeta de debito", min_date, max_date);
          this.getNumDevoluciones(empresa, sucursal, "tarjeta de credito", min_date, max_date);
          // console.log(total_efectivo);
          // console.log(this.montoDevolucion);
          let clerTable = Object.keys(this.montoDevolucion).length;
          // console.log(clerTable);
          if (clerTable >= 4) {
            this.montoDevolucion = [];
          }
          this.message = false;
          this.loading = false;

        }

      }
      // aqui van los errores
    )
  };

  getNumDevoluciones = (empresa: string, sucursal: string, type: string, min_date: string, max_date: string): void => {
    this.api_panel.getTypeDevol(empresa, sucursal, type, min_date, max_date)
      .subscribe((data: any) => {
        // console.log(data);
        const total = data.reduce((a, b) => a + b, 0);
        // console.log(total);
        this.montoDevolucion.push({ name: type, total: total });
        // console.log(this.montoDevolucion);
      });
  };

  addDataForGrafBar = (data: any[], name: string[]): void => {
    this.barChartData = [];
    // console.log(data);
    for (let d in data) {
      // console.log(d);
      this.barChartData.push({ data: [data[d]], label: name[d] });
    }
  };

  postActivityViews = (
    nombre: string, apellido1: string,
    consulta: string, datos?: string, apellido2?: string
  ): void => {
    this.api_panel.postAllViews(nombre, apellido1, consulta, datos, apellido2)
      .subscribe((resp: any) => {
        console.log(resp);
      })
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

  generatePDF = () => {
    const DATA = document.getElementById('htmlData');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 1
    };
    html2canvas(DATA, options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');

      const bufferX = 40;
      const bufferY = 40;
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
