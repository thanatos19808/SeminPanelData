import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PanelDataService } from '../../../services/panel-data.service';
import { DataApiService } from '../../../services/data-api.service';

@Component({
  selector: 'app-home-panel-corporativo',
  templateUrl: './home-panel-corporativo.component.html',
  styleUrls: ['./home-panel-corporativo.component.css']
})
export class HomePanelCorporativoComponent implements OnInit {

  activitiesLogin: any = [];
  activitiesViews: any = [];
  users: any = [];

  loading: boolean = false;
  logins: boolean = false;
  views: boolean = false;
  home: boolean = false;
  view_permisos: boolean = false;

  user: any = {};

  constructor(private api_panel: PanelDataService, private router: Router) {
    this.user = this.api_panel.getUserLocalStorage();
    console.log(this.user);
    this.typeUser();
  }

  // show options home
  typeUser = () => {
    const { email, tipo } = this.user;
    tipo == 'Admin_panel' ? this.home = false : this.home = true;
  }

  permisos = (): void => {
    this.loading = true;
    this.logins = false;
    this.views = false;

    this.api_panel.getAdministradores().subscribe(
      (users: any) => {
        this.users = users;
        console.log(users);
        this.view_permisos = true;
        this.loading = false;
      }
    );
  };

  verAdmi = (user: any) => {
    let userID;
    userID = user.id;
    this.router.navigate(['/paneldata/permisos/', userID]);
  }

  // obtenemos todos los incio de sesion que se realizon hacia el panel data
  selectSesion = (): void => {
    this.views = false;
    this.view_permisos = false;
    this.loading = true;

    this.api_panel.getActivitiesLogin().subscribe(
      (data: any) => {
        this.activitiesLogin = data;
        if (this.activitiesLogin.length > 0) {
          this.logins = true;
          this.loading = false;
        }
      }
    );

  };

  // obtener todos los datos que ve el usuario y mostrarlos en home de panel data
  selectViews = (): void => {
    this.logins = false;
    this.view_permisos = false;
    this.loading = true;

    this.api_panel.getActivitiesViews().subscribe(
      (data: any) => {
        this.activitiesViews = data;
        if (this.activitiesViews.length > 0) {
          this.views = true;
          this.loading = false;
        }
      }
    );

  };

  ngOnInit() {
  }

}
