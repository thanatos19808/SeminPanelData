import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PanelDataService } from '../../../../services/panel-data.service';

@Component({
  selector: 'app-show-product-user',
  templateUrl: './show-product-user.component.html',
  styleUrls: ['./show-product-user.component.css']
})
export class ShowProductUserComponent implements OnInit {

  numStudies: number = 0;

  nameUser: string = "";
  first_name: string = "";
  second_name: string = "";

  dataUser: any = [];

  constructor(private api_panel: PanelDataService, private router: ActivatedRoute,) {
    this.router.params.subscribe((params) => {
      this.getDataUser(params['id']);
    });
  }

  ngOnInit() {
  }

  getDataUser = (id: string) => {
    this.api_panel.getNumPacientes(id)
      .subscribe((data: any) => {
        console.log(data);
        this.nameUser = data[0].cajero.cajero_empleado.nombre;
        this.first_name = data[0].cajero.cajero_empleado.apellido_paterno;
        this.second_name = data[0].cajero.cajero_empleado.apellido_materno;
        this.dataUser = data;
        let numberItems = Object.keys(this.dataUser).length;
        this.numStudies = numberItems;
        console.log(this.numStudies);
      })

  }

}
