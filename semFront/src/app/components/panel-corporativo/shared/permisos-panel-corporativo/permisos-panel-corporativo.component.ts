import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';

import { PanelDataService } from '../../../../services/panel-data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-permisos-panel-corporativo',
  templateUrl: './permisos-panel-corporativo.component.html',
  styleUrls: ['./permisos-panel-corporativo.component.css']
})
export class PermisosPanelCorporativoComponent implements OnInit {

  user: any = {};

  userID: string = "";
  errors: string = "";

  buttonDisabled: boolean = false;
  edits = true;


  formGroupData: FormGroup;

  constructor(
    private routActivate: ActivatedRoute,
    private router: Router,
    private api_panel: PanelDataService,
    private formBuilder: FormBuilder,
  ) {
    this.routActivate.params.subscribe((params) => {
      this.getAdmin(params['id']);
    });
  }

  createformGroupData() {
    this.formGroupData = this.formBuilder.group({
      venta_total: [''],
      venta_sucursal: [''],
      venta_estudio: [''],
      venta_departamento: [''],
      venta_area: [''],
      corte_caja: [''],
      tipo_pagos: [''],
      devoluciones: [''],
      cambio_estudio: [''],
    });
  };

  getAdmin = (id: string): void => {
    this.api_panel.getAdministrador(id).subscribe(
      (userAdmin: any) => {
        this.user = userAdmin;
        this.userID = userAdmin.id;
        console.log(this.user);
        this.formGroupData.get('venta_total').setValue(this.user.venta_tolal);
        this.formGroupData.get('venta_sucursal').setValue(this.user.venta_sucursal);
        this.formGroupData.get('venta_estudio').setValue(this.user.venta_estudios);
        this.formGroupData.get('venta_departamento').setValue(this.user.venta_departamentos);
        this.formGroupData.get('venta_area').setValue(this.user.venta_areas);
        this.formGroupData.get('corte_caja').setValue(this.user.corte_caja);
        this.formGroupData.get('tipo_pagos').setValue(this.user.tipos_pagos);
        this.formGroupData.get('devoluciones').setValue(this.user.devoluciones);
        this.formGroupData.get('cambio_estudio').setValue(this.user.cambio_estudio);
      },
      (error) => {
        this.edits = false;
        console.log(error.error.message);
        this.errors = error.error.message;
        setTimeout(() => {
          this.router.navigate(['/paneldata']);
        }, 1500);
      }
    );
  };

  changePermisos = (value) => {
    console.log(value);
    this.buttonDisabled = true;
    let formData = new FormData();

    formData.append('venta_tolal', this.formGroupData.get('venta_total').value);
    formData.append('venta_sucursal', this.formGroupData.get('venta_sucursal').value);
    formData.append('venta_estudios', this.formGroupData.get('venta_estudio').value);
    formData.append('venta_departamentos', this.formGroupData.get('venta_departamento').value);
    formData.append('venta_areas', this.formGroupData.get('venta_area').value);
    formData.append('corte_caja', this.formGroupData.get('corte_caja').value);
    formData.append('tipos_pagos', this.formGroupData.get('tipo_pagos').value);
    formData.append('devoluciones', this.formGroupData.get('devoluciones').value);
    formData.append('cambio_estudio', this.formGroupData.get('cambio_estudio').value);


    this.api_panel.putPermisos(this.userID, formData).subscribe(
      (resp: any) => {
        console.log(resp);
        this.buttonDisabled = false;
        const nameAud = JSON.parse(localStorage.getItem('currentUser'));
        console.log(typeof (nameAud.first_name));
        // this.postActivityViews(
        //   nameAud.first_name,
        //   nameAud.last_name,
        //   `actualizacion de permisos a ${this.user.nombre} ${this.user.apellido_paterno} ${this.user.apellido_materno}`,
        //   // se puede agregar los campos que fueron modificados
        // );
        this.aletSuccess();
        this.router.navigate(['/paneldata']);
      },
      (error) => {
        this.aletError();
        this.buttonDisabled = false;
      }
    );
  };

  postActivityViews = (nombre: string, apellido1: string, consulta: string, datos?: string, apellido2?: string): void => {
    this.api_panel.postAllViews(nombre, apellido1, consulta, datos, apellido2)
      .subscribe((resp: any) => {
        console.log(resp);
      });
  };

  aletSuccess() {
    Swal.fire({
      icon: 'success',
      title: '¡Actualizacion Realizada!',
      text: '',
    });
  }

  aletError() {
    Swal.fire({
      icon: 'error',
      title: 'Error al Actualizar los permisos',
      text: 'por favor intente nuevamente',
    });
  }

  ngOnInit() {
    this.createformGroupData();
  }

}
