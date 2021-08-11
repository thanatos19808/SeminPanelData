import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { AuthService } from "../../../../services/auth.service";
import { PanelDataService } from '../../../../services/panel-data.service';
import { DataApiService } from '../../../../services/data-api.service';

@Component({
  selector: 'app-nav-panel-corporativo',
  templateUrl: './nav-panel-corporativo.component.html',
  styleUrls: ['./nav-panel-corporativo.component.css']
})
export class NavPanelCorporativoComponent implements OnInit {

  constructor(
    private api_panel: PanelDataService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
  }

  onLogout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("accessToken");
    this.router.navigate(['/login']);
    // return this.authService.logoutuser()
  }

}
