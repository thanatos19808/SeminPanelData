import { Component, OnInit } from '@angular/core';
import { FormsModule, FormGroup, FormBuilder, Validators, NgForm, FormControl } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../services/auth.service'
import { PanelDataService } from '../../../services/panel-data.service';
import { DataApiService } from '../../../services/data-api.service';

@Component({
  selector: 'app-productividad-panel-data',
  templateUrl: './productividad-panel-data.component.html',
  styleUrls: ['./productividad-panel-data.component.css']
})
export class ProductividadPanelDataComponent implements OnInit {

  infoUser: any = {};
  InfoCashier: any = {};
  empleados: any = [];

  show_users: boolean = false;
  show_maquiladores: boolean = false;
  cajero: boolean = false;
  tableOk: boolean = false;

  today = new Date(Date.now());
  maxDate = new Date(Date.now());
  minDate = this.today.setMonth(this.today.getMonth() - 1440);

  formGroupData: FormGroup;

  constructor(private formBuilder: FormBuilder, private api_panel: PanelDataService, private router: Router,) { }

  ngOnInit() {
    this.createformGroupData();
  }

  clearItems = (options: string[]) => {
    options.forEach(option => this.formGroupData.get(option).setValue(''));
  };

  createformGroupData() {
    this.formGroupData = this.formBuilder.group({
      empresa: ['', Validators.required],
      select_option: ['', Validators.required],
      type_user: ['',],
      type_maquilador: ['',],
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
    let clearItem: string[] = [];
    if (this.formGroupData.get('select_option').value == 'usuario') {
      this.show_maquiladores = false;
      this.show_users = true;
      clearItem.push("type_maquilador");
      this.clearItems(clearItem);
    }
    else {
      this.show_users = false;
      this.show_maquiladores = true;
      clearItem.push("type_user");
      this.clearItems(clearItem);
    }
  }

  consultData = (value) => {
    console.log(value);
    const { empresa, type_user, type_maquilador, first_date, second_date } = value;

    // llamar a la funcion que consulta los datos
    if (this.show_users) {
      if (type_user === 'cajero') {
        this.cajero = true;
        this.empleados = [];
        this.getUsersEmpleados(type_user);
      }
      else {
        this.cajero = false;
        this.empleados = [];
        this.getUsersEmpleados(type_user);
      }
    }

  }

  // contruir las funciones para consultar datos al servicio
  getUsersEmpleados = (puesto: string): void => {
    this.api_panel.getUsers(puesto)
      .subscribe((empleados) => {
        this.empleados = empleados;
        console.log(this.empleados)
        this.tableOk = true;
      })
  };

  onClickUser = (item) => {
    let userID;
    userID = item.cajero_empleado.id;
    this.router.navigate(['/paneldata/user/', userID]);

  }

  onClickNotCashier = () => {
    console.log('no es cajero');
  }



}
